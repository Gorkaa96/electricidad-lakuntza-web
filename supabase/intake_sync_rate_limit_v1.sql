-- 2026-11-03 — safe public-intake quota and one-way initial CRM linking
-- Existing migrations: bootstrap_v2, roles_permissions_v1, agent_assignments_v1,
-- agent_limited_edit_v1, commercial_crm_v1. Public intake remains disabled.

-- A single customer can request both electricity and gas.
alter table public.commercial_leads drop constraint if exists commercial_leads_service_check;
alter table public.commercial_leads add constraint commercial_leads_service_check
  check (service in ('luz','gas','luz_gas','alarmas','cargadores','asesoria'));

-- Invoices own their CRM opportunity; deleting the invoice deletes linked metadata
-- and audit events, instead of leaving an orphan customer contact.
alter table public.commercial_leads
  drop constraint if exists commercial_leads_invoice_review_lead_id_fkey;
alter table public.commercial_leads
  add constraint commercial_leads_invoice_review_lead_id_fkey
  foreign key (invoice_review_lead_id) references public.invoice_review_leads(id)
  on delete cascade;

create or replace function app_private.sync_invoice_to_commercial()
returns trigger
language plpgsql security definer set search_path = ''
as $fn$
begin
  if tg_op = 'INSERT' then
    insert into public.commercial_leads (
      service, contact_name, contact_phone, contact_email, customer_type,
      origin, status, assigned_to, invoice_review_lead_id
    ) values (
      new.supply_type, new.name, new.phone, new.email, new.customer_type,
      'web', new.status, new.assigned_to, new.id
    )
    on conflict (invoice_review_lead_id) do nothing;
  elsif tg_op = 'UPDATE' then
    if new.status is distinct from old.status
       or new.assigned_to is distinct from old.assigned_to then
      update public.commercial_leads lead
        set status = new.status, assigned_to = new.assigned_to
        where lead.invoice_review_lead_id = new.id
        and (lead.status is distinct from new.status
          or lead.assigned_to is distinct from new.assigned_to);
    end if;
  end if;
  return new;
end;
$fn$;

revoke all on function app_private.sync_invoice_to_commercial()
  from public, anon, authenticated;
drop trigger if exists sync_invoice_to_commercial on public.invoice_review_leads;
create trigger sync_invoice_to_commercial
after insert or update of status, assigned_to on public.invoice_review_leads
for each row execute function app_private.sync_invoice_to_commercial();

create or replace function app_private.sync_commercial_to_invoice()
returns trigger
language plpgsql security definer set search_path = ''
as $fn$
begin
  if new.invoice_review_lead_id is not null
     and (new.status is distinct from old.status
          or new.assigned_to is distinct from old.assigned_to) then
    update public.invoice_review_leads lead
      set status = new.status, assigned_to = new.assigned_to
    where lead.id = new.invoice_review_lead_id
    and (lead.status is distinct from new.status
         or lead.assigned_to is distinct from new.assigned_to);
  end if;
  return new;
end;
$fn$;

revoke all on function app_private.sync_commercial_to_invoice()
  from public, anon, authenticated;
drop trigger if exists sync_commercial_to_invoice on public.commercial_leads;
create trigger sync_commercial_to_invoice
after update of status, assigned_to on public.commercial_leads
for each row execute function app_private.sync_commercial_to_invoice();

-- A DB-backed atomic hourly limit is independent of serverless-instance memory.
-- IP/contact identifiers are HMAC hashes supplied by the trusted server; no raw
-- addresses or phone numbers are stored here.
create table if not exists app_private.public_intake_quota (
  fingerprint text not null check (fingerprint ~ '^[a-f0-9]{64}$'),
  window_hour timestamptz not null,
  request_count int not null default 1,
  primary key (fingerprint, window_hour)
);
revoke all on app_private.public_intake_quota from public, anon, authenticated, service_role;
alter table app_private.public_intake_quota enable row level security;

create or replace function public.consume_public_intake_quota(fingerprint text)
returns boolean
language plpgsql volatile security definer set search_path = ''
as $fn$
declare n int;
begin
  if fingerprint is null or fingerprint !~ '^[a-f0-9]{64}$' then
    return false;
  end if;
  -- A maximum of four attempts per token and hour, counted atomically.
  insert into app_private.public_intake_quota (fingerprint, window_hour, request_count)
    values (fingerprint, date_trunc('hour', now()), 1)
  on conflict (fingerprint, window_hour)
    do update set request_count = app_private.public_intake_quota.request_count + 1
  returning request_count into n;
  delete from app_private.public_intake_quota
    where window_hour < date_trunc('hour', now()) - interval '2 days';
  return n <= 4;
end;
$fn$;
revoke all on function public.consume_public_intake_quota(text)
  from public, anon, authenticated;
grant execute on function public.consume_public_intake_quota(text) to service_role;

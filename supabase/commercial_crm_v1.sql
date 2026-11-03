-- Electricidad Lakuntza — internal commercial opportunities, stage 1.
-- Internal registration only. Public intake remains disabled until separate QA and anti-abuse.
-- Requires roles_and_agent_permissions_v1, agent_assignments_v1, agent_limited_edit_v1.
-- DO NOT expose app_private in the Supabase Data API.

create table public.commercial_leads (
  id uuid primary key default gen_random_uuid(),
  service text not null check (service in ('luz','gas','alarmas','cargadores','asesoria')),
  contact_name text not null check (char_length(btrim(contact_name)) between 2 and 160),
  contact_phone text,
  contact_email text,
  customer_type text not null default 'vivienda'
    check (customer_type in ('vivienda','negocio','comunidad','otro')),
  origin text not null default 'manual'
    check (origin in ('manual','whatsapp','telefono','email','web')),
  status text not null default 'new'
    check (status in ('new','reviewing','contacted','converted','discarded')),
  notes text check (notes is null or char_length(notes) <= 4000),
  next_contact_on date,
  contacted_at timestamptz,
  converted_at timestamptz,
  assigned_to uuid references public.admin_users(user_id) on delete set null,
  created_by uuid references auth.users(id) on delete set null,
  invoice_review_lead_id uuid unique references public.invoice_review_leads(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint commercial_leads_have_contact check (
    nullif(btrim(coalesce(contact_phone,'')), '') is not null
    or nullif(btrim(coalesce(contact_email,'')), '') is not null
  )
);

create index commercial_leads_status_created_idx on public.commercial_leads(status, created_at desc);
create index commercial_leads_assigned_created_idx on public.commercial_leads(assigned_to, created_at desc);
create index commercial_leads_service_created_idx on public.commercial_leads(service, created_at desc);
create index commercial_leads_followup_idx on public.commercial_leads(next_contact_on) where next_contact_on is not null;

alter table public.commercial_leads enable row level security;

create policy "Commercial read all or assigned"
  on public.commercial_leads for select to authenticated
  using (
    (select app_private.has_permission('leads.read_all'))
    or (
      assigned_to = (select auth.uid())
      and (select app_private.has_permission('leads.read_assigned'))
    )
  );

create policy "Commercial create by managers"
  on public.commercial_leads for insert to authenticated
  with check (
    (select app_private.has_permission('leads.edit_all'))
    and created_by = (select auth.uid())
    and (
      assigned_to is null
      or (select app_private.has_permission('leads.assign'))
    )
  );

create policy "Commercial edit all or assigned"
  on public.commercial_leads for update to authenticated
  using (
    (select app_private.has_permission('leads.edit_all'))
    or (
      assigned_to = (select auth.uid())
      and (select app_private.has_permission('leads.edit_assigned'))
    )
  )
  with check (
    (select app_private.has_permission('leads.edit_all'))
    or (
      assigned_to = (select auth.uid())
      and (select app_private.has_permission('leads.edit_assigned'))
    )
  );

create policy "Commercial delete privileged"
  on public.commercial_leads for delete to authenticated
  using ((select app_private.has_permission('leads.delete')));

-- Private helper: no direct Data API exposure.
create or replace function app_private.protect_commercial_lead_fields()
returns trigger
language plpgsql security invoker
set search_path = ''
as $fn$
begin
  new.updated_at := now();

  if current_user = 'authenticated' then
    if new.assigned_to is distinct from old.assigned_to
       and not app_private.has_permission('leads.assign') then
      raise exception 'Insufficient permission to reassign a commercial lead'
        using errcode = '42501';
    end if;

    if app_private.has_permission('leads.edit_assigned')
       and not app_private.has_permission('leads.edit_all') then
      if (to_jsonb(new) - array[
        'status','notes','next_contact_on','contacted_at',
        'converted_at','updated_at'
      ]::text[]) is distinct from
         (to_jsonb(old) - array[
        'status','notes','next_contact_on','contacted_at',
        'converted_at','updated_at'
      ]::text[]) then
        raise exception 'Assigned agents may only edit status, follow-up and notes'
          using errcode = '42501';
      end if;
    end if;
  end if;
  return new;
end;
$fn$;

revoke all on function app_private.protect_commercial_lead_fields() from public, anon, authenticated;

create trigger protect_commercial_lead_fields
before update on public.commercial_leads
for each row execute function app_private.protect_commercial_lead_fields();

-- Append-only activity log. Only the internal trigger writes events.
create table public.commercial_lead_events (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.commercial_leads(id) on delete cascade,
  event_type text not null check (event_type in ('created','status_changed','assignment_changed')),
  actor_id uuid references auth.users(id) on delete set null,
  description text not null,
  created_at timestamptz not null default now()
);

create index commercial_lead_events_lead_created_idx
  on public.commercial_lead_events(lead_id, created_at desc);

alter table public.commercial_lead_events enable row level security;
create policy "Commercial read events for visible leads"
  on public.commercial_lead_events for select to authenticated
  using (
    exists (select 1 from public.commercial_leads lead where lead.id=lead_id)
  );

create or replace function app_private.audit_commercial_lead()
returns trigger
language plpgsql security definer
set search_path = ''
as $fn$
begin
  if tg_op = 'INSERT' then
    insert into public.commercial_lead_events (lead_id,event_type,actor_id,description)
    values(new.id,'created',coalesce(auth.uid(),new.created_by),'Oportunidad registrada en el CRM');
  elsif new.status is distinct from old.status then
    insert into public.commercial_lead_events (lead_id,event_type,actor_id,description)
    values(new.id,'status_changed',auth.uid(),'Estado actualizado: ' || new.status);
  end if;
  if tg_op = 'UPDATE' and new.assigned_to is distinct from old.assigned_to then
    insert into public.commercial_lead_events (lead_id,event_type,actor_id,description)
    values(new.id,'assignment_changed',auth.uid(),'Asignación de agente modificada');
  end if;
  return new;
end;
$fn$;

revoke all on function app_private.audit_commercial_lead() from public, anon, authenticated;

create trigger audit_commercial_lead
after insert or update on public.commercial_leads
for each row execute function app_private.audit_commercial_lead();

-- No anonymous access, including INSERT. RLS does not secure TRUNCATE/TRIGGER.
revoke all on public.commercial_leads, public.commercial_lead_events from anon, authenticated;
grant select, insert, update, delete on public.commercial_leads to authenticated;
grant select on public.commercial_lead_events to authenticated;
grant select, insert, update, delete on public.commercial_leads, public.commercial_lead_events to service_role;

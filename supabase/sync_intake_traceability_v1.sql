create or replace function app_private.sync_invoice_to_commercial()
returns trigger
language plpgsql security definer set search_path = ''
as $fn$
begin
  if tg_op = 'INSERT' then
    insert into public.commercial_leads (
      service, contact_name, contact_phone, contact_email, customer_type,
      origin, status, assigned_to, invoice_review_lead_id,
      consent_accepted_at, privacy_notice_version, notification_status
    ) values (
      new.supply_type, new.name, new.phone, new.email, new.customer_type,
      'web', new.status, new.assigned_to, new.id,
      new.consent_accepted_at, new.privacy_notice_version, new.notification_status
    )
    on conflict (invoice_review_lead_id) do nothing;
  elsif tg_op = 'UPDATE' then
    if new.status is distinct from old.status
       or new.assigned_to is distinct from old.assigned_to
       or new.notification_status is distinct from old.notification_status
       or new.consent_accepted_at is distinct from old.consent_accepted_at
       or new.privacy_notice_version is distinct from old.privacy_notice_version then
      update public.commercial_leads lead
        set status = new.status, assigned_to = new.assigned_to,
            notification_status = new.notification_status,
            consent_accepted_at = new.consent_accepted_at,
            privacy_notice_version = new.privacy_notice_version
        where lead.invoice_review_lead_id = new.id
        and (lead.status is distinct from new.status
          or lead.assigned_to is distinct from new.assigned_to
          or lead.notification_status is distinct from new.notification_status
          or lead.consent_accepted_at is distinct from new.consent_accepted_at
          or lead.privacy_notice_version is distinct from new.privacy_notice_version);
    end if;
  end if;
  return new;
end;
$fn$;

revoke all on function app_private.sync_invoice_to_commercial()
  from public, anon, authenticated;
drop trigger if exists sync_invoice_to_commercial on public.invoice_review_leads;
create trigger sync_invoice_to_commercial
after insert or update of status, assigned_to, notification_status, consent_accepted_at, privacy_notice_version on public.invoice_review_leads
for each row execute function app_private.sync_invoice_to_commercial();


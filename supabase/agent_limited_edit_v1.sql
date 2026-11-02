-- Limit edits made by staff with leads.edit_assigned but not leads.edit_all.
-- RLS determines which rows may be updated; this trigger restricts which columns.
create or replace function app_private.protect_assigned_lead_fields()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $fn$
begin
  if current_user = 'authenticated'
     and app_private.has_permission('leads.edit_assigned')
     and not app_private.has_permission('leads.edit_all') then
    if (to_jsonb(new) - array[
      'status', 'admin_notes', 'contacted_at', 'converted_at',
      'precheck_result', 'analysis_result', 'analysis_reasons',
      'extracted_cups', 'extracted_tariff', 'contracted_power_kw',
      'consumption_kwh', 'invoice_total_eur', 'billing_days',
      'has_extra_services', 'ocr_status', 'ocr_confidence_avg',
      'ocr_requires_manual_review', 'ocr_processed_at'
    ]::text[])
       is distinct from
       (to_jsonb(old) - array[
      'status', 'admin_notes', 'contacted_at', 'converted_at',
      'precheck_result', 'analysis_result', 'analysis_reasons',
      'extracted_cups', 'extracted_tariff', 'contracted_power_kw',
      'consumption_kwh', 'invoice_total_eur', 'billing_days',
      'has_extra_services', 'ocr_status', 'ocr_confidence_avg',
      'ocr_requires_manual_review', 'ocr_processed_at'
    ]::text[]) then
      raise exception 'Only status, analysis and internal notes can be edited on assigned leads'
        using errcode = '42501';
    end if;
  end if;
  return new;
end;
$fn$;

revoke all on function app_private.protect_assigned_lead_fields() from public, anon, authenticated;
drop trigger if exists protect_assigned_lead_fields on public.invoice_review_leads;
create trigger protect_assigned_lead_fields
  before update on public.invoice_review_leads
  for each row execute function app_private.protect_assigned_lead_fields();

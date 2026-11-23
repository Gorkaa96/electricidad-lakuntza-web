-- Additive migration; leaves both public intake flags disabled.
-- NULL historical consent fields deliberately do not invent past acceptance.
alter table public.commercial_leads
  add column consent_accepted_at timestamptz,
  add column privacy_notice_version text,
  add column notification_status text not null default 'not_requested'
    check (notification_status in ('not_requested','pending','accepted','failed'));
alter table public.invoice_review_leads
  add column consent_accepted_at timestamptz,
  add column privacy_notice_version text,
  add column notification_status text not null default 'not_requested'
    check (notification_status in ('not_requested','pending','accepted','failed'));
comment on column public.commercial_leads.notification_status is
  'accepted means provider accepted; not proof of email delivery';
comment on column public.invoice_review_leads.notification_status is
  'accepted means provider accepted; not proof of email delivery';

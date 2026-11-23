-- Add indexes for remaining FK relations used by role and CRM management.
create index if not exists admin_users_created_by_idx
  on public.admin_users (created_by)
  where created_by is not null;
create index if not exists commercial_lead_events_actor_idx
  on public.commercial_lead_events (actor_id)
  where actor_id is not null;
create index if not exists commercial_leads_created_by_idx
  on public.commercial_leads (created_by)
  where created_by is not null;

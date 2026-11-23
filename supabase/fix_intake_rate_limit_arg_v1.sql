-- Fix the deployed rate-limiter function after initial migration.
create or replace function public.consume_public_intake_quota(fingerprint text)
returns boolean
language plpgsql volatile security definer set search_path = ''
as $fn$
declare
  n int;
  p_fingerprint alias for $1;
begin
  if p_fingerprint is null or p_fingerprint !~ '^[a-f0-9]{64}$' then
    return false;
  end if;
  insert into app_private.public_intake_quota (fingerprint, window_hour, request_count)
    values (p_fingerprint, date_trunc('hour', now()), 1)
  on conflict on constraint public_intake_quota_pkey
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

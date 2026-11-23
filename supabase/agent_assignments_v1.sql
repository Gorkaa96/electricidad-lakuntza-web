-- Grant assignment managers read-only visibility of the member directory.
-- Role updates still require trusted server-side user management.
drop policy if exists "Members read own or manageable membership" on public.admin_users;
create policy "Members read own or manageable membership"
on public.admin_users for select to authenticated
using (
  user_id=(select auth.uid())
  or (select app_private.has_permission('users.manage'))
  or (select app_private.has_permission('leads.assign'))
);

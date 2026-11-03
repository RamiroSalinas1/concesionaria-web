-- Hosted postgres cannot grant custom roles USAGE on managed auth schema.
-- Keep is_admin owned by a narrow role and bridge only the CURRENT live session.
create function private.active_session_user_id() returns uuid
language sql stable security definer set search_path = '' as $$
  select (select auth.uid())
  where exists (
    select 1 from auth.sessions s
    where s.user_id = (select auth.uid())
      and s.id::text = (select auth.jwt()->>'session_id')
      and (s.not_after is null or s.not_after > now())
  );
$$;
revoke all on function private.active_session_user_id() from public, anon, authenticated, service_role;
grant execute on function private.active_session_user_id() to concesionaria_auth_reader;

grant concesionaria_auth_reader to postgres;
create or replace function private.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from private.admin_account a
    where a.slot and a.user_id = (select private.active_session_user_id())
  );
$$;
revoke concesionaria_auth_reader from postgres;
revoke select on auth.sessions from concesionaria_auth_reader;
revoke usage on schema auth from concesionaria_auth_reader;
notify pgrst, 'reload schema';

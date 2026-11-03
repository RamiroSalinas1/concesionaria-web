-- Run ONLY as the project owner in the SQL editor or psql, outside migrations.
-- Replace the placeholder locally. Never commit the email or credentials.
-- Inspect project ref/name/organization first; disable signup and anonymous Auth.
begin;
select pg_advisory_xact_lock(hashtext('concesionaria-single-admin-bootstrap'));
do $$
declare
  target_email text := 'REPLACE_LOCALLY_WITH_ADMIN_EMAIL';
  target_id uuid;
  existing_id uuid;
begin
  if target_email = 'REPLACE_LOCALLY_WITH_ADMIN_EMAIL' then
    raise exception 'Set the authorized email locally before running bootstrap';
  end if;
  if (select count(*) from auth.users) <> 1 then
    raise exception 'Expected exactly the intended initial Auth user; inspect manually';
  end if;
  select id into target_id from auth.users
    where lower(email) = lower(target_email) and email_confirmed_at is not null
      and not coalesce(is_anonymous,false);
  if target_id is null then raise exception 'Confirmed non-anonymous initial user required'; end if;
  select user_id into existing_id from private.admin_account where slot;
  if existing_id is not null and existing_id <> target_id then
    raise exception 'An administrator is already configured; replacement requires maintenance';
  end if;
  insert into private.admin_account(user_id) values (target_id) on conflict (slot) do nothing;
end $$;
commit;

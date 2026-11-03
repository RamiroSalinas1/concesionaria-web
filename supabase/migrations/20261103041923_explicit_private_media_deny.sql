-- Explicit restrictive policies document and preserve the private boundary.
create policy clients_never_read_media_map on private.published_media
  as restrictive for all to anon, authenticated using (false) with check (false);
create policy clients_never_manage_admin on private.admin_account
  as restrictive for all to anon, authenticated using (false) with check (false);

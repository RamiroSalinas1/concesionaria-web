-- Stage 3: deny-by-default foundation; no editorial write/publication RPC yet.
create schema if not exists private;
create schema if not exists app;
create schema if not exists catalog;
revoke all on schema private, app, catalog from public, anon, authenticated;
grant usage on schema app to authenticated;
grant usage on schema catalog to anon, authenticated;

create table private.admin_account (
  slot boolean primary key default true check (slot),
  user_id uuid not null unique references auth.users(id) on delete restrict,
  created_at timestamptz not null default now()
);
alter table private.admin_account enable row level security;

-- A deliberately narrow, non-login owner: no postgres/service-role privileges.
create role concesionaria_auth_reader nologin noinherit;
-- Hosted postgres is not a superuser; ownership transfer needs temporary SET.
grant concesionaria_auth_reader to postgres;
grant usage on schema private, auth to concesionaria_auth_reader;
grant create on schema private to concesionaria_auth_reader;
grant select on private.admin_account, auth.sessions to concesionaria_auth_reader;
grant execute on function auth.uid(), auth.jwt() to concesionaria_auth_reader;
create policy admin_lookup on private.admin_account for select
  to concesionaria_auth_reader using (true);

create function private.is_admin() returns boolean
language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from private.admin_account a
    join auth.sessions s on s.user_id = a.user_id
    where a.slot and a.user_id = (select auth.uid())
      and s.id::text = (select auth.jwt()->>'session_id')
      and (s.not_after is null or s.not_after > now())
  );
$$;
alter function private.is_admin() owner to concesionaria_auth_reader;
revoke create on schema private from concesionaria_auth_reader;
revoke concesionaria_auth_reader from postgres;
revoke all on function private.is_admin() from public, anon, authenticated;
grant usage on schema private to authenticated;
grant execute on function private.is_admin() to authenticated;

create function public.is_admin() returns boolean
language sql stable security invoker set search_path = '' as $$
  select private.is_admin();
$$;
revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create table app.media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket_id text not null default 'vehicle-media' check (bucket_id = 'vehicle-media'),
  object_path text not null unique check (
    object_path ~ '^[0-9a-f-]{36}/[0-9a-f-]{36}\.(jpg|png|webp|avif)$'
  ),
  sha256 text not null check (sha256 ~ '^[0-9a-f]{64}$'),
  mime_type text not null check (mime_type in ('image/jpeg','image/png','image/webp','image/avif')),
  size_bytes bigint not null check (size_bytes between 1 and 10485760),
  width integer not null check (width between 1 and 12000),
  height integer not null check (height between 1 and 12000),
  validation_status text not null default 'pending' check (validation_status in ('pending','ready','rejected')),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (bucket_id, object_path)
);
create table app.vehicles (
  id uuid primary key default gen_random_uuid(),
  draft_revision_id uuid,
  published_revision_id uuid,
  lock_version bigint not null default 0 check (lock_version >= 0),
  archived_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create table app.vehicle_revisions (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references app.vehicles(id) on delete restrict,
  revision_number integer not null check (revision_number > 0),
  schema_version integer not null default 1 check (schema_version = 1),
  source_revision_id uuid,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  slug text check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  vehicle_type text check (vehicle_type in ('car','motorcycle','other')),
  brand text,
  model text,
  variant text,
  year integer check (year between 1886 and 2200),
  kilometers integer check (kilometers >= 0),
  condition text check (condition in ('new','used')),
  description text,
  features jsonb not null default '{}' check (jsonb_typeof(features) = 'object'),
  price_mode text not null default 'on_request' check (price_mode in ('fixed','on_request')),
  price_amount numeric(14,2),
  currency text check (currency in ('ARS','USD')),
  availability text not null default 'available' check (availability in ('available','reserved','sold')),
  check ((price_mode = 'on_request' and price_amount is null and currency is null)
    or (price_mode = 'fixed' and price_amount is not null and price_amount > 0 and currency is not null)),
  unique (vehicle_id, revision_number),
  unique (vehicle_id, id),
  foreign key (vehicle_id, source_revision_id) references app.vehicle_revisions(vehicle_id, id) on delete restrict
);
alter table app.vehicles
  add foreign key (id, draft_revision_id) references app.vehicle_revisions(vehicle_id,id) on delete restrict,
  add foreign key (id, published_revision_id) references app.vehicle_revisions(vehicle_id,id) on delete restrict;
create table app.vehicle_revision_payments (
  revision_id uuid not null references app.vehicle_revisions(id) on delete restrict,
  method text not null check (method in ('cash','bank_transfer','financing','trade_in')),
  enabled boolean not null default false,
  description text,
  primary key (revision_id, method)
);
create table app.vehicle_revision_images (
  revision_id uuid not null references app.vehicle_revisions(id) on delete restrict,
  asset_id uuid not null references app.media_assets(id) on delete restrict,
  position integer not null check (position >= 0),
  alt_text text not null,
  is_cover boolean not null default false,
  primary key (revision_id, asset_id),
  unique (revision_id, position)
);
create unique index vehicle_revision_one_cover on app.vehicle_revision_images(revision_id) where is_cover;

create table app.site (
  slot boolean primary key default true check (slot),
  draft_revision_id uuid,
  published_revision_id uuid,
  lock_version bigint not null default 0 check (lock_version >= 0)
);
insert into app.site(slot) values (true);
create table app.site_revisions (
  id uuid primary key default gen_random_uuid(),
  site_slot boolean not null default true references app.site(slot) on delete restrict,
  revision_number integer not null unique check (revision_number > 0),
  schema_version integer not null default 1 check (schema_version = 1),
  source_revision_id uuid references app.site_revisions(id) on delete restrict,
  settings jsonb not null check (jsonb_typeof(settings) = 'object'),
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (site_slot, id)
);
alter table app.site
  add foreign key (slot, draft_revision_id) references app.site_revisions(site_slot,id) on delete restrict,
  add foreign key (slot, published_revision_id) references app.site_revisions(site_slot,id) on delete restrict;
create table app.site_revision_media (
  revision_id uuid not null references app.site_revisions(id) on delete restrict,
  asset_id uuid not null references app.media_assets(id) on delete restrict,
  purpose text not null check (purpose in ('logo','hero','block')),
  block_id text not null default '',
  primary key (revision_id, purpose, block_id)
);
create table app.site_revision_featured (
  revision_id uuid not null references app.site_revisions(id) on delete restrict,
  vehicle_id uuid not null references app.vehicles(id) on delete restrict,
  position integer not null check (position >= 0),
  primary key (revision_id, vehicle_id),
  unique (revision_id, position)
);
create table app.audit_events (
  id uuid primary key default gen_random_uuid(),
  operation_id uuid not null unique,
  actor_id uuid not null references auth.users(id) on delete restrict,
  entity_type text not null check (entity_type in ('vehicle','site','media')),
  entity_id uuid not null,
  action text not null check (action in ('save','publish','withdraw','archive','trash','restore','recover')),
  previous_revision_id uuid,
  new_revision_id uuid,
  source_revision_id uuid,
  created_at timestamptz not null default now()
);

-- Physical projection: no joins/views over a draft and no private payload column.
create table catalog.vehicles (
  id uuid primary key references app.vehicles(id) on delete restrict,
  slug text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  vehicle_type text not null check (vehicle_type in ('car','motorcycle','other')),
  brand text not null check (length(trim(brand)) > 0),
  model text not null check (length(trim(model)) > 0),
  variant text,
  year integer not null check (year between 1886 and 2200),
  kilometers integer check (kilometers >= 0),
  condition text not null check (condition in ('new','used')),
  description text,
  price_mode text not null check (price_mode in ('fixed','on_request')),
  price_amount numeric(14,2),
  currency text check (currency in ('ARS','USD')),
  availability text not null check (availability in ('available','reserved','sold')),
  published_at timestamptz not null default now(),
  check ((price_mode = 'on_request' and price_amount is null and currency is null)
    or (price_mode = 'fixed' and price_amount is not null and price_amount > 0 and currency is not null))
);
create table catalog.vehicle_payments (
  vehicle_id uuid not null references catalog.vehicles(id) on delete restrict,
  method text not null check (method in ('cash','bank_transfer','financing','trade_in')),
  description text,
  primary key (vehicle_id, method)
);
create table catalog.site_settings (
  slot boolean primary key default true check (slot),
  name text not null,
  public_settings jsonb not null check (jsonb_typeof(public_settings) = 'object'),
  published_at timestamptz not null default now()
);
create table catalog.media_references (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references catalog.vehicles(id) on delete restrict,
  site_slot boolean references catalog.site_settings(slot) on delete restrict,
  position integer not null check (position >= 0),
  alt_text text not null,
  is_cover boolean not null default false,
  check (num_nonnulls(vehicle_id,site_slot) = 1)
);
create table private.published_media (
  reference_id uuid primary key references catalog.media_references(id) on delete restrict,
  asset_id uuid not null references app.media_assets(id) on delete restrict
);
alter table private.published_media enable row level security;

-- Service-only resolver checks the live projection again. Never accepts paths.
create function public.resolve_published_media(reference uuid)
returns table(bucket_id text, object_path text, mime_type text)
language sql stable security invoker set search_path = '' as $$
  select a.bucket_id, a.object_path, a.mime_type
  from catalog.media_references r
  join private.published_media p on p.reference_id = r.id
  join app.media_assets a on a.id = p.asset_id
  where r.id = reference and a.validation_status = 'ready';
$$;
revoke all on function public.resolve_published_media(uuid) from public, anon, authenticated;
grant usage on schema private, app, catalog to service_role;
grant select on private.published_media, app.media_assets, catalog.media_references to service_role;
grant execute on function public.resolve_published_media(uuid) to service_role;

-- No DML for clients. Future bounded editorial RPCs must write revision + audit
-- in one transaction, perform optimistic locking and publish explicitly.
do $$ declare t record; begin
  for t in select tablename from pg_tables where schemaname = 'app' loop
    execute format('alter table app.%I enable row level security', t.tablename);
    execute format('revoke all on app.%I from public, anon, authenticated', t.tablename);
    execute format('grant select on app.%I to authenticated', t.tablename);
    execute format('create policy admin_read on app.%I for select to authenticated using ((select private.is_admin()))', t.tablename);
  end loop;
  for t in select tablename from pg_tables where schemaname = 'catalog' loop
    execute format('alter table catalog.%I enable row level security', t.tablename);
    execute format('revoke all on catalog.%I from public, anon, authenticated', t.tablename);
    execute format('grant select on catalog.%I to anon, authenticated', t.tablename);
    execute format('create policy published_read on catalog.%I for select to anon, authenticated using (true)', t.tablename);
  end loop;
end $$;
revoke all on private.admin_account, private.published_media from public, anon, authenticated;
alter default privileges in schema app, catalog, private revoke all on tables from public, anon, authenticated;
alter default privileges in schema app, catalog, private revoke execute on functions from public, anon, authenticated;
alter default privileges in schema public revoke execute on functions from public;

create function private.reject_history_change() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin raise exception 'History is append-only' using errcode = '42501'; end;
$$;
revoke all on function private.reject_history_change() from public, anon, authenticated;
do $$ declare t text; begin
  foreach t in array array['vehicle_revisions','vehicle_revision_images','vehicle_revision_payments',
    'site_revisions','site_revision_media','site_revision_featured','audit_events'] loop
    execute format('create trigger immutable_history before update or delete on app.%I for each row execute function private.reject_history_change()', t);
  end loop;
end $$;
create function private.protect_asset_path() returns trigger
language plpgsql security invoker set search_path = '' as $$
begin
  if new.object_path <> old.object_path or new.bucket_id <> old.bucket_id or new.id <> old.id then
    raise exception 'Asset paths are immutable' using errcode = '42501';
  end if;
  return new;
end;
$$;
revoke all on function private.protect_asset_path() from public, anon, authenticated;
create trigger immutable_asset_path before update on app.media_assets
  for each row execute function private.protect_asset_path();

insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('vehicle-media','vehicle-media',false,10485760,
  array['image/jpeg','image/png','image/webp','image/avif']);
create policy admin_media_read on storage.objects for select to authenticated
  using (bucket_id = 'vehicle-media' and (select private.is_admin()));
-- Uploads remain closed until real-content validation/re-export is implemented.
-- No INSERT/UPDATE/DELETE policy: cannot overwrite or purge retained files.

create index media_assets_created_by_idx on app.media_assets(created_by);
create index vehicle_revisions_author_idx on app.vehicle_revisions(created_by);
create index vehicle_revisions_source_idx on app.vehicle_revisions(vehicle_id,source_revision_id);
create index vehicles_draft_idx on app.vehicles(id,draft_revision_id);
create index vehicles_published_idx on app.vehicles(id,published_revision_id);
create index revision_images_asset_idx on app.vehicle_revision_images(asset_id);
create index site_revisions_author_idx on app.site_revisions(created_by);
create index site_revisions_source_idx on app.site_revisions(source_revision_id);
create index site_draft_idx on app.site(slot,draft_revision_id);
create index site_published_idx on app.site(slot,published_revision_id);
create index site_media_asset_idx on app.site_revision_media(asset_id);
create index site_featured_vehicle_idx on app.site_revision_featured(vehicle_id);
create index audit_actor_idx on app.audit_events(actor_id);
create index audit_entity_idx on app.audit_events(entity_type,entity_id,created_at desc);
create index media_references_vehicle_idx on catalog.media_references(vehicle_id);
create index media_references_site_idx on catalog.media_references(site_slot);
create index published_media_asset_idx on private.published_media(asset_id);

-- Explicit exposed schemas; private is intentionally absent.
alter role authenticator set pgrst.db_schemas = 'public, graphql_public, catalog, app';
notify pgrst, 'reload config';
notify pgrst, 'reload schema';

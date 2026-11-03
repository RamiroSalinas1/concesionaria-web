import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { PGlite } from "@electric-sql/pglite";

// In-memory PostgreSQL. Auth/Storage service-owned tables are minimal stubs.
// This exercises actual grants, functions, constraints and RLS, not a real login.
const db = new PGlite();
const admin = "00000000-0000-4000-8000-000000000001";
const outsider = "00000000-0000-4000-8000-000000000002";
const session = "00000000-0000-4000-8000-000000000003";
const vehicle = "00000000-0000-4000-8000-000000000004";
const revision = "00000000-0000-4000-8000-000000000005";
const asset = "00000000-0000-4000-8000-000000000006";
const reference = "00000000-0000-4000-8000-000000000007";
let checks = 0;

async function denied(sql, code = "42501") {
  await assert.rejects(db.exec(sql), (error) => error.code === code, sql);
  checks++;
}
async function scalar(sql, expected) {
  const result = await db.query(sql);
  assert.equal(Object.values(result.rows[0])[0], expected, sql);
  checks++;
}
async function as(role, user, sid = session) {
  await db.exec("reset role");
  await db.query("select set_config('request.jwt.claims', $1, false)", [
    JSON.stringify({
      sub: user,
      session_id: sid,
      user_metadata: { admin: true },
    }),
  ]);
  await db.exec(`set role ${role}`);
}

try {
  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create role authenticator nologin;
    create role service_role nologin bypassrls;
    create schema auth;
    create schema storage;
    create table auth.users(id uuid primary key);
    create table auth.sessions(id uuid primary key, user_id uuid references auth.users(id), not_after timestamptz);
    alter table auth.sessions enable row level security;
    create function auth.jwt() returns jsonb language sql stable as $$ select nullif(current_setting('request.jwt.claims',true),'')::jsonb $$;
    create function auth.uid() returns uuid language sql stable as $$ select (auth.jwt()->>'sub')::uuid $$;
    create table storage.buckets(id text primary key, name text, public boolean, file_size_limit bigint, allowed_mime_types text[]);
    create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text references storage.buckets(id), name text);
    alter table storage.objects enable row level security;
    grant usage on schema storage, auth to anon, authenticated, service_role;
    grant select,insert,update,delete on storage.objects to anon, authenticated;
  `);
  for (const name of (await readdir("supabase/migrations"))
    .filter((name) => name.endsWith(".sql"))
    .sort()) {
    await db.exec(await readFile(`supabase/migrations/${name}`, "utf8"));
  }
  await scalar(
    "select has_schema_privilege('concesionaria_auth_reader','auth','usage')",
    false,
  );
  await scalar(
    "select has_table_privilege('concesionaria_auth_reader','auth.sessions','select')",
    false,
  );
  await db.exec(`
    insert into auth.users values ('${admin}'), ('${outsider}');
    insert into auth.sessions values ('${session}','${admin}',null);
    insert into private.admin_account(user_id) values ('${admin}');
    insert into app.vehicles(id) values ('${vehicle}');
    insert into app.vehicle_revisions(id,vehicle_id,revision_number,created_by,brand)
      values ('${revision}','${vehicle}',1,'${admin}','PRIVATE DRAFT');
    update app.vehicles set draft_revision_id = '${revision}' where id = '${vehicle}';
    insert into catalog.vehicles(id,slug,vehicle_type,brand,model,year,condition,price_mode,availability)
      values ('${vehicle}','published','car','PUBLIC','Projection',2020,'used','on_request','available');
    insert into app.media_assets(id,object_path,sha256,mime_type,size_bytes,width,height,created_by,validation_status)
      values ('${asset}','${asset}/${asset}.webp',repeat('a',64),'image/webp',100,10,10,'${admin}','ready');
    insert into app.vehicle_revision_images values ('${revision}','${asset}',0,'private',true);
    insert into storage.objects(bucket_id,name) values ('vehicle-media','${asset}/${asset}.webp');
    insert into catalog.media_references(id,vehicle_id,position,alt_text) values ('${reference}','${vehicle}',0,'published');
    insert into private.published_media values ('${reference}','${asset}');
  `);
  await as("anon", null);
  await scalar("select brand from catalog.vehicles", "PUBLIC");
  await denied("select * from app.vehicle_revisions");
  await denied("select * from private.admin_account");
  await scalar("select count(*)::int from storage.objects", 0);
  await denied("select public.is_admin()");
  await denied(`select * from public.resolve_published_media('${reference}')`);

  await as("authenticated", outsider);
  await scalar("select public.is_admin()", false);
  await scalar("select count(*)::int from app.vehicle_revisions", 0);
  await scalar("select count(*)::int from app.audit_events", 0);
  await scalar("select count(*)::int from storage.objects", 0);
  await scalar("select brand from catalog.vehicles", "PUBLIC");
  await denied(
    `insert into private.admin_account(user_id) values ('${outsider}')`,
  );
  await denied(`update private.admin_account set user_id = '${outsider}'`);
  await denied("insert into app.vehicles default values");
  await denied("delete from catalog.vehicles");
  await denied(`select * from public.resolve_published_media('${reference}')`);

  await as("authenticated", admin);
  await scalar("select public.is_admin()", true);
  await scalar("select brand from app.vehicle_revisions", "PRIVATE DRAFT");
  await scalar("select count(*)::int from storage.objects", 1);
  await denied("update app.vehicle_revisions set brand = 'changed'");
  await denied("delete from app.vehicle_revisions");
  await denied("update catalog.vehicles set brand = 'draft'");
  await denied(
    `insert into private.admin_account(user_id) values ('${outsider}')`,
  );
  await scalar(
    "with removed as (delete from storage.objects returning *) select count(*)::int from removed",
    0,
  );
  await scalar(
    "with changed as (update storage.objects set name='overwrite' returning *) select count(*)::int from changed",
    0,
  );
  await denied(
    "insert into storage.objects(bucket_id,name) values ('vehicle-media','draft.webp')",
  );
  await db.exec("reset role");
  await db.exec(
    `update auth.sessions set not_after=now()-interval '1 second' where id='${session}'`,
  );
  await as("authenticated", admin);
  await scalar("select public.is_admin()", false);
  await db.exec("reset role");
  await db.exec(
    `update auth.sessions set not_after=null where id='${session}'`,
  );
  await as("authenticated", admin, null);
  await scalar("select public.is_admin()", false);
  await as("authenticated", admin);
  await db.exec("reset role");
  await db.exec(`delete from auth.sessions where id = '${session}'`);
  await as("authenticated", admin);
  await scalar("select public.is_admin()", false);
  await scalar("select count(*)::int from app.vehicle_revisions", 0);

  await db.exec("reset role");
  await denied(
    `insert into private.admin_account(user_id) values ('${outsider}')`,
    "23505",
  );
  await denied(
    `insert into private.admin_account(slot,user_id) values (false,'${outsider}')`,
    "23514",
  );
  await denied("update app.vehicle_revisions set brand = 'rewrite history'");
  await denied(`delete from app.media_assets where id = '${asset}'`, "23001");
  await denied(
    `update app.media_assets set object_path='${admin}/${admin}.webp'`,
  );
  await db.exec(
    `insert into app.vehicle_revisions(vehicle_id,revision_number,created_by,brand) values ('${vehicle}',2,'${admin}','NEW PRIVATE DRAFT')`,
  );
  await scalar("select brand from catalog.vehicles", "PUBLIC");
  await denied(
    `insert into app.vehicle_revisions(vehicle_id,revision_number,created_by,price_mode,currency) values ('${vehicle}',3,'${admin}','fixed','ARS')`,
    "23514",
  );
  await db.exec(
    `insert into app.vehicles(id) values ('00000000-0000-4000-8000-000000000008')`,
  );
  await denied(
    `update app.vehicles set draft_revision_id='${revision}' where id='00000000-0000-4000-8000-000000000008'`,
    "23503",
  );
  await db.exec("set role service_role");
  await scalar(
    `select mime_type from public.resolve_published_media('${reference}')`,
    "image/webp",
  );
  await db.exec("reset role");
  await db.exec(
    `delete from private.published_media where reference_id='${reference}'; delete from catalog.media_references where id='${reference}'`,
  );
  await db.exec("set role service_role");
  await scalar(
    `select count(*)::int from public.resolve_published_media('${reference}')`,
    0,
  );
  await db.exec("reset role");
  await scalar("select count(*)::int from app.media_assets", 1);
  console.log(
    `PASS ${checks} isolated PostgreSQL assertions: grants, RLS, session revocation, singleton, immutable history and Storage policies. No real login or hosted Auth test.`,
  );
} finally {
  await db.close();
}

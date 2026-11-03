import assert from "node:assert/strict";
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
assert.equal(
  url,
  "https://lzfqosdaapotitvrvusd.supabase.co",
  "This check is restricted to concesionaria-web",
);
assert(key, "Publishable key required locally");
const headers = { apikey: key, "Content-Type": "application/json" };
const settings = await (
  await fetch(`${url}/auth/v1/settings`, { headers })
).json();
assert.equal(
  settings.disable_signup,
  true,
  "Hosted public signup is still enabled",
);
assert.equal(
  settings.external?.anonymous_users,
  false,
  "Hosted anonymous Auth is still enabled",
);
console.log(
  "PASS hosted Auth settings: signup disabled; anonymous users disabled",
);
// Deliberately invalid email + empty password: can never create an identity,
// even if configuration changes between the settings read and this request.
const signup = await fetch(`${url}/auth/v1/signup`, {
  method: "POST",
  headers,
  body: JSON.stringify({ email: "invalid-email", password: "" }),
});
const signupResult = await signup.json();
assert.equal(signup.ok, false);
assert.equal(signupResult.error_code ?? signupResult.code, "signup_disabled");
console.log(
  "PASS hosted direct signup API: signup_disabled; no identity created",
);

const published = await fetch(`${url}/rest/v1/vehicles?select=id,slug`, {
  headers: { ...headers, "Accept-Profile": "catalog" },
});
assert.equal(published.status, 200);
assert(Array.isArray(await published.json()));
console.log(
  "PASS hosted anonymous Data API: reads only the catalog projection",
);
for (const [schema, table] of [
  ["app", "vehicle_revisions"],
  ["app", "audit_events"],
  ["private", "admin_account"],
  ["private", "published_media"],
]) {
  const response = await fetch(`${url}/rest/v1/${table}?select=*`, {
    headers: { ...headers, "Accept-Profile": schema },
  });
  assert(
    [401, 403, 406].includes(response.status),
    `${schema}.${table} should be denied`,
  );
  console.log(`PASS hosted anonymous Data API denied: ${schema}.${table}`);
}
const resolver = await fetch(`${url}/rest/v1/rpc/resolve_published_media`, {
  method: "POST",
  headers,
  body: JSON.stringify({ reference: "00000000-0000-4000-8000-000000000001" }),
});
assert([401, 403, 404].includes(resolver.status));
const object = await fetch(
  `${url}/storage/v1/object/public/vehicle-media/private.webp`,
  { headers },
);
assert.equal(object.ok, false);
console.log(
  "PASS service-only media resolver denied; private bucket has no public object endpoint",
);
console.log("No real login tested. No users, rows or Storage objects created.");

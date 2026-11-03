// Optional operator command, never imported by the application.
// Node --env-file=.env.local scripts/harden-auth.mjs
import assert from "node:assert/strict";

const ref = "lzfqosdaapotitvrvusd";
const organization = "vercel_icfg_ws6A0OiG1NKsEfSwPVQYuDdq";
const token = process.env.SUPABASE_ACCESS_TOKEN;
assert(
  token,
  "Provide SUPABASE_ACCESS_TOKEN locally; do not paste it into chat or Git.",
);
const api = async (path, method = "GET", body) => {
  const response = await fetch(`https://api.supabase.com/v1${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  // Do not log provider bodies: configuration responses can contain secrets.
  assert(response.ok, `Management API ${method} failed (${response.status})`);
  return response.json();
};

async function verifyTarget() {
  const organizations = await api("/organizations");
  assert(
    organizations.some((item) => item.id === organization),
    "Token lacks the authorized organization",
  );
  const project = await api(`/projects/${ref}`);
  assert.equal(project.name, "concesionaria-web");
  assert.equal(project.organization_id, organization);
  assert.equal(project.id, ref);
  assert.equal(project.region, "sa-east-1");
}
await verifyTarget();
const origin = new URL(process.env.SITE_URL ?? "http://127.0.0.1:3000").origin;
assert(
  origin === "http://127.0.0.1:3000",
  "Stage 3 only authorizes the loopback application origin",
);
await api(`/projects/${ref}/config/auth`, "PATCH", {
  disable_signup: true,
  external_anonymous_users_enabled: false,
  site_url: origin,
  uri_allow_list: `${origin}/auth/callback`,
  password_min_length: 12,
});
const config = await api(`/projects/${ref}/config/auth`);
assert.equal(config.disable_signup, true);
assert.equal(config.external_anonymous_users_enabled, false);
assert.equal(config.site_url, origin);
assert.equal(config.uri_allow_list, `${origin}/auth/callback`);
console.log(
  "PASS: signup/anonymous Auth disabled and exact local redirect configured on concesionaria-web.",
);

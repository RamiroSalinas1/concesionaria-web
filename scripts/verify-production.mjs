import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { setTimeout as delay } from "node:timers/promises";

const origin = "http://127.0.0.1:3100";
const server = spawn(
  process.execPath,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "127.0.0.1",
    "--port",
    "3100",
  ],
  {
    windowsHide: true,
    env: { ...process.env, SITE_URL: origin, NEXT_TELEMETRY_DISABLED: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  },
);
let log = "";
server.stdout.on("data", (data) => {
  log += data.toString();
});
server.stderr.on("data", (data) => {
  log += data.toString();
});
const spawnError = new Promise((_, reject) => server.on("error", reject));

async function waitForServer() {
  for (let attempt = 0; attempt < 80; attempt++) {
    if (server.exitCode !== null) throw new Error(log);
    if (log.includes("Ready in")) return;
    await delay(250);
  }
  throw new Error("El servidor de prueba no inició a tiempo.\n" + log);
}

async function jsFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const groups = await Promise.all(
    entries.map(async (entry) => {
      const target = path.join(directory, entry.name);
      return entry.isDirectory()
        ? jsFiles(target)
        : target.endsWith(".js")
          ? [target]
          : [];
    }),
  );
  return groups.flat();
}

try {
  await Promise.race([waitForServer(), spawnError]);
  const publicRoutes = [
    "/",
    "/catalogo",
    "/catalogo?tipo=moto&moneda=USD&precioDesde=10000",
  ];
  for (const route of publicRoutes) {
    const response = await fetch(origin + route);
    const html = await response.text();
    assert.equal(response.status, 200, route);
    assert(
      !html.includes("Coupé de ejemplo"),
      "Se filtró el fixture: " + route,
    );
    assert(
      !html.includes("Vistas de demostración de desarrollo"),
      "Hay enlaces de demo: " + route,
    );
    assert(
      !html.includes("Sin sesión · Demostración"),
      "Se filtró el panel: " + route,
    );
    assert(
      !/https:\/\/(?:[^"]*supabase|[^"]*vercel)/.test(html),
      "Conexión externa inesperada",
    );
    console.log("PASS 200 sin demos: " + route);
  }
  const privateRoutes = [
    "/desarrollo/ficha",
    "/desarrollo/ficha?precio=consultar",
    "/desarrollo/ficha?galeria=vacia",
    "/desarrollo/panel/vehiculos",
    "/desarrollo/panel/apariencia",
    "/desarrollo/panel/contenido",
    "/desarrollo/panel/contacto",
    "/desarrollo/panel/historial",
    "/vehiculos/no-existe",
    "/vehiculos/coupe-de-ejemplo",
    "/ruta-inexistente",
  ];
  for (const route of privateRoutes) {
    const response = await fetch(origin + route);
    const html = await response.text();
    assert.equal(response.status, 404, route);
    assert(
      !html.includes("Todos los datos e ilustraciones son ficticios"),
      "Se renderizó la demo: " + route,
    );
    console.log("PASS 404: " + route);
  }
  const admin = await fetch(origin + "/admin", { redirect: "manual" });
  assert.equal(admin.status, 307);
  assert.equal(
    new URL(admin.headers.get("location"), origin).pathname,
    "/admin/login",
  );
  assert.match(admin.headers.get("cache-control"), /no-store/);
  const password = await fetch(origin + "/admin/clave", { redirect: "manual" });
  assert.equal(password.status, 307);
  const login = await fetch(origin + "/admin/login");
  assert.equal(login.status, 200);
  assert.match(await login.text(), /Iniciar sesión/);
  assert.match(login.headers.get("cache-control"), /no-store/);
  const api = await fetch(origin + "/api/admin/status");
  assert([401, 503].includes(api.status));
  assert.deepEqual(await api.json(), { authorized: false });
  const spoofed = await fetch(origin + "/api/admin/status", {
    headers: { Cookie: "sb-fake-auth-token=fake" },
  });
  assert([401, 503].includes(spoofed.status));
  for (const route of [
    "/api/media/draft.webp",
    "/api/media/00000000-0000-4000-8000-000000000001?path=draft.webp",
    "/admin/registro",
    "/api/signup",
  ]) {
    const response = await fetch(origin + route);
    assert.equal(response.status, 404, route);
  }
  const callback = await fetch(
    origin + "/auth/callback?next=https://example.invalid",
    { redirect: "manual" },
  );
  assert.equal(callback.status, 307);
  assert.equal(
    new URL(callback.headers.get("location"), origin).origin,
    origin,
  );
  console.log(
    "PASS protected routes/API, fake cookie denied, no-store, recovery callback cannot redirect externally, no signup or arbitrary-path media",
  );
  const vehicle404 = await (
    await fetch(origin + "/vehiculos/no-existe")
  ).text();
  assert(
    vehicle404.includes("Vehículo no encontrado"),
    "Falta el estado de vehículo inexistente",
  );
  let scanned = 0;
  for (const file of await jsFiles(".next/static")) {
    const source = await readFile(file, "utf8");
    assert(
      !source.includes("concept-red"),
      "Fixture incluido en JS público: " + file,
    );
    assert(
      !source.includes("Nombre de muestra"),
      "Panel demo incluido en JS público: " + file,
    );
    scanned++;
  }
  console.log(
    "PASS: " + scanned + " archivos JS públicos sin fixture ni panel demo.",
  );
  console.log(
    "Verificación de producción completada en localhost. Sin despliegue.",
  );
} catch (error) {
  console.error(error);
  console.error(log);
  process.exitCode = 1;
} finally {
  server.kill("SIGTERM");
  if (server.exitCode === null) {
    await Promise.race([once(server, "exit"), delay(5000)]);
  }
}

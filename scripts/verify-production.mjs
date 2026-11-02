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
    env: { ...process.env, NEXT_TELEMETRY_DISABLED: "1" },
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
    "/admin",
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

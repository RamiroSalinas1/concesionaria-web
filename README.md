# Concesionaria Demo

App web para una concesionaria de Argentina. Nombre provisional y editable.

**Etapa 3: Supabase y seguridad para un administrador.** Proyecto independiente Free, esquema/RLS/Storage privado y cuenta inicial restringida. Inicio/cierre y recuperación preparados con SSR. Catálogo vacío y diseño aprobado conservados; sin CRUD, editor ni despliegue. Ver pruebas reales y pendientes en [ESTADO.md](docs/ESTADO.md).

## Abrir la vista local

Requisitos: Node.js **24.x** y pnpm **11.25.0**. Desde el clon:

```powershell
pnpm install --frozen-lockfile
pnpm dev
```

Abrir [http://127.0.0.1:3000](http://127.0.0.1:3000). Ctrl+C detiene el servidor. Solo escucha en loopback.

En este equipo las dependencias ya están instaladas. Si pnpm no está en PATH, iniciar directamente:

```powershell
node node_modules/next/dist/bin/next dev --hostname 127.0.0.1
```

También se incluye scripts/dev.ps1, con puerto opcional: .\scripts\dev.ps1 -Port 3001. La alternativa con Node no requiere cambiar políticas del sistema.

Para reinstalar con el gestor incluido en el runtime de este equipo:

```powershell
node "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\pnpm\bin\pnpm.cjs" install --frozen-lockfile
```

La UI pública funciona sin credenciales y no hay cuentas de visitante. Para Auth copiar `.env.example` a `.env.local` y completar URL, clave publicable del proyecto dedicado y `SITE_URL`. Sin configuración segura el ingreso queda deshabilitado; no se simula una sesión. Seguir [la guía de alta inicial y recuperación](docs/09-supabase-y-acceso.md). No poner secretos en variables `NEXT_PUBLIC_*`.

## Pantallas

| Ruta                               | Disponible                                                                            |
| ---------------------------------- | ------------------------------------------------------------------------------------- |
| /                                  | Portada gráfica original, categorías, destacados vacíos y pie sin contactos ficticios |
| /catalogo                          | Filtros con URL, validación de rangos, moneda explícita, limpieza y estado vacío      |
| /vehiculos/cualquier-slug          | «Vehículo no encontrado», respuesta 404                                               |
| /desarrollo/ficha                  | Ficha ficticia rotulada, galería con ampliación y opciones de pago de ejemplo         |
| /desarrollo/ficha?precio=consultar | Variante de precio a consultar                                                        |
| /desarrollo/ficha?galeria=vacia    | Variante sin imágenes                                                                 |
| /desarrollo/panel/vehiculos        | Panel visual, con Apariencia, Contenido, Contacto e Historial                         |

Las rutas /desarrollo/* devuelven **404 en producción**. Hay guardias en servidor e imports condicionados a desarrollo; no dependen de CSS o de botones ocultos. `/admin/login` permite ingresar con la única cuenta autorizada; `/admin` y `/admin/clave` requieren sesión validada y UUID autorizado. El panel conserva la apariencia existente, sin gestión editorial todavía. `/api/admin/status` repite la autorización en servidor y `/api/catalog` consulta únicamente la proyección pública.

Apariencia cambia solo una muestra en memoria: recargar restablece el valor inicial. No hay guardados simulados, publicación, subidas ni eventos ficticios. Marca permanece deshabilitada hasta tener vehículos publicados.

## Comprobaciones

```powershell
pnpm run typecheck
pnpm run lint
pnpm run format:check
pnpm run build
pnpm run verify:production
pnpm run verify:policies
pnpm run verify:hosted
```

`verify:production` requiere build previo e inicia/detiene un servidor temporal en 127.0.0.1:3100. `verify:policies` prueba grants, RLS, historial y Storage en PostgreSQL aislado en memoria, sin cuentas remotas. `verify:hosted` requiere `.env.local`, solo acepta el proyecto dedicado y comprueba Auth/API públicos sin crear usuarios ni datos. Ninguna sustituye probar el ingreso real y la recuperación por correo.

## Documentación

| Documento                                                 | Contenido                                                   |
| --------------------------------------------------------- | ----------------------------------------------------------- |
| [Estado actual](docs/ESTADO.md)                           | Pruebas, límites, pendientes y siguiente paso               |
| [Supabase y acceso](docs/09-supabase-y-acceso.md)         | Migraciones, cuenta inicial, recuperación, medios y pruebas |
| [Base técnica y diseño](docs/08-base-tecnica-y-diseno.md) | Versiones, estructura, decisiones y recursos                |
| [Capturas](docs/capturas/README.md)                       | Pantallas de escritorio y móvil                             |
| [Revisión inicial](docs/00-revision-inicial.md)           | Foto histórica de accesos y costos                          |
| [Alcance](docs/01-alcance.md)                             | Producto y exclusiones                                      |
| [Arquitectura](docs/02-arquitectura.md)                   | Propuesta de separación público/privado                     |
| [Modelo de datos](docs/03-modelo-de-datos.md)             | Propuesta no implementada                                   |
| [Seguridad](docs/04-seguridad.md)                         | Propuesta Auth, permisos y RLS                              |
| [Flujo editorial](docs/05-flujo-editorial.md)             | Propuesta de borradores, restauración y retención           |
| [Plan preliminar](docs/06-etapas-y-aceptacion.md)         | Ver numeración actual en ESTADO.md                          |
| [Fuentes iniciales](docs/07-versiones-y-fuentes.md)       | Antecedente; no sustituye el lockfile actual                |

Nombre, paleta base, fuentes disponibles, textos y secciones se centralizan con tipos en src/config/site.ts.

## Git y límites

Rama: docs/etapa-0-revision-inicial. [PR borrador #1](https://github.com/RamiroSalinas1/concesionaria-web/pull/1) hacia main, sin fusionar. La revisión inicial se guardó primero en e42db76; esta etapa se guarda en un commit separado.

MVP.md permanece sin modificaciones fuera del clon. Los documentos 00–07 son antecedentes; ESTADO.md informa qué está implementado hoy.

- Proyecto independiente de Documa. No usar ni modificar su repositorio, Supabase documa-dev ni Vercel plataforma-de-control-documental.
- Supabase dedicado `concesionaria-web` creado en `sa-east-1`, con cotización USD 0 mensuales y plan Free. Migraciones y bucket privado aplicados. Sin Vercel, dominios, despliegues ni servicios contratados.
- No desplegar ni contratar recursos con costo sin autorización explícita.
- No subir secretos ni datos privados al repositorio público.
- Antes de publicar: revisión normativa argentina, costos y plan apto comercial. No se afirma cumplimiento legal.

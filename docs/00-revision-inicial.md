# Revisión inicial

Fecha de consulta: **2 de noviembre de 2026**, Argentina. Resultado limitado a los recursos visibles para las conexiones actuales; no acredita que no existan recursos en otras cuentas o instalaciones.

## Carpeta y Git

- Al comenzar, la carpeta contenedora no era un repositorio Git y contenía solo `MVP.md`. Se leyó y preservó sin cambios.
- SHA-256 original de ese archivo: `F17DAADA1854378735B9DE2FB63E3D0CC617089AD469733DBDBFD948E539E08D`.
- Se clonó el repositorio solicitado en la subcarpeta `concesionaria-web`, evitando sobrescribir el archivo previo.
- Remoto `origin`: `https://github.com/RamiroSalinas1/concesionaria-web.git`.
- Rama predeterminada y única rama remota observada: `main`.
- Commit inicial: `30054f2965bcbcc904c7c9c5b26105b84406e11c` (`Initial commit`). Árbol: únicamente `README.md`, con el título del repositorio.
- El clon estaba limpio. No había código, dependencias, lockfile, instrucciones AGENTS.md, workflows, migraciones ni vínculos locales a Supabase/Vercel. No se encontraron instrucciones AGENTS.md en las dos carpetas ascendentes consultadas.
- Se creó la rama local `docs/etapa-0-revision-inicial`. Los documentos de esta etapa quedan como cambios locales revisables; no se hizo commit ni push ni se modificaron ramas remotas.

## Accesos y duplicados

| Servicio | Consulta de lectura | Resultado |
| --- | --- | --- |
| GitHub | Identidad, metadatos, permiso de colaborador, contenido, ramas; clon Git | Usuario `RamiroSalinas1`; repositorio público `RamiroSalinas1/concesionaria-web`; permiso informado `admin`, con lectura/escritura; lectura y clon efectivos |
| Supabase | Listar organizaciones y proyectos; detalle de la organización elegida | Organización encontrada con el nombre e ID indicados; plan informado `free` / `tier_free`; único proyecto visible `documa-dev` |
| Supabase | Cotizar proyecto nuevo en la organización elegida | `amount: 0`, recurrencia mensual, tipo proyecto; se informa como USD 0/mes, sin crear nada |
| Vercel | Listar equipos; obtener equipo; listar proyectos del equipo | Equipo `21salinasramiro-gmailcoms-projects`; único proyecto visible `plataforma-de-control-documental` |

Organización Supabase autorizada para evaluar este proyecto: `21salinasramiro-gmailcom's projects`, ID `vercel_icfg_ws6A0OiG1NKsEfSwPVQYuDdq`.

Equipo Vercel visible: `21salinasramiro-gmailcom's projects`, ID `team_B1GZxmusMGTMBqsDKRg48a2x`. No se confirmó un plan de Vercel ni permisos de creación o despliegue. Las respuestas acreditan las lecturas realizadas; no se probaron mutaciones para verificar permisos.

No se encontró un proyecto Supabase o Vercel de concesionaria entre los visibles. El repositorio GitHub solicitado ya existe y debe reutilizarse. Los listados no devolvieron una página siguiente de proyectos; Git local confirmó una sola rama remota. No se inspeccionaron tablas, usuarios, fotos, secretos ni despliegues de Documa.

## Condiciones económicas consultadas

- La cotización Supabase de USD 0 mensuales es una observación de esta fecha para esta organización, no una garantía de gratuidad permanente ni autorización de creación.
- La página pública Free indica 500 MB de base, 1 GB de archivos, 5 GB de egreso y otros 5 GB de egreso en caché; pausa tras una semana de inactividad y límite de dos proyectos activos. Revalidar cupos efectivos y condiciones de la integración antes de crear. La conservación de fotos puede agotar almacenamiento.
- Vercel Hobby restringe el uso a proyectos personales no comerciales. No asumir que sirve para publicar una concesionaria. Antes de publicar se debe elegir y autorizar un plan apto, sin contratarlo en esta etapa.
- No se consultaron ni revelaron medios de pago, claves o variables. No hubo creación de proyectos, cambio de plan, registro de dominio ni despliegue.

Fuentes económicas: [Supabase Pricing](https://supabase.com/pricing), [Vercel Hobby](https://vercel.com/docs/plans/hobby). La cotización específica procede de la herramienta conectada `get_cost`, no de un precio general de la página.

## Herramientas y verificaciones

- Git local: `2.53.0.windows.3`; Node.js: `24.22.1`.
- `npm` y `gh` no están en PATH. Hay pnpm `11.25.0` en el runtime incluido, ejecutable mediante Node; no se instalaron herramientas globales.
- La red restringida impidió Git y la descarga directa del changelog; se repitieron con escalación autorizada. El clon y la lectura de metadatos/changelog terminaron correctamente.
- Se consultaron documentación oficial, changelog de Supabase y metadatos npm. Ver detalles y límites de compatibilidad en [versiones y fuentes](07-versiones-y-fuentes.md).
- Verificación documental: los 10 archivos Markdown tienen enlaces internos existentes y no presentan espacios finales. `git diff --check` pasó; la búsqueda por patrones de credenciales no encontró coincidencias (no sustituye una auditoría completa).
- `.gitignore` comprobado: excluye `.env`, `.env.local`, vínculos Vercel y dependencias; permite archivos de ejemplo sin valores reales y los futuros lockfiles.
- El hash final de `MVP.md` coincide con el original. No se ejecutaron pruebas de aplicación porque no hay código ni dependencias. Se modificó el README y se agregaron `.gitignore`, `AGENTS.md` y ocho documentos; sin archivos de aplicación ni SQL.

## Pendientes

No hay bloqueo que requiera intervención para completar esta etapa. Para etapas posteriores: decidir correo administrador, política de retención, recuperación/backups, plan comercial apto y datos reales de publicación en sus momentos correspondientes. No se verificaron permisos efectivos de escritura remota, Auth, RLS ni Storage porque aún no hay recursos propios. Eso se probará exclusivamente sobre el futuro proyecto de concesionaria.

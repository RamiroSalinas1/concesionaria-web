# Instrucciones de trabajo

## Alcance y aislamiento

- Leer primero README.md y los documentos de docs/ correspondientes al trabajo solicitado.
- Trabajar por etapas. La etapa 0 es solo revisión y documentación; no implementar funcionalidades de etapas siguientes sin una nueva instrucción del usuario.
- Este repositorio es exclusivamente de concesionaria. No leer contenido de negocio ni modificar código, bases, buckets, variables, despliegues o configuraciones de Documa.
- Antes de cualquier operación remota futura, comprobar identidad, organización, proyecto y entorno. No inferir el proyecto desde la cuenta conectada.
- No crear recursos remotos ni modificar bases en la etapa 0. No desplegar en producción.
- Verificar nuevamente costos y condiciones antes de provisionar. Cualquier costo, plan o dominio requiere autorización explícita del usuario.

## Producto y seguridad

- Visitantes sin cuenta. Una sola cuenta administradora; sin invitaciones, registro público ni otros roles de aplicación.
- Autorizar por UUID del administrador único en la base; no por correo, user_metadata ni mera autenticación.
- Separar borradores e historial de la proyección publicada. Guardar y restaurar no publican.
- RLS y privilegios mínimos en tablas expuestas y Storage; verificar también acceso directo a API y archivos.
- Conservar imágenes referenciadas por contenido recuperable. No implementar ni ejecutar purgas hasta acordar retención.
- Secretos solo en mecanismos seguros del entorno. Nunca en código, logs, documentación, commits ni respuestas. No usar claves privilegiadas en clientes.
- Campos de negocio vacíos se ocultan. Sin datos ficticios, condiciones financieras inventadas ni afirmaciones de cumplimiento legal.

## Implementación futura

- Next.js, TypeScript y Supabase; Vercel previsto, sujeto a plan apto para uso comercial.
- Consultar documentación y metadatos actuales antes de instalar. Leer las instrucciones y documentación incluidas en la versión instalada de Next.js.
- Fijar versiones, usar un único gestor y conservar su lockfile. No simular un lockfile sin resolver dependencias.
- Proteger las mutaciones en servidor y base; el control de ruta no basta.
- Documentar y verificar migraciones, permisos, publicación, restauración y acceso a imágenes cuando se implementen.
- Respetar accesibilidad, diseño móvil y prefers-reduced-motion, también al personalizar colores.
- Preservar cambios del usuario. Revisar estado y diff antes de editar; no hacer reset, limpieza ni sobrescrituras indiscriminadas.
- Al cerrar cada etapa informar archivos, validaciones y pendientes; detenerse en el alcance autorizado.

## Etapa 2: demostración local

- La base visual funciona sin Supabase ni credenciales. Los documentos de arquitectura/datos son propuestas futuras, no funcionalidades implementadas.
- Los datos ficticios autorizados se limitan a src/dev y rutas /desarrollo, rotulados como muestra. Nunca importarlos al catálogo público.
- Mantener guardias de servidor e imports condicionados a NODE_ENV === development. Comprobar el aislamiento con build y scripts/verify-production.mjs.
- El panel visual no tiene autenticación ni persistencia. No simular guardados o publicaciones; no exponer next dev a una red.
- Mantener tipados y centralizados los valores iniciales de src/config/site.ts. Las capturas y docs/ESTADO.md deben reflejar el estado real.
- La siguiente etapa requiere una nueva instrucción del usuario; no conectar servicios por el solo hecho de estar documentados.
<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

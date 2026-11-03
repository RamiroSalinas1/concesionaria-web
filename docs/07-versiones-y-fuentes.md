# Versiones y fuentes consultadas

Fecha: **2 de noviembre de 2026**. Fuentes oficiales y metadatos públicos leídos; no se instalaron paquetes. Los números son una captura temporal, no una instrucción de usar `latest` en instalaciones futuras.

## Compatibilidad preliminar

| Componente | Versión observada | Requisito declarado / conclusión limitada |
| --- | --- | --- |
| Node local | 24.22.1 | Cumple los mínimos declarados de Next y supabase-js; proponer runtime 24.x explícito en Vercel |
| Next.js | 16.4.4 | Node >=20.9; peers React/React DOM incluyen ^19.0.0 |
| React / React DOM | 19.3.1 / 19.3.1 | React DOM requiere React ^19.3.1; mantener versiones iguales |
| TypeScript | 7.0.2 | Node >=16.20; Next documenta mínimo TypeScript 5.1; verificar integración real del compilador/plugin antes de adoptarlo |
| @supabase/supabase-js | 2.118.0 | Node >=22; peer @opentelemetry/api >=1.0.0, revisar metadatos de opcionalidad al resolver dependencias |
| @supabase/ssr | 0.12.7 | Peer supabase-js ^2.114.0 incluye 2.118.0 |
| @types/react / @types/react-dom | 19.3.0 / 19.3.0 | Los tipos DOM requieren @types/react ^19.3.0 |
| pnpm incluido en runtime | 11.25.0 | Ejecutado por su ruta incluida mediante Node; no hay pnpm/npm global confirmado |

Origen de versiones/peers: endpoint `https://registry.npmjs.org/<paquete>/latest` para cada paquete de la tabla. En particular: [Next](https://registry.npmjs.org/next/latest), [React](https://registry.npmjs.org/react/latest), [React DOM](https://registry.npmjs.org/react-dom/latest), [TypeScript](https://registry.npmjs.org/typescript/latest), [supabase-js](https://registry.npmjs.org/@supabase/supabase-js/latest), [SSR](https://registry.npmjs.org/@supabase/ssr/latest), [tipos React](https://registry.npmjs.org/@types/react/latest), [tipos React DOM](https://registry.npmjs.org/@types/react-dom/latest).

La comprobación cubre rangos declarados, no certifica que build, plugin TypeScript, SSR, linter y todo el árbol funcionen juntos. No hay dependencia fijada ni lockfile porque aún no existe aplicación y no se resolvió un árbol. No generar un archivo bloqueado ficticio.

### Procedimiento para la etapa técnica

1. Reconsultar versiones estables, avisos de seguridad, engines, peerDependencies y peerDependenciesMeta; decidir TypeScript con las notas de compatibilidad de la versión de Next elegida.
2. Usar un solo gestor; propuesta pnpm, disponible en el runtime. Declarar versión exacta en `packageManager` y Node compatible en `engines`/documentación.
3. Instalar versiones exactas del conjunto compatible, también tooling/tipos necesarios; no prereleases sin necesidad autorizada. Registrar `pnpm-lock.yaml` real. Si se elige npm, usar solo `package-lock.json` y documentar el cambio.
4. Leer AGENTS.md y docs de Next incluidas en la versión instalada; completar scripts de lint independiente, typecheck y build. Next build no ejecuta lint automáticamente.
5. Verificar instalación limpia con lockfile congelado, peers sin conflictos, typecheck, lint y build. Revisar vulnerabilidades antes de conectar datos reales.

La documentación oficial consultada permite Node 24.x en Vercel; fijarlo explícitamente evita depender del runtime predeterminado de la plataforma. No se configuró ningún proyecto.

## Changelog Supabase

Se leyó [el índice oficial](https://supabase.com/changelog.md), incluidas etiquetas Breaking Change; se siguieron los avisos pertinentes para conexiones y elección de Postgres:

- [Retiro de cifrados TLS antiguos](https://supabase.com/changelog/cbc-tls-ciphers-deprecated), aviso del 12 de octubre: retiro desde el 10 de noviembre de 2026 como fecha más temprana. Diseñar para clientes soportados con TLS moderno; no requiere cambio de un proyecto inexistente.
- [Postgres 15.19 / 17.11](https://supabase.com/changelog/postgres-15-19-17-11-breaking-changes), aviso del 25 de septiembre: cambios de extensiones/operadores. No hay esquema previo que migrar; comprobar versión GA al crear el proyecto y no agregar extensiones afectadas sin necesidad.

No se aplicaron upgrades, consultas SQL de diagnóstico ni modificaciones al proyecto Documa.

## Referencias técnicas y económicas

| Tema | Fuente oficial |
| --- | --- |
| Next: instalación, Node mínimo, TypeScript y lint | [Instalación](https://nextjs.org/docs/app/getting-started/installation) |
| Runtime Node en Vercel | [Versiones soportadas](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions) |
| Registro público y acceso anónimo | [Auth: configuración general](https://supabase.com/docs/guides/auth/general-configuration) |
| SSR y cookies de sesión | [Creación de clientes](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs) |
| Verificación de identidad | [getClaims](https://supabase.com/docs/reference/javascript/auth-getclaims), [getUser](https://supabase.com/docs/reference/javascript/auth-getuser), [sesiones](https://supabase.com/docs/guides/auth/sessions) |
| Tablas y permisos | [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [seguridad de Data API](https://supabase.com/docs/guides/api/securing-your-api) |
| Lectura privada/pública de imágenes | [Buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals), [acceso Storage](https://supabase.com/docs/guides/storage/security/access-control) |
| Copias y limitaciones de Storage | [Backups](https://supabase.com/docs/guides/platform/backups) |
| Free y límites públicos | [Supabase Pricing](https://supabase.com/pricing) |
| Restricción de uso Hobby | [Vercel Hobby](https://vercel.com/docs/plans/hobby) |

La conexión Supabase también se consultó mediante `search_docs`; los resultados amplios de tutoriales no se adoptaron como políticas de seguridad del proyecto. Esta app no usa el modelo de registro multiusuario de esos tutoriales. Las decisiones aquí son propuestas de diseño basadas en los requisitos y fuentes, no configuraciones ya comprobadas en ejecución.

Normativa argentina: revisión deliberadamente pendiente para la etapa previa a publicación, con fuentes oficiales vigentes. No se ha verificado ni afirmado cumplimiento.

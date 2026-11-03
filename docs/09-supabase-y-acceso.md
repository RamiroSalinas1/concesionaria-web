# Etapa 3: Supabase y administrador único

3 de noviembre de 2026. Implementación de la base de seguridad; sin CRUD, editor, publicación de contenido ni despliegue. El diseño de la etapa 2 se conserva.

## Recurso y costo

Proyecto independiente **concesionaria-web**, ref `lzfqosdaapotitvrvusd`, organización autorizada `vercel_icfg_ws6A0OiG1NKsEfSwPVQYuDdq`, región `sa-east-1`. La consulta de costo previa a crear devolvió **USD 0 mensuales** y organización Free. No se contrató un plan, dominio, Vercel ni capacidad adicional. No se modificó Documa.

Se comprobaron organización y proyecto antes de cada escritura remota. La identidad de GitHub es RamiroSalinas1 y el PR sigue siendo el #1, en borrador, sobre la misma rama. Supabase se operó con el conector autenticado; no se extrajo su token OAuth.

## Migraciones y límites editoriales

- `20261103041214_security_foundation.sql`: esquemas `app`, `catalog`, `private`, administrador único, versiones, pagos, referencias de medios, configuración, destacados y auditoría. Grants/RLS explícitos, bucket privado y funciones limitadas.
- `20261103041923_explicit_private_media_deny.sql`: denegación restrictiva explícita de clientes sobre autorización y mapa de medios privados.
- `20261103042639_harden_auth_helper_permissions.sql`: puente interno para comprobar exclusivamente la sesión actual en el esquema Auth administrado.

Las tres están aplicadas al proyecto dedicado. Los timestamps locales se alinearon con el historial devuelto por el conector. La CLI generó inicialmente los archivos; no se alteró el historial remoto para cambiar sus nombres.

`app` contiene identidades y revisiones; `catalog` son tablas físicas de proyección pública; `private` no se expone en Data API. Se exponen `public`, `graphql_public`, `catalog` y `app` mediante configuración de PostgREST versionada. Todas las tablas de aplicación tienen RLS. No hay vistas privilegiadas sobre borradores.

Visitantes y autenticados solo tienen SELECT sobre `catalog`. El administrador tiene SELECT privado. **Ningún cliente tiene DML editorial directo**, ni siquiera el administrador: guardar/publicar/restaurar se implementarán mediante operaciones transaccionales auditadas en otra etapa. No existe un guardado que pueda cambiar la publicación. Las pruebas aisladas insertan un borrador nuevo y comprueban que la proyección anterior no cambia.

Revisiones, hijos y eventos rechazan UPDATE/DELETE mediante triggers. Punteros de revisión tienen FK compuestas para pertenecer a su vehículo/sitio. Precio fijo exige importe positivo no nulo y moneda. Las fotos conservan FK desde versiones recuperables. El dueño técnico de infraestructura conserva capacidad de mantenimiento; este historial no es una auditoría inviolable frente al dueño.

El esquema es la base del futuro flujo: falta validar payloads completos del editor, reglas de publicación, concurrencia e idempotencia de operaciones. No hay RPC de escritura ni botones que simulen estas funciones.

## Autorización y sesión

`private.admin_account` admite como máximo una fila (`slot = true`, PK), con UUID único vinculado a `auth.users`. No hay permisos de aplicación para insertar, cambiar ni borrar esa fila. No se autoriza por correo, `user_metadata` ni por estar autenticado.

`private.is_admin()` compara el UUID y exige un `session_id` que exista en `auth.sessions`, pertenezca al mismo usuario y no haya vencido por `not_after`. Su dueño es un rol NOLOGIN sin BYPASSRLS, limitado a leer el slot de autorización y ejecutar `private.active_session_user_id()`. Este puente interno sin argumentos, propiedad de postgres, devuelve solo el UUID de la sesión actual validada o null. Solo el rol acotado puede ejecutarlo; visitantes, autenticados y service_role no reciben EXECUTE. El wrapper público de is_admin es invoker y solo `authenticated` lo puede ejecutar. Una sesión revocada pierde acceso privado aunque su JWT todavía no haya expirado.

La separación es necesaria en Supabase alojado: postgres no puede conceder USAGE de `auth` a roles propios y las sesiones tienen RLS administrada. La primera prueba manual detectó ese límite; se corrigió con el [patrón oficial de función definer acotada](https://supabase.com/kb/troubleshooting/permission-errors-when-granting-custom-roles-access-to-the-auth-schema), sin modificar políticas/tablas de Auth ni dar BYPASSRLS al rol propio. La migración inicial se conserva como antecedente y la tercera corrige el estado final. Las pruebas aisladas ahora habilitan RLS de sesiones y comprueban que el rol propio carezca de acceso directo a Auth. Una comprobación real bajo el rol authenticated confirmó que la función ya se ejecuta y niega acceso sin sesión.

SSR usa `@supabase/ssr` 0.12.7 y `@supabase/supabase-js` 2.118.0, fijados con lockfile. Proxy refresca/verifica con `getClaims`; páginas, API y acciones validan con `getUser` y la función de autorización. No se confía en `getSession().user`. Cada operación sensible vuelve a comprobar acceso; layout y Proxy no sustituyen esa comprobación.

Cookies HttpOnly, SameSite=Lax y Secure cuando el origen configurado es HTTPS. Panel/Auth/API privada tienen `private, no-store`, noindex y política de referente restringida. Server Actions usan la comprobación de origen de Next y además el origen exacto `SITE_URL`. El callback PKCE ignora destinos aportados por el cliente y solo redirige al origen configurado. Errores de ingreso/recuperación no enumeran cuentas. Los límites de intentos corresponden a Supabase Auth; no hay un contador efímero de proceso que se presente como protección distribuida.

El formulario comprueba por HTTP que Auth tenga `disable_signup=true` y `external.anonymous_users=false`; si falta configuración, falla la red o no están bloqueados, permanece deshabilitado. Registro público bloqueado también se verificó en la API real con una solicitud deliberadamente inválida, sin posibilidad de crear una identidad.

## Alta inicial restringida

La cuenta definitiva fue creada por el usuario en el Dashboard con contraseña privada y correo confirmado. Se verificó que fuera la única identidad, no anónima, correspondiente al correo autorizado. Se vinculó su UUID en una transacción de bootstrap, con bloqueo y rechazo de reemplazos. **No se guardan correo, UUID de la cuenta, contraseña ni tokens en Git.**

Para reproducir en un proyecto nuevo autorizado:

1. Verificar cuenta operadora, organización, ref y entorno. No ejecutar sobre otro proyecto ni crear recursos con costo.
2. En Authentication → Sign In / Providers desactivar altas públicas y acceso anónimo, y guardar. Mantener solo el proveedor de correo necesario, sin OAuth/invitaciones en la app.
3. En URL Configuration definir `http://127.0.0.1:3000` como Site URL y únicamente `http://127.0.0.1:3000/auth/callback` como redirect local. No agregar comodines. Cambiar orígenes requerirá una etapa de despliegue autorizada.
4. El propietario crea la única cuenta en Auth → Users → Create user, con correo confirmado y contraseña elegida fuera del chat. No usar una cuenta temporal como administrador final.
5. Ejecutar `supabase/bootstrap-admin.sql` como propietario, reemplazando el marcador de correo **solo localmente**. No es una migración. Rechaza más de una identidad, cuenta no confirmada/anónima y sustitución de un administrador existente. Luego descartar la copia con el correo, sin subirla.
6. Verificar por SQL una fila de autorización y probar ingreso/cierre reales. Ninguna de estas operaciones se expone en la app.

Opcionalmente `scripts/harden-auth.mjs` configura bloqueo y URLs exactas vía Management API. Requiere un token operativo en entorno local, verifica acceso a la organización y proyecto antes del PATCH y nunca imprime respuestas de configuración. No se ejecutó en esta sesión: el usuario guardó los ajustes en Dashboard. No inicia sesión, no crea credenciales ni cobra servicios.

## Configuración local

Copiar `.env.example` a `.env.local`. Completar URL y **clave publicable** del proyecto dedicado y `SITE_URL`. Los valores locales están ignorados por Git. No usar claves secretas en `NEXT_PUBLIC_*`.

El panel y el cliente de catálogo usan únicamente clave publicable. Sin credenciales, el diseño público sigue navegable, el ingreso se deshabilita y `/api/admin/status` y `/api/catalog` responden 503; no se simula autenticación ni persistencia.

`/api/catalog` consulta una lista acotada de columnas de `catalog.vehicles`, como visitante sin cookies. La UI pública conserva el catálogo vacío aprobado: su integración con vehículos publicados y sus fichas pertenece al CRUD posterior. No hay inventario ficticio en la base remota.

## Storage y entrega pública

Bucket `vehicle-media` privado, máximo 10 MiB, formatos JPEG/PNG/WebP/AVIF. Solo el administrador con sesión vigente puede leer por JWT/RLS. No hay políticas INSERT/UPDATE/DELETE: las subidas esperan el flujo de decodificación, validación real, reexportación y eliminación de EXIF. Un Content-Type declarado no equivale a validar los bytes.

Rutas y activos son inmutables; reemplazar una imagen deberá crear otro objeto. No hay purgas, borrados ni upserts. Las FK impiden eliminar metadatos de activos referenciados por versiones.

`/api/media/[reference]` acepta solo UUID opaco, nunca rutas/buckets. Consulta primero la referencia vigente con permisos públicos. Si existe y se configuró `SUPABASE_SECRET_KEY` **solo en servidor**, un resolver reservado a `service_role` comprueba nuevamente referencia y activo listo; descarga los bytes y vuelve a comprobar vigencia antes de responder. No firma ni redirige a URLs de Storage y responde sin caché persistente. Borrador/histórico sin referencia pública no puede pasar esta resolución. Los metadatos públicos no revelan rutas privadas.

La clave privilegiada **no está configurada** en esta sesión: no hay imágenes ni publicaciones. El endpoint falla con 404; la entrega positiva de bytes y la retirada bajo concurrencia quedan pendientes de una prueba integrada cuando se habiliten medios validados. Las pruebas actuales verifican políticas y resolución SQL en aislamiento, y denegación real de acceso público. No equivalen a haber probado una fotografía publicada real. Los bytes ya descargados no pueden recuperarse del dispositivo visitante.

## Recuperación de acceso

`/admin/recuperar` solicita recuperación; el callback intercambia el código PKCE en el mismo navegador que inició la solicitud. `/admin/clave` exige sesión válida y UUID autorizado, valida 12–128 caracteres y coincidencia, actualiza con Auth y solicita cierre global antes de volver a login. No cambiar el UUID para recuperar la misma cuenta.

Para probar: mantener el servidor local activo, solicitar recuperación, abrir el enlace en el mismo navegador, definir una nueva contraseña y comprobar que la anterior no ingresa. No se probó envío/recepción de correo ni cambio real de contraseña en esta etapa. SMTP/remitente, entregabilidad, cuotas y política de seguridad del proveedor deben verificarse antes de depender del correo. No se contrató SMTP.

Si se pierde el correo, el dueño de Supabase deberá recuperar la misma cuenta mediante mantenimiento seguro de Auth, revocar sesiones y comprobar otra vez el UUID. Un reemplazo de identidad requiere mantenimiento explícito con sustitución atómica del slot; la app no incluye gestión de usuarios. MFA TOTP y su recuperación siguen pendientes; no se promete MFA implementado.

## Pruebas y asesores

- `verify:policies`: 43 aserciones en PGlite 0.5.14 (PostgreSQL real en memoria), con Auth/Storage mínimos de prueba. Visitante, autenticado ajeno, admin y sesión vencida/revocada; metadata falsa; segundo admin; DML denegado; historial; retención; pertenencia de revisiones; precio fijo no nulo; borrador separado; resolver de medios vigente/retirado. Se destruye la instancia al finalizar. Sin cuentas temporales remotas.
- `verify:hosted`: configuración Auth y registro directo bloqueado, SELECT real de catálogo como anon, borradores/historial/autorización/mapa de medios denegados, resolver privilegiado denegado y bucket sin endpoint público. No crea identidades, filas ni objetos.
- `verify:production`: rutas públicas 200, once casos 404 de demos/fichas/URL desconocida, rutas y API privadas protegidas, cookie falsa rechazada, no-store, callback sin redirección externa y rutas arbitrarias de medios/registro inexistentes; JS público sin fixtures/panel demo.
- TypeScript, lint, formato y build de producción correctos. Un intento inicial de migración se revirtió completamente por permisos de transferencia de función; se corrigió la membresía temporal del rol y se verificó el resultado. Los builds bloqueados por EPERM de Windows se repitieron satisfactoriamente con permisos adecuados.
- Asesor de seguridad final: sin errores de esquema; solo `auth_leaked_password_protection` (WARN). [La función de contraseñas filtradas requiere Pro](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection); no se cambió el plan Free. El aviso informativo de política ausente se resolvió mediante la segunda migración.
- Asesor de rendimiento: 17 índices sin uso en una base nueva vacía; se conservan los índices de integridad/referencias y se reevaluarán con consultas y carga reales.
- Auditoría de dependencias: 0 altas/críticas; se conserva el aviso moderado de minimatch en herramientas de lint ya documentado en etapa 2 (GHSA-g3hv-75wg-m249). No se forzó una actualización incompatible del conjunto de lint.

La prueba de políticas no es una prueba de inicio de sesión real. Consultar ESTADO.md para el resultado manual de ingreso/cierre y los pendientes de esta sesión. No se realizó una nueva revisión visual automatizada: Computer Use se detuvo al no poder verificar la URL activa de Chrome.

El usuario confirmó finalmente ingreso y cierre con su cuenta definitiva. El servidor registró acceso 200 a `/admin` y Supabase quedó con cero sesiones de administrador después del cierre. No se solicitó su contraseña. La comprobación SQL positiva que requería una sesión activa ya no se ejecutó porque el usuario había cerrado; no se presenta como prueba adicional superada.

Fuentes consultadas: [SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs), [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security), [Storage](https://supabase.com/docs/guides/storage/security/access-control), [Management API Auth](https://supabase.com/docs/reference/api/v1-update-auth-service-config), [changelog](https://supabase.com/changelog). Se revisó el cambio de TLS anunciado para noviembre de 2026: Node 24 usa TLS moderno. También se consultó la documentación incluida en Next 16.4.4 instalado.

## Historial y respaldos

El historial editorial no reemplaza un respaldo externo. Una pérdida del proyecto puede perder base y versiones; los backups de Postgres no contienen los binarios de Storage. Antes de cargar inventario real, definir exportación conjunta de base, originales/variantes, manifiesto y prueba de restauración, ubicación, responsable, retención y costo autorizado. No hay backups externos ni restauración de desastre verificados en esta etapa.

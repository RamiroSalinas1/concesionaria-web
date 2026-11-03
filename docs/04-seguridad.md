# Seguridad propuesta

Diseño de referencia de etapa 0. Auth, permisos, RLS y Storage se prepararon y probaron en etapa 3 sobre el proyecto dedicado; ver [implementación, pruebas y pendientes](09-supabase-y-acceso.md). Las propuestas de MFA y las operaciones editoriales siguen pendientes.

## Una cuenta administradora

1. Crear el proyecto exclusivo en una etapa autorizada. Desactivar **Allow new users to sign up**, accesos anónimos, proveedores sociales/teléfono innecesarios y vinculación manual de identidades. No basta con ocultar un botón de registro. [Configuración Auth](https://supabase.com/docs/guides/auth/general-configuration).
2. Dar de alta una única identidad por un procedimiento privilegiado de bootstrap fuera de la app, con el correo que indique el propietario. No registrar contraseñas ni enviarlas al repositorio/chat. Verificar titularidad y definir recuperación.
3. Asociar su UUID a `private.admin_account`: PK constante y UNIQUE impiden una segunda fila. La app, incluido el administrador, no tiene DML sobre esa tabla. Sin endpoint, interfaz de invitación o lista de usuarios.
4. El permiso se evalúa contra esa fila en cada operación; no se deduce de correo, `user_metadata`, `authenticated` ni de una variable pública. Un usuario creado por error sigue sin permisos.
5. Recuperar acceso sobre la misma identidad siempre que sea posible. Un reemplazo excepcional debe revocar sesiones del anterior, sustituir el UUID atómicamente y registrar el mantenimiento, sin convivencia de dos administradores.

La restricción de una cuenta se aplica al producto y a su autorización. El dueño técnico de Supabase puede crear identidades por fuera de la app; controlar ese acceso operativo y verificar que Auth contenga solo la identidad prevista. No añadir triggers invasivos a esquemas administrados para simular una limitación que el propietario de la plataforma puede eludir.

Inicio de sesión con correo/contraseña y recuperación del mismo usuario. Proponer MFA TOTP para el administrador, con recuperación preparada y permisos sensibles sujetos al nivel requerido cuando se active. Sin costos de SMS. SMTP/correo remitente y entregabilidad se definirán antes de depender de recuperación por correo; no inventar remitentes.

En Next.js validar token en servidor (`getClaims` o `getUser` según necesidad) y comprobar autorización en base; no confiar en el usuario retornado por `getSession` sin validación. Para acciones sensibles, verificar sesión vigente además del JWT: cerrar sesión/eliminar una cuenta no invalida instantáneamente todos los access tokens emitidos. [SSR](https://supabase.com/docs/guides/auth/server-side/creating-a-client?framework=nextjs), [sesiones](https://supabase.com/docs/guides/auth/sessions).

Redirecciones Auth permitidas solo a destinos propios exactos de cada entorno. Rechazar redirecciones abiertas. Proteger login/recuperación con límites de intentos, errores que no enumeren correos y controles del proveedor.

## Matriz de permisos de aplicación

| Recurso | Visitante `anon` | Autenticado distinto del admin | Admin único |
| --- | --- | --- | --- |
| Proyección publicada | SELECT de filas vigentes | Misma lectura pública | Lectura pública |
| Identidades editoriales, borradores y revisiones | Sin acceso | Sin acceso | SELECT autorizado y mutación por operaciones acotadas |
| Historial y papelera | Sin acceso | Sin acceso | Lectura; restauración por operación auditada |
| Registro de administrador | Sin acceso | Sin acceso | Sin escritura; consulta indirecta mínima de autorización |
| Archivos privados/borrador/históricos | Sin acceso | Sin acceso | Lectura/subida autorizadas; sin borrado físico ordinario |
| Imágenes actualmente publicadas | Entrega controlada por referencia vigente | Igual acceso público | Además acceso privado autenticado |

El caso «otro autenticado» es una prueba negativa de seguridad, no un segundo usuario del producto. Las identidades de prueba se usan solo en entorno aislado y se eliminan al cerrar la prueba.

## GRANT y RLS

- Habilitar RLS en todas las tablas expuestas, incluidas las proyecciones; defensa adicional en tablas privadas. Sin políticas, denegar. Revisar también privilegios de esquema, secuencias, funciones y permisos predeterminados.
- `anon` y `authenticated`: solo SELECT público de proyecciones vigentes. Sin acceso a revisiones ni metadatos históricos por joins o consultas directas.
- `authenticated` en edición: políticas con comprobación del UUID de administrador para SELECT, INSERT, UPDATE y DELETE cuando corresponda; UPDATE debe tener `USING` y `WITH CHECK`. No habilitar DELETE físico de versiones ni activos al panel.
- Proponer helper `private.is_admin()` para comparar `(select auth.uid())` con el registro único; sin argumento de UUID controlado por el cliente. Si requiere `SECURITY DEFINER`, limitarlo a esa consulta, propietario de mínimos privilegios, `search_path` vacío y nombres calificados. Conceder solo USAGE/EXECUTE necesarios para evaluar políticas, nunca lectura general de la tabla privada.
- Para no permitir omitir el historial, revocar DML directo editorial y de proyecciones a clientes. Usar operaciones transaccionales acotadas que validen al administrador e inserten evento y revisión. Si necesitan `SECURITY DEFINER`, aplicar las mismas restricciones, propietario sin privilegios generales, revocar EXECUTE de `PUBLIC`/`anon` y conceder solo a `authenticated`; comprobar identidad en cada cuerpo. No convertir SQL arbitrario o rutas de Storage en parámetros ejecutables.
- El historial y revisiones son de solo anexado: cliente sin UPDATE/DELETE, y operaciones internas sin ruta para reescribir versiones previas. Los privilegios de dueño técnico siguen siendo un límite operativo; no prometer auditoría resistente a un administrador de infraestructura.
- Evitar vistas con privilegios del dueño sobre datos privados. Si se necesitan, `security_invoker = true` y permisos/RLS coherentes. [Guía RLS](https://supabase.com/docs/guides/database/postgres/row-level-security).

## Imágenes

Buckets **privados**, incluso para originales de contenido publicado: en un bucket público la lectura del archivo omite RLS. [Modelo de buckets](https://supabase.com/docs/guides/storage/buckets/fundamentals).

- Políticas `storage.objects` limitadas al bucket propio y al UUID administrador para subir y leer. Sin confiar en nombre de carpeta, extensión o `owner_id` como autorización suficiente.
- Rutas generadas e inmutables; reemplazar una foto crea otro objeto. Evitar `upsert` y sobrescrituras que romperían versiones antiguas. Sin permiso DELETE del cliente; una limpieza futura será operativa y restringida por referencias/retención.
- Validar tamaño, dimensiones, cantidad y contenido real de formatos raster permitidos; decodificar y reexportar variantes, quitar EXIF/GPS. No aceptar SVG/HTML ejecutable como foto/logo sin un flujo seguro específico. Definir límites concretos antes de implementar subidas.
- La lectura pública se propone mediante una ruta de servidor que recibe un ID opaco de referencia, consulta con permisos públicos que siga publicado y resuelve únicamente su objeto validado. Nunca acepta una ruta/bucket arbitrario ni entrega listados privados.
- Si esa ruta necesita una clave secreta para leer Storage, mantener cliente y resolución de ruta solo en servidor, comprobar publicación antes de leer y responder sin caché persistente. Revisar el costo de egreso y límites del runtime antes de habilitarla.
- El panel puede descargar con JWT y RLS. URLs firmadas privadas, si hicieran falta, serán breves, no se guardarán en revisiones/logs y podrán seguir válidas hasta expirar aunque se retire el contenido. Para retirada estricta en nuevas peticiones, preferir la entrega controlada sin redirección.
- No enviar borradores al optimizador público de imágenes ni a cachés compartidas. No se puede revocar una foto que un visitante ya descargó cuando era pública.

## Verificación futura obligatoria

Probar por UI y llamadas directas: sin sesión, sesión vencida, otro autenticado y administrador; registro directo por API bloqueado; segunda fila de administrador rechazada; historial inmutable; acceso a borrador/archivo histórico denegado; foto retirada inaccesible en nuevas peticiones; ausencia de datos privados en HTML, metadatos, sitemap, API y caché. Ejecutar asesores de seguridad sobre el proyecto de concesionaria después de migraciones, nunca sobre Documa para esta tarea.

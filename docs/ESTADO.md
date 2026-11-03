# Estado del proyecto

**Etapa 3 implementada: base Supabase y seguridad para un administrador.**
3 de noviembre de 2026. Diseño aprobado conservado. Sin CRUD, editor, despliegue ni fusión.

## Recurso

- Proyecto Supabase independiente: concesionaria-web, ref `lzfqosdaapotitvrvusd`, región `sa-east-1`.
- Organización autorizada: `vercel_icfg_ws6A0OiG1NKsEfSwPVQYuDdq`, Free.
- Costo consultado antes de crear: **USD 0 mensuales**. Sin contratación de planes, dominios, SMTP, Vercel ni recursos adicionales.
- Documa y sus recursos no se modificaron.

## Implementado

- Tres migraciones aplicadas y versionadas: `20261103041214_security_foundation`, `20261103041923_explicit_private_media_deny` y `20261103042639_harden_auth_helper_permissions`.
- Administrador único autorizado por UUID privado y sesión vigente; cuenta definitiva creada por el usuario y bootstrap restringido ejecutado. No hay correo, UUID de cuenta ni credenciales en Git.
- Auth público y anónimo desactivados, comprobados por HTTP. No hay registro, invitaciones ni gestión de usuarios en la app.
- Inicio/cierre de sesión, páginas protegidas, API privada y cambio/recuperación de contraseña preparados con SSR. GetClaims para refresco, getUser y autorización en base para acceso.
- RLS y privilegios mínimos: proyección física pública separada, borradores/configuración/historial privados. Sin DML editorial directo ni RPC de escritura todavía.
- Revisiones e historial inmutables, FK de pertenencia, base de auditoría, referencias de medios conservadas y rutas inmutables.
- Bucket privado sin permisos de subida/sobrescritura/borrado. Endpoint de medios solo por referencia pública; nunca firma rutas arbitrarias. Sin clave privilegiada configurada, falla con 404.
- Variables locales ignoradas y `.env.example` sin secretos; tipos públicos generados y contrato tipado de lectura del catálogo.
- Diseño público y catálogo vacío de etapa 2 conservados; `/api/catalog` lee solo la proyección pública. Demos siguen limitadas al desarrollo.

## Verificaciones

| Comprobación                          | Resultado                                                                                                                                                                    |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| typecheck / lint / format:check       | Correctos                                                                                                                                                                    |
| build                                 | Correcto; Windows requirió repetir con permisos adecuados                                                                                                                    |
| verify:policies                       | 43 aserciones PostgreSQL en memoria: visitante, ajeno, admin, sesión vencida/revocada, no autoasignación, historial, medios, integridad y separación de borrador/publicación |
| verify:hosted                         | Auth endurecido; registro directo devuelve signup_disabled; catálogo público legible; borradores, historial, autorización y resolver privado denegados                       |
| verify:production                     | Públicas 200, demos/fichas/URL inexistente 404, rutas/API privadas protegidas, cookie falsa rechazada, no-store, callback fijo y JS sin fixtures                             |
| Cuenta real                           | Existe una única identidad confirmada y no anónima, vinculada al slot de administrador                                                                                       |
| Ingreso/cierre reales                 | Confirmados manualmente por el usuario; /admin respondió 200 y Supabase quedó sin sesiones tras cerrar. Sin compartir contraseña                                             |
| Recuperación por correo / cambio real | No ejecutados; SMTP y entregabilidad pendientes                                                                                                                              |
| Medio publicado real                  | No ejecutado: sin inventario, archivos ni clave privilegiada. Resolución y retirada probadas solo por SQL aislado                                                            |
| Seguridad Supabase                    | Sin errores de esquema; una advertencia de contraseñas filtradas, función que requiere Pro. Se conserva Free                                                                 |
| Dependencias                          | 0 altas/críticas; un aviso moderado previo de minimatch en tooling de lint                                                                                                   |
| Rendimiento Supabase                  | 17 índices sin uso en base vacía; reevaluar con consultas reales                                                                                                             |
| Secretos                              | .env.local ignorado; escaneo de archivos a versionar sin claves, tokens, conexión sensible, correo ni UUID de cuenta                                                         |
| UI nueva en navegador                 | Sin revisión automatizada: Computer Use se detuvo por no poder determinar la URL activa de Chrome                                                                            |

Las pruebas locales de RLS usan tablas mínimas de Auth/Storage y claims de prueba en un PostgreSQL aislado; no son un login real. La instancia se destruye al finalizar. No se crearon identidades temporales ni fixtures remotos.

La primera prueba manual detectó un permiso de Auth que Supabase alojado no permite conceder a un rol propio. Se corrigió mediante un puente interno acotado, sin cambiar tablas/políticas de Auth; se verificó la función bajo el rol authenticated en el proyecto real y se amplió la regresión local. Ver documento 09.

## Operación y pendientes

[Guía de seguridad, alta inicial y recuperación](09-supabase-y-acceso.md). La configuración local ya apunta exclusivamente al proyecto dedicado. Sin credenciales, la UI pública funciona y el acceso administrativo falla de forma cerrada.

Pendientes antes de operar con datos reales: recuperación por correo y cambio real de contraseña con cierre global, MFA si se acuerda, validación y reexportación de imágenes, publicación transaccional, concurrencia, retención y backups externos conjuntos de base e imágenes. El historial editorial no es un respaldo externo y los backups de base no incluyen los binarios de Storage. No hay purgas.

El siguiente trabajo, sujeto a una nueva instrucción, será la gestión de vehículos y las operaciones editoriales auditadas. Esta etapa no implementa CRUD ni editor visual. No publicar ni desplegar.

## Git y antecedentes

Rama: `docs/etapa-0-revision-inicial`. [PR borrador #1](https://github.com/RamiroSalinas1/concesionaria-web/pull/1), hacia main, sin fusionar. Commits previos: `e42db76` (documentación) y `9de3296` (base técnica/diseño). El SHA de esta etapa se informa en la entrega y en `git log -1`.

Los documentos 00–08 conservan el contexto de etapas anteriores. Las decisiones implementadas y límites actuales están en este estado y en el documento 09. Las capturas existentes son de etapa 2; no se presentan como pruebas nuevas de Auth.

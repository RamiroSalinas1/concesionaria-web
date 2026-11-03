# Modelo inicial de datos

Modelo conceptual de etapa 0. La base se implementó mediante migraciones en etapa 3; [detalle y diferencias actuales](09-supabase-y-acceso.md). Las migraciones son la fuente ejecutable; CRUD y publicación siguen pendientes. IDs UUID, fechas `timestamptz` en UTC y presentación `es-AR` / `America/Argentina/Buenos_Aires`. Importes `numeric(14,2)`, nunca coma flotante.

## Edición y versiones privadas

| Entidad | Datos y relaciones principales |
| --- | --- |
| `private.admin_account` | Una fila: `slot` boolean PK con CHECK de verdadero, `user_id` UUID UNIQUE FK a `auth.users`, fechas. Como máximo un administrador autorizado; sin permisos de edición desde la app |
| `app.vehicles` | Identidad estable, `id`, punteros a revisión borrador y publicada, `lock_version`, `archived_at`, `deleted_at`, fechas. Sin borrado físico normal |
| `app.vehicle_revisions` | `id`, `vehicle_id`, número secuencial, autor UUID, fecha, `schema_version`, revisión fuente si se restauró; fotografía completa e inmutable de los datos del vehículo |
| `app.vehicle_revision_payments` | Revisión y método (`cash`, `bank_transfer`, `financing`, `trade_in`), habilitado y texto opcional proporcionado por negocio. UNIQUE por revisión/método |
| `app.vehicle_revision_images` | Revisión, `asset_id`, orden, texto alternativo y marca de portada; referencia al archivo, no copia binaria ni URL firmada |
| `app.site` | Singleton, punteros a revisión borrador/publicada y versión de concurrencia |
| `app.site_revisions` | Nombre, colores/tokens, clave de tipografía permitida, portada, textos, contactos/redes, bloques con ID estable/tipo/orden/visibilidad y destacados por UUID de vehículo; autor, fecha, número, `schema_version` y revisión fuente |
| `app.site_revision_media` | Revisión de sitio, `asset_id` y función (`logo`, `hero`, bloque); permite conocer referencias sin buscar rutas dentro de JSON |
| `app.media_assets` | Bucket/ruta únicos e inmutables, checksum, tipo real, bytes, dimensiones, estado de validación, variantes disponibles, autor, fechas, candidato de retención/purga y estado de eliminación |
| `app.audit_events` | Evento inmutable: guardar, publicar, retirar, archivar, enviar a papelera, restaurar, restaurar desde papelera y purgar medios cuando se autorice; actor, entidad, revisiones previa/nueva/fuente, fecha, ID de operación |

Un registro de identidad puede existir sin revisión publicada. Las relaciones de revisión deben verificar que el puntero pertenece a la misma entidad, mediante FK compuesta o restricción equivalente. El número de revisión es UNIQUE por entidad. Las revisiones y sus filas hijas se insertan atómicamente y luego no se editan.

### Contenido de una revisión de vehículo

- Slug deseado, tipo (`car`, `motorcycle`, `other`), marca, modelo, versión opcional, año, kilometraje opcional, condición (`used`, `new`), descripción y características aplicables.
- Modalidad de precio (`fixed`, `on_request`), importe y moneda explícita. Propuesta inicial de monedas habilitables: ARS y USD; confirmar uso comercial después. No hay tipo de cambio implícito.
- Disponibilidad (`available`, `reserved`, `sold`); campos opcionales como combustible o transmisión solo cuando correspondan al tipo de vehículo.
- Métodos de pago e imágenes pertenecen a esa revisión, por lo que restaurar también recupera selección, orden, portada, textos y condiciones proporcionadas.

Borradores pueden estar incompletos, pero su estructura y tipos deben ser válidos. Publicar aplica validaciones más estrictas: marca/modelo/tipo/condición, año razonable, importes no negativos, coherencia de precio/moneda y referencias válidas. No forzar kilometraje cero solo por condición 0 km ni completar datos desconocidos automáticamente.

Para precio fijo, importe positivo y moneda obligatorios; para consultar, importe/moneda nulos en la proyección. Para orden de fotos, UNIQUE por revisión/posición y como máximo una portada mediante índice parcial; al publicar una galería no vacía exigir exactamente una. Slug UNIQUE en publicaciones activas; mantener estable en edición habitual y definir redirecciones si se habilita su cambio.

Configuración por JSONB con esquema versionado y validación de servidor/base donde sea viable; campos que necesitan FK (medios, vehículos destacados) también tienen referencias relacionales. No guardar HTML arbitrario. Tipografías, tipos de bloques y claves de estilo se seleccionan de listas permitidas.

## Proyección publicada

| Entidad | Uso |
| --- | --- |
| `catalog.vehicles` | Copia permitida de la revisión publicada: UUID, slug, datos de ficha, precio, disponibilidad y fecha de publicación. Sin notas internas ni punteros a borradores |
| `catalog.vehicle_payments` | Solo métodos y textos de pago de la publicación vigente |
| `catalog.site_settings` | Una configuración pública publicada; solo los campos que el visitante puede ver |
| `catalog.media_references` | Referencias vigentes de vehículo o sitio a activos publicados, con ID opaco, orden, portada y texto alternativo. No revela bucket/ruta privada ni activos históricos |

La publicación sustituye la proyección en una transacción y deja su revisión de origen trazable en el ámbito privado. Retirar elimina filas públicas y referencias dependientes. Los destacados de un vehículo retirado se omiten al renderizar; nunca habilitan acceso a un borrador. No usar una vista de revisiones privadas con privilegios del propietario para resolver el catálogo.

## Integridad, índices y conservación

- FK con `RESTRICT` para no borrar en cascada revisiones ni activos referenciados. No usar DELETE físico del vehículo para implementar papelera.
- Índices para FK: revisión/vehículo, imágenes/revisión, referencias/activo, evento/entidad/fecha; autorización por UUID con UNIQUE.
- Índice UNIQUE de slug publicado; filtros públicos por tipo, marca, año y `(currency, price_amount)` según consultas y EXPLAIN reales. Paginación estable con desempate por UUID.
- No crear índices especulativos para cada campo JSON. Evaluar búsqueda textual cuando exista contenido y consultas medibles.
- `lock_version` y revisión esperada previenen pérdida de cambios entre pestañas; ID de operación UNIQUE evita duplicar eventos por reintento.
- No guardar contraseñas, JWT, claves, correos de visitantes ni secretos en configuración, revisiones o auditoría.
- Un evento se conserva aunque se retire una publicación. Referencias de imágenes se conservan mientras las versiones sean recuperables. La política pendiente no autoriza purgar archivos referenciados.

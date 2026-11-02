# Borradores, publicación e historial

Propuesta común a vehículos y configuración del sitio. El historial es persistente en Postgres; Git solo versiona código, documentación y migraciones.

## Estados y acciones

| Acción | Edición privada | Resultado público | Registro persistente |
| --- | --- | --- | --- |
| Crear/guardar | Nueva revisión completa; actualiza puntero borrador | Sin cambio | Evento de guardado y autor |
| Previsualizar | Lee la revisión guardada seleccionada | Sin cambio | No crea una publicación |
| Publicar | Valida revisión, medios y referencias | Sustituye proyección vigente | Evento, revisión publicada, fecha y actor |
| Retirar/archivar | Conserva revisiones y borrador | Quita proyección y acceso a sus medios exclusivos | Evento de retiro/archivo |
| Enviar a papelera | Marca `deleted_at`, conserva contenido | Retira publicación en la misma transacción | Evento y estado previo |
| Restaurar versión | Crea revisión nueva basada en la elegida | Sin cambio hasta publicar | Evento con revisión fuente, anterior y nueva |
| Recuperar de papelera | Quita `deleted_at`, restaura como borrador sin publicación activa | Sigue oculto | Evento de recuperación |

«Publicado con cambios sin publicar» es una combinación de punteros distintos, no un valor que haga público el borrador. Disponibilidad, precio, pagos y fotos tienen la misma regla: guardar un cambio no lo publica. Para ocultar inmediatamente hay una acción explícita de retirar, diferenciada de guardar.

La configuración del sitio tiene historial, borrador y publicación propios. Secciones con IDs estables y tipos permitidos; guardar su orden/visibilidad no cambia la portada pública. Los contactos vacíos y bloques sin datos se omiten al renderizar.

La configuración esencial del sitio no se elimina como una ficha: se restauran versiones y se pueden retirar bloques, textos o medios opcionales. Papelera para vehículos y medios desvinculados; estos últimos siguen conservados si una versión los referencia.

## Vista previa

- Solo administrador autenticado y autorizado, con revisión exacta seleccionada y etiqueta visible «Vista previa: cambios sin publicar».
- No compartir tokens de acceso por query string ni enlaces que permitan a visitantes leer borradores.
- Sin caché compartida y fuera de indexación, sitemap, feeds y metadatos públicos. `noindex` complementa la autorización, no la reemplaza.
- Renderizar con los mismos bloques y validaciones de visualización del sitio, incluyendo móvil, campos vacíos y movimiento reducido.
- Salir de vista previa vuelve al contenido publicado; nunca cambia los punteros ni ejecuta publicación implícita.

## Publicación y fallos

1. Verificar sesión y administrador, revisión esperada y estado no eliminado.
2. Validar campos obligatorios, moneda/precio, pagos, bloques permitidos, fotos listas y FK. Una revisión inválida sigue siendo borrador.
3. En una transacción, bloquear identidad, generar proyección pública, cambiar revisión publicada y anexar evento. Reintentos con el mismo ID de operación no duplican publicaciones.
4. Confirmar al administrador el resultado solo tras el commit. Si falla, conservar la versión pública anterior completa. No escribir historial en un paso separado del contenido.

Si se publica una configuración con destacados, omitir referencias a vehículos no publicados o rechazarlas con un error claro según el control elegido; nunca publicar el vehículo por el solo hecho de destacarlo. La propuesta inicial es omitirlos en público y señalarlos como pendientes en el panel.

## Restauración

Seleccionar una versión, mostrar una comparación y sus medios, y restaurar genera una revisión nueva. Nunca mover silenciosamente el historial hacia atrás ni sobrescribir la versión fuente. Conservar número de esquema para transformar versiones antiguas al modelo actual de forma validada.

Ejemplo: revisión 7 publicada; revisión 8 borrador; se restaura la 3. Se crea la 9 con referencia a la 3 y evento de restauración desde la 8. La web continúa mostrando la 7 hasta que se publique la 9.

Si faltara un objeto por fallo externo o versión antigua incompatible, informar el problema y bloquear una restauración/publicación incompleta; no sustituir por una foto inventada. Recuperar desde backup si está disponible. Las versiones que se indiquen como recuperables deben conservar también sus activos.

## Retención de imágenes: decisión pendiente

No se ha acordado un plazo. **Propuesta inicial conservadora: purga automática desactivada.** Ninguna foto referenciada por borrador, publicación, papelera o versión recuperable se elimina físicamente. Esto no promete almacenamiento ilimitado: medir uso y resolver la política antes de llegar al cupo, sin contratar capacidad automáticamente.

- Originales y variantes inmutables con inventario por activo; referencias relacionales desde versiones de vehículo y sitio.
- Desvincular una foto de la revisión actual no la borra del historial. Papelera no equivale a borrado físico.
- Un archivo sin referencias tras subida fallida puede marcarse candidato, pero no se purga hasta acordar plazo y mecanismo de limpieza.
- La retención debe definir por separado: duración de papelera, recuperabilidad de versiones y sus fotos, huérfanos de subida, copias de seguridad, límites de almacenamiento y excepciones.
- Si todas las versiones se conservan recuperables indefinidamente, conservar también sus fotos indefinidamente o migrarlas a almacenamiento recuperable autorizado. No definir un plazo de foto menor que el de sus versiones y seguir prometiendo restauración completa.
- Si se acuerda expirar contenido recuperable, explicitar el límite en el panel; conservar al menos el evento de auditoría de la expiración/purga. Esa decisión modifica la garantía de restauración y requiere acordarla antes de implementarla.

Una purga futura evaluará todas las referencias, respetará el plazo aprobado, mostrará candidatos en modo simulación y volverá a comprobar bajo bloqueo que no hubo publicación/restauración concurrente. Marcar activo en proceso evita nuevas referencias. El borrado se hará por Storage API, no borrando filas de `storage.objects` por SQL; registrar éxito/fallo y permitir reintentos idempotentes. No implementar este proceso en la etapa 0.

## Copias de seguridad

Definir exportación de Postgres, originales/variantes, manifiesto de checksums y una restauración de prueba conjunta. Los backups de base de Supabase no incluyen los archivos binarios de Storage. No asumir backups automáticos o recuperación puntual incluidos en Free. [Documentación de backups](https://supabase.com/docs/guides/platform/backups).

El historial editorial recupera errores de edición; los backups cubren pérdida o corrupción de infraestructura. Retención, ubicación, cifrado, responsables y costo de estos backups quedan pendientes antes de operar con datos reales.

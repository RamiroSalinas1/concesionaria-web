# Etapas y criterios de aceptación

> Estado actualizado: este es el plan preliminar de la revisión inicial. La etapa 2 autorizada después corresponde a base técnica y diseño local, sin datos ni seguridad remota. Ver [ESTADO.md](ESTADO.md) para el avance actual.

Cada etapa futura necesita su propia instrucción de ejecución. La etapa 0 termina con documentación local y revisión, sin implementación ni recursos remotos.

## 0. Revisión y preparación — etapa actual

- Inspeccionar instrucciones, contenido, ramas y estado; preservar archivos previos.
- Verificar lecturas de GitHub, organización/proyectos Supabase y equipo/proyectos Vercel; distinguir accesibilidad de permiso efectivo de mutación.
- Identificar recursos visibles para evitar duplicados y cotizar sin crear.
- Documentar alcance, arquitectura, datos, seguridad, flujo editorial, etapas y pendientes.
- Validar diff, enlaces locales y preservación del antecedente; sin instalación, SQL ni despliegue.

Aceptación: documentos revisables en la rama local, repositorio de concesionaria correctamente identificado y ninguna modificación a Documa, ninguna creación remota o producción. Al cerrar esta etapa se detiene el trabajo.

## 1. Base técnica local y sistema visual

- Verificar otra vez versiones estables, Node, gestor, peers y avisos de seguridad. Fijar versiones y `packageManager`; guardar el lockfile real en el mismo cambio.
- Crear estructura Next.js/TypeScript, validación, lint y diseño base, sin servicios ajenos ni datos comerciales inventados.
- Portada y catálogo vacío con nombre provisional, bloques definidos y vista móvil; sin interfaces que afirmen guardar/publicar mientras no exista persistencia.

Aceptación: instalación reproducible desde lockfile, typecheck/lint/build correctos, navegación por teclado, contraste, movimiento reducido, móvil sin desbordes y ningún contacto/inventario ficticio. No implica despliegue.

## 2. Datos y seguridad en entorno aislado

- Implementar migraciones locales versionadas, invariantes de administrador único, GRANT/RLS, Storage privado y operaciones transaccionales auditadas.
- Preparar Auth sin registro público, sesión/recuperación y cliente público separado del administrador.
- Definir correo de la cuenta inicial antes de su bootstrap; no pedir contraseña por chat.
- Si se solicitan recursos remotos: repetir listados para evitar duplicados, confirmar organización, costos/cupos y autorización; recién entonces crear recursos exclusivos. No es requisito crear remotos para diseñar/probar localmente si hay runtime local adecuado.

Aceptación: visitante solo lee proyección publicada; otro autenticado no administra; segunda autorización de administrador rechazada; signup directo bloqueado; mutaciones directas que omitan historial denegadas; Storage de borradores privado; migraciones reproducibles y asesores sin riesgos críticos sin resolver. Pruebas solo en entorno propio aislado.

## 3. Panel editorial y medios

- CRUD de vehículos, fotos ordenadas/portada, precios/moneda, disponibilidad y cuatro métodos de pago configurables.
- Personalización completa de nombre, logo, colores, fuentes permitidas, portada, textos, destacados, bloques, contactos y redes.
- Guardado persistente de borradores, historial, vista previa privada y publicación explícita. Subidas privadas con validación y objetos inmutables.

Aceptación: recargar conserva los cambios; modificar cualquier dato no altera lo publicado hasta publicar; formularios incompletos se pueden guardar con errores de publicación claros; preview no es público; upload fallido no publica; dos pestañas detectan conflicto; sin textos financieros inventados.

## 4. Catálogo, publicación y recuperación completas

- Listado, filtros, paginación, fichas, galería y contactos reales cuando se carguen.
- Publicación/retirada atómicas, restauración de versiones y papelera, incluidas configuración y fotos.
- Política de retención acordada antes de habilitar cualquier purga; mientras tanto conservar activos referenciados y controlar capacidad.

Aceptación del flujo completo:

1. Con cero vehículos, mostrar estado vacío y ocultar contactos ausentes.
2. Crear/guardar un vehículo no lo hace accesible por listado, URL adivinada, API, imagen ni metadatos públicos.
3. Publicarlo lo muestra con moneda, pagos y disponibilidad exactos; ninguna fila privada acompaña la respuesta.
4. Editar precio/fotos/portada/contactos crea borrador y la publicación anterior sigue intacta.
5. Publicar actualiza de forma coherente ficha, filtros y galería. Un fallo de validación conserva la versión anterior.
6. Restaurar una versión vieja crea revisión y evento nuevos; recupera medios/orden/condiciones de esa versión, sin publicar automáticamente.
7. Enviar a papelera retira la ficha y acceso nuevo a sus medios exclusivos. Recuperar la deja como borrador hasta publicación explícita.
8. Retirar un destacado no revela su borrador ni rompe la portada. Múltiples monedas no se comparan como equivalentes.
9. Visitante/otro autenticado no pueden publicar, modificar historial, alterar admin único ni consultar fotos privadas. Cachés no exponen borradores.
10. Probar fallos/reintentos de publicación y recuperación, enlaces ausentes, teclado, móvil y movimiento reducido.

## 5. Preparación para publicación — sin ejecutar ahora

- Revisar normativa argentina aplicable con fuentes oficiales vigentes y datos del negocio; definir textos legales según esa revisión. No declarar cumplimiento antes de verificarlo.
- Elegir y autorizar hosting apto para uso comercial; verificar costo, límites de almacenamiento/egreso, recuperación y operación. No contratar por defecto.
- Confirmar identidad comercial/contactos que se quieran mostrar, derechos sobre fotos/logo, correo de recuperación y redirecciones Auth.
- Preparar backups conjuntos y prueba de restauración; revisar RLS, secretos, dependencias, accesibilidad, SEO y ausencia de datos de prueba.
- Configurar un proyecto Vercel propio y entornos aislados solo cuando esté autorizado. Publicación en producción requiere instrucción explícita; un push o una integración Git no debe anticiparla.

Aceptación: flujo real verificado de navegador a servidor/base/Storage y vuelta, rollback operativo, costos aprobados y revisión normativa documentada antes de producción.

## Datos pendientes y cuándo importan

| Dato/decisión                                                 | Momento necesario                                                                                     | ¿Bloquea ahora?                        |
| ------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | -------------------------------------- |
| Correo del único administrador y recuperación                 | Bootstrap de Auth; probar entrega y acceso antes de operar                                            | No                                     |
| Retención de papelera/versiones/fotos y huérfanos             | Antes de habilitar purga o prometer un plazo de recuperación; evaluar capacidad antes de datos reales | No; purga desactivada                  |
| Backups, responsable y destino                                | Antes de operar con contenido real y de producción                                                    | No                                     |
| Plan Vercel apto comercial y presupuesto                      | Antes de contratar/provisionar con costo o publicar el negocio                                        | No                                     |
| Revalidación Supabase USD 0/cupo/región                       | Inmediatamente antes de crear proyecto propio                                                         | No                                     |
| Nombre definitivo, logo, colores y fuentes                    | Pueden completarse desde el panel; usar nombre provisional y diseño base                              | No                                     |
| WhatsApp, redes y correo comercial                            | Cuando se quieran habilitar; mientras tanto ocultos                                                   | No                                     |
| Vehículos, fotos, precios, monedas y condiciones reales       | Antes de publicar cada ficha; catálogo puede permanecer vacío                                         | No                                     |
| Límites de archivos (formatos, bytes, dimensiones y cantidad) | Antes de implementar/aceptar subidas                                                                  | No; proponer según costo y experiencia |
| Plazos/condiciones de financiación o permuta                  | Solo si el negocio decide mostrarlos; no calcular ni inventar                                         | No                                     |
| Dirección, horarios y dominio                                 | Opcionales; dominio solo con autorización de registro/costo                                           | No                                     |
| Datos comerciales/tributarios y avisos aplicables             | Revisión normativa y preparación de producción                                                        | No                                     |

No hace falta pedir todos los datos juntos para comenzar la siguiente etapa. El correo administrador es distinto del correo comercial público. La falta de marca definitiva o inventario real no impide avanzar con estructura y catálogo vacío.

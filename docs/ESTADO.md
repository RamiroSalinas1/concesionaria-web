# Estado del proyecto

**Etapa terminada: 2 — base técnica y diseño visual navegable.**
2 de noviembre de 2026. Listo para revisar diseño, sin base de datos ni despliegue.

## Git

- Rama: docs/etapa-0-revision-inicial.
- Revisión inicial: e42db76a0103686405ca43e68577a098d4759567, subida antes de comenzar el diseño.
- [PR borrador #1](https://github.com/RamiroSalinas1/concesionaria-web/pull/1) hacia main, sin fusionar.
- Base técnica, diseño, capturas y documentación en un commit separado. Consultar su SHA final en la entrega o con git log -2 --oneline.

## Funciona

Inicio adaptable; catálogo vacío y filtros con URL, validación y limpieza; canales ausentes ocultos; ficha pública inexistente con 404; galería de muestra seleccionable/ampliable; variantes sin imágenes y con precio a consultar; cinco apartados del panel demo; muestra de Apariencia efímera. Nombre, paleta base, fuentes, textos y secciones centralizados con tipos.

## Solo demostración

/desarrollo/ficha y /desarrollo/panel/* solo con next dev. Datos ficticios rotulados, sin autenticación ni persistencia. Agregar/guardar/publicar deshabilitados. No se anuncian guardados falsos, no hay historial ficticio ni panel operativo en /admin.

## Verificaciones

| Comprobación                        | Resultado                                                                                                     |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| install --frozen-lockfile --offline | Correcta; lockfile coherente, sin resolver nuevas versiones                                                   |
| typecheck                           | Correcto                                                                                                      |
| lint                                | Correcto, cero advertencias de lint                                                                           |
| format:check                        | Correcto                                                                                                      |
| build                               | Producción compila sin credenciales                                                                           |
| verify:production                   | Tres rutas públicas 200 y doce casos 404: demos, /admin, ficha ficticia y URL desconocida                     |
| JavaScript público                  | Sin fixture ni módulo del panel demo                                                                          |
| Navegador escritorio/móvil          | Inicio, catálogo, ficha y panel revisados; sin desbordes horizontales en casos inspeccionados                 |
| Filtros                             | Combinación en URL; cambio de moneda limpia importes; año invertido muestra error; limpiar vuelve a /catalogo |
| Panel                               | Cinco apartados recorridos; nombre de muestra vuelve al inicial al recargar                                   |
| Teclado                             | Menú y enlaces con Enter; Escape cierra galería y devuelve el foco                                            |
| Consola final                       | Sin errores ni advertencias en la pasada final de navegación                                                  |
| Movimiento reducido                 | Regla CSS revisada; preferencia del sistema sin alterar                                                       |
| Secretos                            | Sin coincidencias en búsqueda de patrones sobre archivos a versionar                                          |
| MVP.md previo                       | Conservado, mismo SHA-256                                                                                     |
| Auditoría                           | 0 altas, 0 críticas; 1 moderada de tooling, detallada en documento técnico                                    |

Se corrigieron una importación de fuente inexistente, la separación servidor/cliente de la navegación del panel y la advertencia de desplazamiento de Next. Se repitieron las pruebas afectadas.

[Capturas guardadas](capturas/README.md). Los servidores de verificación se detienen al terminar; los comandos de [README.md](../README.md) permiten abrir una sesión propia.

## Pendientes

- Revisar y acordar el diseño.
- Auth de administrador único, recuperación, tablas/permisos/RLS, Storage y operaciones auditadas.
- Persistencia y flujos editoriales, retención y backups.
- Actualizar el conjunto de lint cuando sus plugins admitan versiones nuevas; revisar minimatch.
- Antes de publicar: datos reales, costos, plan comercial, pruebas de seguridad y revisión normativa argentina oficial.

Logo, WhatsApp, redes e inventario no bloquean esta revisión. No hay bloqueo para recorrer la vista local.

## Siguiente paso

Detenerse para revisión del usuario. Base de datos, creación de recursos y seguridad/persistencia requieren una nueva instrucción. Documa no se modificó. Sin recursos Supabase/Vercel nuevos, contratación, dominios, despliegue ni fusión.

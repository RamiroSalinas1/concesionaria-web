# Concesionaria Demo

App web para una concesionaria de Argentina. Nombre provisional y editable.

**Estado: etapa 0, revisión y preparación documental.** No hay aplicación, dependencias instaladas, base de datos propia ni despliegue. Las decisiones técnicas que siguen son propuestas para implementar por etapas.

## Documentación

| Documento | Contenido |
| --- | --- |
| [Revisión inicial](docs/00-revision-inicial.md) | Estado Git, accesos comprobados, recursos visibles, costos y límites de la revisión |
| [Alcance](docs/01-alcance.md) | Producto, diseño, exclusiones y datos reales pendientes |
| [Arquitectura](docs/02-arquitectura.md) | Separación público/privado, publicación y organización futura del código |
| [Modelo de datos](docs/03-modelo-de-datos.md) | Entidades, restricciones, relaciones e índices propuestos |
| [Seguridad](docs/04-seguridad.md) | Administrador único, Auth, permisos, RLS e imágenes |
| [Flujo editorial](docs/05-flujo-editorial.md) | Borradores, vista previa, historial, restauración, papelera y retención |
| [Etapas y aceptación](docs/06-etapas-y-aceptacion.md) | Entregas, verificaciones y decisiones necesarias por momento |
| [Versiones y fuentes](docs/07-versiones-y-fuentes.md) | Consultas oficiales del 2 de noviembre de 2026 y proceso de instalación futura |

## Trabajo local

El clon está en la subcarpeta `concesionaria-web` del espacio de trabajo. Ejecutar los comandos Git desde ella. La rama de esta preparación es `docs/etapa-0-revision-inicial`, basada en `main`.

El archivo `MVP.md` que ya existía en la carpeta contenedora se conserva sin cambios y fuera del clon. Es un antecedente; el alcance acordado de esta revisión está en `docs/01-alcance.md`.

No hay todavía comando de instalación, servidor ni pruebas de aplicación que ejecutar. La siguiente etapa deberá verificar nuevamente compatibilidad, fijar versiones y guardar un único archivo de dependencias bloqueadas.

## Límites del proyecto

- Repositorio exclusivo: [RamiroSalinas1/concesionaria-web](https://github.com/RamiroSalinas1/concesionaria-web).
- No utilizar ni modificar Documa, Supabase `documa-dev` o Vercel `plataforma-de-control-documental`.
- No crear recursos con costo, contratar planes, registrar dominios ni publicar en producción sin la autorización correspondiente.
- No guardar secretos ni datos privados en este repositorio público.
- No inventar inventario, contactos, testimonios, estadísticas ni condiciones financieras.
- Revisar normativa argentina con fuentes oficiales vigentes antes de publicar; no se afirma cumplimiento legal.

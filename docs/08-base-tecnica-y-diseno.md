# Etapa 2: base técnica y diseño visual

2 de noviembre de 2026. La numeración sigue el pedido actual: revisión inicial guardada y luego base visual local. La etapa de datos del plan preliminar no se inició.

## Versiones fijadas y compatibilidad

| Componente                                     | Versión                      |
| ---------------------------------------------- | ---------------------------- |
| Node                                           | 24.x; verificado con 24.22.1 |
| pnpm                                           | 11.25.0                      |
| Next.js / eslint-config-next                   | 16.4.4                       |
| React / React DOM                              | 19.3.1                       |
| TypeScript                                     | 5.9.3                        |
| @types/react / @types/react-dom                | 19.3.0                       |
| @types/node                                    | 24.10.1                      |
| ESLint                                         | 9.39.1                       |
| Prettier                                       | 3.9.10                       |
| lucide-react                                   | 1.66.0                       |
| Fontsource Barlow Condensed / Manrope Variable | 5.3.0                        |

Se reconsultaron metadatos npm antes de instalar. Versiones exactas, packageManager y engines; pnpm-lock.yaml real y peers estrictos. pnpm-workspace.yaml contiene excepciones de antigüedad generadas por pnpm para las versiones exactas verificadas de Next, sin excepción global.

No se adoptaron TypeScript 7.0.2 ni ESLint 10.14.0 pese a figurar como últimas versiones: el parser resuelto admite TypeScript menor a 6.1 y varios plugins de Next solo admiten ESLint hasta la serie 9. El conjunto elegido pasó tipos, lint y build. ESLint 9 avisa que terminó su soporte: revisar el conjunto antes de actualizar, sin forzar peers incompatibles.

Auditoría final: **un aviso moderado exclusivamente de desarrollo** en minimatch, [GHSA-g3hv-75wg-m249](https://github.com/advisories/GHSA-g3hv-75wg-m249); ninguno alto o crítico. El parche indicado requiere minimatch >=11.0.1, fuera de los mayores declarados por sus consumidores. No se impuso un override que cambie su API. Revisar el tooling antes de CI con patrones no confiables o de producción. No equivale a una auditoría completa.

## Estructura y comportamiento

```text
src/app/(public)/       inicio, catálogo y ficha inexistente
src/app/desarrollo/     demos con guardias de servidor
src/components/        navegación, marca, composición y estados
src/config/site.ts     valores iniciales y textos tipados
src/features/catalog/  filtros y estado vacío
src/features/vehicles/ ficha y galería de muestra
src/dev/               fixture explícito y panel de demostración
src/lib/               normalización de filtros
src/types/             modelo de presentación
scripts/               inicio local y prueba de producción
public/licenses/       licencias tipográficas completas
docs/capturas/          capturas reales del navegador
```

Componentes de servidor para estructura; componentes cliente para menú, filtros, galería y muestra de apariencia. Los datos de navegación del panel están separados del módulo cliente.

Sin SDK de Supabase, consultas de inventario o APIs externas. Los filtros conservan estado real en la URL, validan extremos y permiten limpiar. No simulan búsquedas en una base. Marca se habilitará con inventario; cambiar moneda limpia los importes.

## Dirección visual y personalización

Portada con tipografía condensada y pista abstracta original, grafito, espacio y acento rojo. Categorías en franjas; sin fotografías, tarjetas ficticias, estadísticas ni testimonios.

SiteConfig define nombre, paleta base, pareja tipográfica, secciones ordenadas/visibles, navegación, textos y contactos vacíos. Se renderizan solo secciones habilitadas en su orden. Todavía se configura en código, no desde un editor persistente.

Apariencia cambia solo su muestra en memoria, sin alterar el sitio público. Agregar, guardar y publicar están deshabilitados; Historial no inventa eventos.

## Aislamiento de demostraciones

Guardia de entorno tanto en layout como en páginas. Imports de fixture/panel dentro de ramas NODE_ENV === development. En producción retornan 404; sus datos no aparecen en JavaScript público.

La ficha pública nunca busca en el fixture. Se comprobó también /vehiculos/coupe-de-ejemplo: 404. No hay /admin operativo ni registro de usuarios.

No confundir esta demostración con la futura vista previa editorial autenticada. next dev no es un panel seguro: se liga a 127.0.0.1 y no se debe exponer a una red o despliegue. Robots y metadatos sin indexación complementan esta etapa; no autorizan acceso.

## Accesibilidad y revisión

Enlace para saltar contenido, etiquetas nativas, foco visible, navegación móvil por teclado, estados con texto y dialog nativo. Escape cierra la ampliación y devuelve el foco al disparador.

La regla prefers-reduced-motion anula animaciones, transiciones y desplazamiento suave. Se revisó el código sin cambiar la preferencia del sistema. Se agregó data-scroll-behavior según la [guía de Next](https://nextjs.org/docs/messages/missing-data-scroll-behavior).

Contrastes calculados iniciales: texto principal/fondo 17,05:1; secundario/fondo 8,29:1; blanco/botón rojo 4,94:1; título rojo grande/fondo 3,83:1; borde de control/superficie 3,02:1. No certifican conformidad WCAG ni cumplimiento legal.

Revisión en escritorio, incluido 1440 × 1000, móvil 390 × 844 y portada 320 × 800. Capturas de escritorio con ventana de 1280 px y de móvil con 390 px; imágenes de contenido de 1265 y 375 px por la barra de desplazamiento.

## Procedencia de recursos

- Pista, barras de marca provisional, icono e ilustraciones de ficha: SVG/CSS originales de este repositorio. No son fotos de vehículos en venta.
- Barlow Condensed: [proyecto original](https://github.com/jpt/barlow), paquete Fontsource versionado, SIL OFL 1.1.
- Manrope: [proyecto original](https://github.com/sharanda/manrope), paquete Fontsource versionado, SIL OFL 1.1.
- LICENSE íntegros revisados y copiados a public/licenses/; también presentes en los paquetes bloqueados.
- Iconos lucide-react: paquete versionado, licencia ISC.
- Sin imágenes remotas ni descarga de fuentes en tiempo de ejecución.

## Límites

No hay Auth, recuperación, RLS, tablas, Storage, subidas, CRUD, publicación editorial, restauración, papelera, retención ni backups implementados. No se provisionaron servicios ni hubo despliegue.

Primero revisar el diseño. Con una nueva instrucción, preparar datos y seguridad en un entorno propio. Correo administrador al crear la identidad; marca, contactos y vehículos pueden completarse después. Retención/backups antes de purgas o de operar con contenido real.

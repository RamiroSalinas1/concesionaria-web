# Alcance acordado

Este documento recoge el pedido actual y prevalece como alcance sobre el MVP preliminar de la carpeta contenedora. Todo lo descrito es trabajo futuro salvo la documentación de la etapa 0.

## Producto

- Sitio argentino de una única concesionaria, nombre provisional editable **Concesionaria Demo**.
- Catálogo público de autos, motos y otros vehículos, usados y 0 km. Visitantes sin registro ni cuenta.
- Una única cuenta administradora. Sin otros usuarios, invitaciones, equipo ni roles adicionales de aplicación.
- Panel para crear y editar vehículos, fotos, precio, moneda, disponibilidad y formas de pago.
- Por vehículo: contado, transferencia, financiación y permuta, cada opción habilitable de forma independiente. Solo mostrar condiciones proporcionadas por el negocio; no inferir cuotas, tasas, aprobación crediticia ni beneficios.
- Personalización mediante controles y bloques definidos: nombre, logo, colores, tipografías de una lista disponible, portada, textos, destacados, orden/visibilidad de secciones, contactos y redes.
- Guardar borradores, previsualizar y publicar explícitamente, tanto vehículos como configuración.
- Historial persistente, restauración registrada y papelera. Conservar fotos necesarias para recuperar versiones según la política que se acuerde.

## Catálogo y ficha

- Listado con paginación y filtros combinables: tipo, marca, año, moneda, rango de precio y búsqueda por marca/modelo; se pueden limpiar.
- No ordenar ni filtrar mezclando importes de distintas monedas como si fueran comparables. Sin conversión automática de monedas.
- Ficha con URL propia: marca, modelo, versión opcional, año, kilometraje si aplica, condición, descripción, atributos aplicables al tipo, precio con moneda o a consultar y disponibilidad.
- Galería ordenada, portada inequívoca, ampliación accesible y alternativa si no hay foto.
- Disponibilidad: disponible, reservado o vendido; no equivale a publicación. Se propone mostrar el estado publicado y no ofrecer como disponible uno vendido. Archivar o retirar oculta la ficha pública; la decisión de conservar vendidos visibles se puede ajustar después mediante un control definido.
- Contacto solo mediante canales reales configurados. Enlace a WhatsApp con mensaje y ficha solo cuando exista número válido. Sin formulario de consultas ni almacenamiento de datos de visitantes en este alcance.

## Estado inicial sin datos del negocio

Sin logo, redes, correo comercial, WhatsApp ni vehículos reales. Mostrar nombre provisional y un estado vacío cuidado, por ejemplo: «Todavía no hay vehículos publicados».

Ocultar contactos, redes, dirección, horarios, secciones y campos opcionales vacíos. No rellenar con inventario, fotografías de supuestos vehículos, testimonios, estadísticas, ubicaciones o datos del negocio inventados. Los datos sintéticos de pruebas futuras serán explícitos, aislados y nunca publicados como inventario real.

## Diseño

Estética deportiva, moderna y con toque de lujo: negro grafito, grises profundos, blanco y acentos rojos; fotos grandes cuando existan, tipografía clara y animación sutil.

- Diseño desde móvil y panel legible con formularios cómodos, estados de guardado/publicación y errores comprensibles.
- Navegación por teclado, foco visible, etiquetas, contraste suficiente y texto alternativo. No depender solo del rojo o de animaciones para comunicar estado.
- Respetar `prefers-reduced-motion`; evitar movimiento que bloquee la interacción.
- Validar contraste en combinaciones personalizadas y ofrecer alternativas seguras. Tipografías seleccionables de una lista con licencias aptas; sin cargar código, CSS, scripts ni fuentes arbitrarios desde el panel.
- Objetivo de diseño: WCAG 2.2 AA, sujeto a verificación; no constituye afirmación de conformidad ni de cumplimiento legal.

## Fuera de alcance

Pagos, reservas con cobro, simulador de financiación, aprobación de créditos, ecommerce, CRM, portales de terceros, multiempresa, sucursales múltiples, usuarios comerciales, editor libre de páginas y analítica publicitaria. No se agregan por defecto.

La revisión de normativa argentina aplicable se realizará antes de publicar, con fuentes oficiales vigentes y con los datos concretos del negocio. No se afirma cumplimiento legal ni se redactan condiciones comerciales inventadas.

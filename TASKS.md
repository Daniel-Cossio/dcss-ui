# TASKS — dcss-ui (Idea #002)

## Checklist de Hitos de Implementación

- [x] **Hito 1: Fundamentos de Diseño, Tokens CSS y Reset Base**
  - [x] Tokens CSS (`src/css/tokens.css`): paleta dark/light, acentos, espaciados, tipografía, bordes y sombras.
  - [x] Reset CSS (`src/css/reset.css`): box-sizing border-box, font smoothing, normalize para formularios y botones.
  - [x] Punto de entrada CSS inicial (`src/css/index.css`).

- [x] **Hito 2: Catálogo de Componentes CSS**
  - [x] Botones (`src/css/buttons.css`): variantes primary, secondary, danger, ghost, outline, sizes, spinner.
  - [x] Tarjetas (`src/css/cards.css`): header, body, footer, glass variant.
  - [x] Formularios (`src/css/forms.css`): inputs, select, textarea, checkbox, switch animado, input group.
  - [x] Badges (`src/css/badges.css`): pill, solid, outline, dot status.
  - [x] Tablas (`src/css/tables.css`): striped, hover, responsive container.
  - [x] Layout Utilities (`src/css/layout.css`): containers, grid, flex, stack.

- [x] **Hito 3: Utilidades Interactivas Vanilla JS**
  - [x] Theme Manager (`src/js/theme.js`): toggle dark/light, sync localStorage, media query listener.
  - [x] Toast (`src/js/toast.js`): notificaciones dinámicas tipo toast con timeout y animación.
  - [x] Modal (`src/js/modal.js`): dialogs accesibles con tecla ESC y backdrop click.
  - [x] Dropdown (`src/js/dropdown.js`): menús desplegables con cierre al exterior.
  - [x] Tabs (`src/js/tabs.js`): gestor de pestañas accesibles.
  - [x] Drawer (`src/js/drawer.js`): barra lateral responsive.
  - [x] Exportador unificado (`src/js/index.js` y `window.DCSS`).

- [x] **Hito 4: Build System Híbrido y Tests Automatizados**
  - [x] `package.json` con scripts de test, build y empaquetado.
  - [x] Script de bundling/minificación para generar `dist/dcss.min.css` y `dist/dcss.min.js`.
  - [x] Suite de pruebas automatizadas (validación estructural, tokens, APIs interactivas).

- [x] **Hito 5: Showcase Interactivo Documentado**
  - [x] Catálogo interactivo `showcase/index.html` con demo de todos los componentes.
  - [x] Botones para copiar código HTML/JS de cada componente.
  - [x] Documentación técnica `README.md` con guía rápida de instalación vía CDN o NPM.

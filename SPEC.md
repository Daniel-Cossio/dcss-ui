# dcss-ui: Design System & UI Kit Web Minimalista

## 1. Visión y Propósito
`dcss-ui` es una librería gráfica y sistema de diseño UI web minimalista, agnóstico de frameworks, diseñado con enfoque *zero-overhead* y *mobile-first*. Provee una base sólida de tokens de diseño CSS (modo oscuro nativo y modo claro), componentes visuales reutilizables (botones, tarjetas, formularios, tablas, badges) y utilidades interactivas en JavaScript Vanilla (modales, toasts, dropdowns, tabs, toggle de temas) sin dependencias pesadas en tiempo de ejecución.

Está pensada para ser consumida de forma híbrida:
1. **Standalone / CDN**: Un archivo `dcss.min.css` y un `dcss.min.js` para incluir directamente mediante `<link>` y `<script>` en proyectos FastAPI/Jinja2, HTML estático o micro-apps personales.
2. **Módulo ESM / NPM**: Importable como paquete con tipado TypeScript para proyectos frontend modernos.

---

## 2. Requerimientos Funcionales y Estéticos

- **Design Tokens & Temas**:
  - Paleta moderna oscura por defecto (superficies de alto contraste, acentos violeta/índigo, estados semánticos success/warning/danger/info).
  - Selector y toggle fluido a modo claro (`data-theme="light"` o clase `.light-theme`).
  - Escala modular de tipografía (fuente de sistema y fuentes modernas sans-serif).
  - Radios consistentes (`--dcss-radius-sm`, `--dcss-radius-md`, `--dcss-radius-lg`, `--dcss-radius-full`).
  - Elevaciones y sombras con variantes de cristal (*glassmorphism* / backdrop blur).

- **Componentes CSS Puros**:
  - **Botones**: `.dcss-btn` en variantes (`primary`, `secondary`, `danger`, `ghost`, `outline`, tamaños `sm`, `md`, `lg`, estados `loading` y con soporte de iconos).
  - **Tarjetas**: `.dcss-card` (con `.dcss-card-header`, `.dcss-card-body`, `.dcss-card-footer`, variantes interactivas hover y glass).
  - **Formularios e Inputs**: `.dcss-input`, `.dcss-select`, `.dcss-textarea`, `.dcss-checkbox`, `.dcss-switch` (toggle animado), `.dcss-input-group` con prefijo/sufijo de icono.
  - **Badges y Chips**: `.dcss-badge` (colores semánticos, variantes pill y status dot animado).
  - **Tablas de Datos**: `.dcss-table` (estilos cebra striped, resalte al cursor hover, cabecera fija sticky, contenedor `.dcss-table-responsive`).
  - **Utilidades de Layout**: `.dcss-container`, `.dcss-grid`, `.dcss-flex`, `.dcss-stack`.

- **Componentes Interactivos Vanilla JS**:
  - `dcss.toast({ message, type, duration, position })`: Notificaciones no intrusivas flotantes auto-descartables.
  - `dcss.modal({ title, content, onConfirm, onCancel })` / Dialog API accesible con tecla `ESC` y backdrop click.
  - `dcss.dropdown(triggerEl, menuEl)` / Menús contextuales con cierre al click exterior.
  - `dcss.tabs(containerEl)` / Pestañas accesibles y navegación con teclado.
  - `dcss.drawer(triggerEl, drawerEl)` / Barra lateral colapsable responsive para móvil.
  - `dcss.theme.toggle()` y `dcss.theme.get()` / Detección del sistema y persistencia en `localStorage`.

- **Showcase Interactivo**:
  - Demo interactiva en vivo con vista previa de componentes, botones de prueba para abrir modales/toasts y selector de temas en vivo.
  - Bloques de código con botón "Copiar Snippet" para integración rápida.

---

## 3. Arquitectura del Repositorio

```
dcss-ui/
├── src/
│   ├── css/
│   │   ├── tokens.css
│   │   ├── reset.css
│   │   ├── buttons.css
│   │   ├── cards.css
│   │   ├── forms.css
│   │   ├── tables.css
│   │   ├── badges.css
│   │   ├── layout.css
│   │   └── index.css
│   ├── js/
│   │   ├── theme.js
│   │   ├── toast.js
│   │   ├── modal.js
│   │   ├── dropdown.js
│   │   ├── tabs.js
│   │   ├── drawer.js
│   │   └── index.js
├── dist/
│   ├── dcss.css
│   ├── dcss.min.css
│   ├── dcss.js
│   └── dcss.min.js
├── showcase/
│   ├── index.html
│   └── app.js
├── tests/
│   ├── tokens.test.js
│   ├── components.test.js
│   └── interactive.test.js
├── package.json
└── README.md
```

---

## 4. Hitos de Implementación (Milestones)

- **Hito 1**: Fundamentos de Diseño, Tokens CSS y Reset Base (variables semánticas, modo oscuro por defecto, paletas, tipografía y reset).
- **Hito 2**: Catálogo de Componentes CSS (Botones, Tarjetas, Formularios, Badges, Tablas y Utilidades de Layout).
- **Hito 3**: Utilidades Interactivas Vanilla JS (Theme Manager, Toasts flotantes, Modales accesibles, Dropdowns, Tabs y Drawer).
- **Hito 4**: Build System Híbrido & Minificación (`dist/dcss.min.css`, `dist/dcss.min.js`, bundle ESM/UMD) y Suite de Tests Automatizados.
- **Hito 5**: Showcase Interactivo Documentado (Showcase completo navegable con selector de tema, visor de componentes y snippets copiables).

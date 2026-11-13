# ⚡ dcss-ui

> **Design System & UI Kit Web Minimalista, Zero-Overhead & Dark-First**  
> **Inspirado en la Precisión de Raycast con Identidad Cobalt Tech (#3B82F6)**

`dcss-ui` es una librería gráfica web moderna y agnóstica de frameworks concebida para desarrolladores que necesitan interfaces de productividad ultra-rápidas, densas y elegantes (&lt; 43KB CSS minificado, &lt; 21KB JS standalone) sin lidiar con complejas cadenas de compilación ni dependencias pesadas en tiempo de ejecución.

---

## 🎯 Filosofía y Principios

1. **Zero-Overhead**: Cero dependencias de terceros en producción. Sin jQuery, sin Tailwind compiler en el runtime, sin React/Vue obligatorio. Solo CSS nativo optimizado con variables y JavaScript Vanilla moderno.
2. **Dark-First & Estética Raycast**: Arquitectura visual con superficies oscuras escalonadas en tono obsidiana (`#07080A` canvas, `#0D0E11` panel, `#121316` tarjeta, `#18191E` superficie elevada), bordes hairline de 1px (`rgba(255,255,255,0.08)`), destellos superiores cenitales (`--dcss-top-highlight`) y acento eléctrico **Cobalt Tech** (`#3B82F6`). Conmutación instantánea a modo claro mediante `data-theme="light"`.
3. **Productividad Orientada a Teclado**: Componentes nativos diseñados para aplicaciones de alta velocidad: teclas físicas 3D (`.dcss-kbd`), barras de búsqueda estilo Spotlight (`.dcss-command-bar`), listas densas con accesorios (`.dcss-list-item`), vistas divididas maestro-detalle (`.dcss-split-view`) y barras de acción con atajos contextuales (`.dcss-action-bar`).
4. **Mobile-First & Accesible**: Estructuras responsivas con soporte táctil, contenedor de tablas con scroll suave, cajones laterales (*drawers*) y soporte completo de accesibilidad por teclado (`ESC` para modales y dropdowns, navegación por pestañas y trigger `⌘K`).
5. **Consumo Híbrido**: Puede usarse como paquete NPM en proyectos basados en bundlers (Vite, Rollup, Webpack) o como archivos estáticos independientes (CDN / Standalone) en plantillas Jinja2, FastAPI, Flask o sitios HTML tradicionales.

---

## 🚀 Inicio Rápido

### Opción 1: Standalone / CDN (Sin build tools)

Descarga o copia directamente los archivos optimizados de la carpeta `dist/` a tu proyecto:

```html
<!DOCTYPE html>
<html lang="es" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi Aplicación con dcss-ui</title>
  
  <!-- CSS de dcss-ui (Raycast + Cobalt Tech) -->
  <link rel="stylesheet" href="./dist/dcss.min.css">
</head>
<body>
  <div class="dcss-container" style="padding: 2rem 0;">
    <div class="dcss-card">
      <div class="dcss-card-header">
        <span>Hola Mundo</span>
        <span class="dcss-badge dcss-badge-success dcss-badge-pill">Activo</span>
      </div>
      <div class="dcss-card-body">
        <p>Bienvenido a una aplicación rápida con dcss-ui.</p>
        <button class="dcss-btn dcss-btn-primary" onclick="DCSS.toast.success('¡Funciona!')">
          <span>Probar Notificación</span>
          <kbd class="dcss-kbd dcss-kbd-sm" style="margin-left:8px;">⌘S</kbd>
        </button>
      </div>
    </div>
  </div>

  <!-- JavaScript Standalone (expone window.DCSS y auto-inicializa componentes) -->
  <script src="./dist/dcss.min.js"></script>
</body>
</html>
```

### Opción 2: Instalación NPM / Módulo ESM

En proyectos con Node.js, Vite o Next.js:

```bash
npm install dcss-ui
```

Importa estilos y módulos según tus necesidades:

```javascript
// Importar estilos
import 'dcss-ui/css';

// Importar utilidades JavaScript
import { theme, toast, modal, dropdown, tabs, drawer } from 'dcss-ui';

// Ejemplo: Mostrar una notificación
toast.success('¡Módulo ESM importado correctamente!');

// Alternar entre modo oscuro y claro
theme.toggle();
```

---

## ⌨️ Componentes de Productividad Estilo Raycast

### 1. Keycaps 3D (`.dcss-kbd`)
Teclas físicas renderizadas con gradiente de profundidad, relieve físico 3D, borde iluminado y sombra de contacto para indicar atajos de teclado individuales o en secuencia.

```html
<!-- Teclas individuales -->
<kbd class="dcss-kbd">↵</kbd>
<kbd class="dcss-kbd">Esc</kbd>
<kbd class="dcss-kbd">Tab</kbd>
<kbd class="dcss-kbd dcss-kbd-sm">⌘</kbd>

<!-- Grupo de teclas combinadas -->
<div class="dcss-kbd-group">
  <kbd class="dcss-kbd">⌘</kbd>
  <span>+</span>
  <kbd class="dcss-kbd">K</kbd>
</div>

<!-- Integración en botones para atajos directos -->
<button class="dcss-btn dcss-btn-primary">
  <span>Guardar</span>
  <kbd class="dcss-kbd dcss-kbd-sm">⌘S</kbd>
</button>
```

### 2. List Items Densos (`.dcss-list-item`)
Filas interactivas compactas optimizadas para menús de comandos, paletas de búsqueda y navegación rápida:

```html
<ul class="dcss-list">
  <li class="dcss-list-item is-selected">
    <span class="dcss-list-item-icon">🚀</span>
    <div class="dcss-list-item-content">
      <span class="dcss-list-item-title">Deploy to Production</span>
      <span class="dcss-list-item-subtitle">Desplegar contenedores a nube privada</span>
    </div>
    <div class="dcss-list-item-accessories">
      <span class="dcss-badge dcss-badge-success dcss-badge-pill">Producción</span>
      <kbd class="dcss-kbd dcss-kbd-sm">⌘D</kbd>
    </div>
  </li>
</ul>
```

### 3. Command Bar (`.dcss-command-bar`)
Buscador contextual minimalista estilo Spotlight / Command Palette:

```html
<div class="dcss-command-bar">
  <span class="dcss-command-bar-icon">🔍</span>
  <input type="text" class="dcss-command-bar-input" placeholder="Buscar comando o archivo...">
  <div class="dcss-command-bar-shortcut">
    <span class="dcss-kbd-group">
      <kbd class="dcss-kbd dcss-kbd-sm">⌘</kbd>
      <kbd class="dcss-kbd dcss-kbd-sm">K</kbd>
    </span>
  </div>
</div>
```

### 4. Action Bar (`.dcss-action-bar`)
Franja inferior delgada de ventana o modal con separadores sutiles y acciones rápidas por atajo:

```html
<div class="dcss-action-bar">
  <div class="dcss-action-bar-group">
    <a href="#" class="dcss-action-item">
      <kbd class="dcss-kbd dcss-kbd-sm">↵</kbd> Confirmar
    </a>
    <a href="#" class="dcss-action-item">
      <kbd class="dcss-kbd dcss-kbd-sm">Esc</kbd> Cancelar
    </a>
  </div>
  <div class="dcss-action-bar-group">
    <span>Atajos rápidos activos</span>
  </div>
</div>
```

### 5. Split View (`.dcss-split-view`)
Disposición de dos paneles (columna de selección maestra y visor de detalles):

```html
<div class="dcss-split-view">
  <!-- Columna Maestra Izquierda -->
  <div class="dcss-split-view-master">
    <div class="dcss-command-bar">
      <input class="dcss-command-bar-input" placeholder="Filtrar...">
    </div>
    <ul class="dcss-list">
      <li class="dcss-list-item is-selected">Elemento 1</li>
    </ul>
    <div class="dcss-action-bar">
      <span class="dcss-action-item"><kbd class="dcss-kbd dcss-kbd-sm">↵</kbd> Seleccionar</span>
    </div>
  </div>

  <!-- Panel de Detalles Derecho -->
  <div class="dcss-split-view-detail">
    <h4>Vista Previa</h4>
    <p>Detalles del elemento seleccionado.</p>
    <div class="dcss-action-bar">
      <span class="dcss-action-item"><kbd class="dcss-kbd dcss-kbd-sm">Esc</kbd> Volver</span>
    </div>
  </div>
</div>
```

---

## 🎨 Catálogo de Componentes CSS

| Componente | Clase Principal | Modificadores y Variantes | Descripción |
| :--- | :--- | :--- | :--- |
| **Teclas 3D** | `.dcss-kbd` | `.dcss-kbd-sm`, Contenedor: `.dcss-kbd-group` | Teclas físicas con relieve táctil 3D, gradiente y sombra de contacto. |
| **List Items** | `.dcss-list-item` | `.is-selected`, Contenedor: `.dcss-list`<br>Partes: `.dcss-list-item-icon`, `.dcss-list-item-content`, `.dcss-list-item-title`, `.dcss-list-item-subtitle`, `.dcss-list-item-accessories` | Filas densas con icono leading, contenido flexible, badges y teclas de atajo. |
| **Command Bar** | `.dcss-command-bar` | `.dcss-command-bar-icon`, `.dcss-command-bar-input`, `.dcss-command-bar-shortcut`, `.dcss-command-bar-accessories` | Barra de búsqueda integrada estilo Spotlight / Command Palette. |
| **Action Bar** | `.dcss-action-bar` | `.dcss-action-bar-group`, `.dcss-action-item` | Barra de acciones inferior para modales y ventanas con atajos contextuales. |
| **Split View** | `.dcss-split-view` | `.dcss-split-view-master`, `.dcss-split-view-detail` | Disposición dual de 2 paneles (maestro-detalle) con apilado responsivo. |
| **Botones** | `.dcss-btn` | `.dcss-btn-primary`, `.dcss-btn-secondary`, `.dcss-btn-danger`, `.dcss-btn-ghost`, `.dcss-btn-outline`<br>Tamaños: `.dcss-btn-sm`, `.dcss-btn-md`, `.dcss-btn-lg`<br>Estados: `.dcss-btn-loading`, `.is-disabled` | Botones accesibles con estados hover, active, focus, slots para `.dcss-kbd` y spinner integrado. |
| **Tarjetas** | `.dcss-card` | `.dcss-card-interactive`, `.dcss-card-glass`<br>Secciones: `.dcss-card-header`, `.dcss-card-body`, `.dcss-card-footer` | Contenedor de contenido sobre superficie obsidiana (`#121316`) con top-edge highlight y hover lift. |
| **Formularios** | `.dcss-input`, `.dcss-select`, `.dcss-textarea` | `.is-valid`, `.is-invalid`<br>Contenedores: `.dcss-form-group`, `.dcss-input-group`, `.dcss-input-addon`<br>Textos: `.dcss-label`, `.dcss-form-hint`, `.dcss-form-error` | Campos de texto integrados en la superficie, selectores, addons y validaciones semánticas. |
| **Switches y Checks**| `.dcss-switch`, `.dcss-checkbox` | Controles deslizantes animados con clase `.dcss-switch-slider` | Switches animados nativos y cajas de selección accesibles. |
| **Badges & Chips** | `.dcss-badge` | Semánticas: `primary`, `secondary/neutral`, `success`, `warning`, `danger`, `info`<br>Estilos: `.dcss-badge-pill`, `.dcss-badge-outline`<br>Animación: `.dcss-badge-dot`, `.dcss-badge-pulse` | Etiquetas de estado, chips con contorno e indicadores con pulsación viva. |
| **Tablas** | `.dcss-table` | Modificadores: `.dcss-table-striped`, `.dcss-table-hover`, `.dcss-table-sticky`<br>Contenedor: `.dcss-table-responsive` | Tablas de datos con cabecera fija, alternancia de filas, resalte y contenedor táctil responsive. |
| **Layout & Grid** | `.dcss-container`, `.dcss-grid` | `.dcss-grid-cols-2`, `.dcss-grid-cols-3`, `.dcss-grid-cols-4`, `.dcss-flex`, `.dcss-stack` | Utilidades de espaciado modular (4px), contenedor fluido y sistema de grillas CSS. |

---

## ⚡ Referencia de la API JavaScript

Todos los módulos interactivos están accesibles a través del objeto global `window.DCSS` (o importables desde `'dcss-ui'`).

### 1. `DCSS.theme` — Gestor de Temas
Administra la conmutación entre modo oscuro (`dark`) y modo claro (`light`) con sincronización en `localStorage` y soporte para media queries del sistema.

```javascript
// Obtener el tema actual ('dark' | 'light')
const currentTheme = DCSS.theme.get();

// Alternar entre temas
DCSS.theme.toggle();

// Forzar un tema específico
DCSS.theme.set('light');

// Disparo declarativo vía HTML:
// <button data-dcss-theme-toggle>Cambiar Tema</button>
```

### 2. `DCSS.toast` — Notificaciones Flotantes
Crea avisos emergentes auto-descartables con animación fluida y soporte para múltiples posiciones.

```javascript
// Llamada genérica
DCSS.toast({
  message: 'Elemento actualizado',
  type: 'success',     // 'success' | 'danger' | 'warning' | 'info'
  duration: 4000,      // milisegundos (0 para permanente hasta cerrar)
  position: 'top-right' // 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
});

// Métodos directos
DCSS.toast.success('¡Operación exitosa!');
DCSS.toast.danger('Ocurrió un error inesperado');
DCSS.toast.warning('Atención requerida');
DCSS.toast.info('Nueva notificación');
```

### 3. `DCSS.modal` — Diálogos Modales Accesibles
Controla modales declarativos o genera ventanas de diálogo interactivas mediante código, con integración nativa de `.dcss-action-bar`.

```javascript
// Abrir modal existente por ID o selector
DCSS.modal.open('#mi-modal');
DCSS.modal.close('#mi-modal');

// Creación 100% programática
DCSS.modal.create({
  title: '¿Confirmar operación?',
  content: 'Esta acción actualizará los registros permanentemente.',
  confirmText: 'Confirmar',
  cancelText: 'Cancelar',
  onConfirm: () => {
    DCSS.toast.success('Acción confirmada');
  },
  onCancel: () => {
    console.log('Operación cancelada');
  }
});

// Disparo declarativo vía HTML:
// <button data-dcss-modal-target="#mi-modal">Abrir</button>
```

### 4. `DCSS.dropdown` — Menús Desplegables
Gestiona menús contextuales con cierre al exterior y tecla `ESC`.

```javascript
// Disparo declarativo en HTML:
// <div class="dcss-dropdown">
//   <button data-dcss-dropdown>Opciones</button>
//   <div class="dcss-dropdown-menu">...</div>
// </div>

// Control por JS:
DCSS.dropdown.open(menuElement);
DCSS.dropdown.close(menuElement);
DCSS.dropdown.closeAll();
```

### 5. `DCSS.tabs` — Pestañas Interactivas
Conmutación accesible de paneles de pestañas.

```javascript
// Activar una pestaña programáticamente
DCSS.tabs.activate(tabButtonElement);

// Disparo declarativo en HTML:
// <div class="dcss-tabs" data-dcss-tabs>
//   <button class="dcss-tab-btn is-active" data-dcss-tab-target="#panel-1">Pestaña 1</button>
//   <div id="panel-1" class="dcss-tab-pane is-active">...</div>
// </div>
```

### 6. `DCSS.drawer` — Cajón Lateral (Sidebar)
Barra lateral deslizante ideal para menús de navegación en dispositivos móviles.

```javascript
// Control por JS:
DCSS.drawer.open('#sidebar');
DCSS.drawer.close('#sidebar');
DCSS.drawer.toggle('#sidebar');

// Disparo declarativo vía HTML:
// <button data-dcss-drawer-target="#sidebar">Abrir Menú</button>
```

---

## 🛠️ Personalización mediante Variables CSS

Puedes sobrescribir cualquier token de `tokens.css` en tu propia hoja de estilos sin necesidad de recompilar la librería:

```css
:root {
  /* Modificar acento primario (Cobalt Tech por defecto #3b82f6) */
  --dcss-primary: #3b82f6;
  --dcss-primary-hover: #60a5fa;
  --dcss-primary-active: #1d4ed8;

  /* Modificar superficies Raycast */
  --dcss-bg-base: #07080a;
  --dcss-bg-surface: #0d0e11;
  --dcss-bg-card: #121316;
  --dcss-bg-elevated: #18191e;

  /* Modificar radios de bordes */
  --dcss-radius-md: 8px;
  --dcss-radius-lg: 12px;

  /* Modificar tipografía base */
  --dcss-font-sans: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --dcss-font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
}

/* Ajustes específicos para tema claro */
[data-theme="light"],
.light-theme {
  --dcss-bg-canvas: #f8fafc;
  --dcss-bg-surface: #ffffff;
  --dcss-primary: #2563eb;
}
```

---

## 💻 Showcase Interactivo

Para explorar todos los componentes en acción, la barra de comandos `⌘K`, el muestrario de keycaps 3D, el Split View interactivo y los snippets de código listos para copiar, abre el archivo local en tu navegador:

```bash
open showcase/index.html
```

o sírvelo mediante cualquier servidor web local:

```bash
npx serve .
# o con Python:
python3 -m http.server 8080
```

---

## 🧪 Pruebas Automatizadas

El proyecto incluye una suite completa de pruebas unitarias y de integración sobre Node.js:

```bash
# Ejecutar toda la suite (Tokens, Componentes, Interactivos, Build y Showcase)
npm test

# Ejecutar pruebas individuales
npm run test:tokens
npm run test:components
npm run test:interactive
npm run test:build
```

---

## 📄 Licencia

MIT © [Daniel Cossio](https://github.com/danielcossio)

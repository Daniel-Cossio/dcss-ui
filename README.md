# ⚡ dcss-ui

> **Design System & UI Kit Web Minimalista, Zero-Overhead & Dark-First**

`dcss-ui` es una librería gráfica web moderna y agnóstica de frameworks concebida para desarrolladores que necesitan interfaces elegantes, de alto rendimiento y bajo peso (&lt; 40KB CSS minificado, &lt; 21KB JS standalone) sin lidiar con complejas cadenas de compilación ni dependencias pesadas en tiempo de ejecución.

---

## 🎯 Filosofía y Principios

1. **Zero-Overhead**: Sin dependencias de terceros en producción. Sin jQuery, sin Tailwind compiler, sin React/Vue obligatorio. Solo CSS nativo optimizado y JavaScript Vanilla moderno.
2. **Dark-First por Defecto**: Paleta visual moderna diseñada con superficies oscuras de alto contraste, acentos violeta/índigo y conmutación instantánea a modo claro mediante `data-theme="light"`.
3. **Mobile-First & Accesible**: Estructuras responsivas con soporte táctil, contenedor de tablas con scroll suave, cajones laterales (*drawers*) y soporte completo de accesibilidad por teclado (`ESC` para modales y dropdowns, navegación por pestañas).
4. **Consumo Híbrido**: Puede usarse como paquete NPM en proyectos basados en bundlers (Vite, Rollup, Webpack) o como archivos estáticos independientes (CDN / Standalone) en plantillas Jinja2, FastAPI, Flask o sitios HTML tradicionales.

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
  
  <!-- CSS de dcss-ui -->
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
          Probar Notificación
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

## 🎨 Catálogo de Componentes CSS

| Componente | Clase Principal | Modificadores y Variantes | Descripción |
| :--- | :--- | :--- | :--- |
| **Botones** | `.dcss-btn` | `.dcss-btn-primary`, `.dcss-btn-secondary`, `.dcss-btn-danger`, `.dcss-btn-ghost`, `.dcss-btn-outline`<br>Tamaños: `.dcss-btn-sm`, `.dcss-btn-md`, `.dcss-btn-lg`<br>Estados: `.dcss-btn-loading`, `.is-disabled` | Botones accesibles con estados hover, active, focus y spinner de carga integrado. |
| **Tarjetas** | `.dcss-card` | `.dcss-card-interactive`, `.dcss-card-glass`<br>Secciones: `.dcss-card-header`, `.dcss-card-body`, `.dcss-card-footer` | Contenedor de contenido con variantes hover elevadas y efecto glassmorphism con backdrop-blur. |
| **Formularios** | `.dcss-input`, `.dcss-select`, `.dcss-textarea` | `.is-valid`, `.is-invalid`<br>Contenedores: `.dcss-form-group`, `.dcss-input-group`, `.dcss-input-addon`<br>Textos: `.dcss-label`, `.dcss-form-hint`, `.dcss-form-error` | Campos de texto, menús de selección, grupos de entrada con prefijo y validaciones semánticas. |
| **Switches y Checks**| `.dcss-switch`, `.dcss-checkbox` | Controles deslizantes animados con clase `.dcss-switch-slider` | Switches animados nativos y cajas de selección accesibles. |
| **Badges & Chips** | `.dcss-badge` | Semánticas: `primary`, `secondary/neutral`, `success`, `warning`, `danger`, `info`<br>Estilos: `.dcss-badge-pill`, `.dcss-badge-outline`<br>Animación: `.dcss-badge-dot`, `.dcss-badge-pulse` | Etiquetas de estado, chips con contorno e indicadores con pulsación viva. |
| **Tablas** | `.dcss-table` | Modificadores: `.dcss-table-striped`, `.dcss-table-hover`, `.dcss-table-sticky`<br>Contenedor: `.dcss-table-responsive` | Tablas de datos con cabecera fija, alternancia de filas, resalte y contenedor táctil responsive. |
| **Layout & Grid** | `.dcss-container`, `.dcss-grid` | `.dcss-grid-cols-2`, `.dcss-grid-cols-3`, `.dcss-grid-cols-4`, `.dcss-flex`, `.dcss-stack` | Utilidades de espaciado, contenedor fluido y sistema de grillas CSS. |

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
Controla modales declarativos o genera ventanas de diálogo interactivas mediante código.

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
  /* Modificar color primario de marca */
  --dcss-primary: #7c3aed;
  --dcss-primary-hover: #6d28d9;

  /* Modificar radios de bordes */
  --dcss-radius-lg: 16px;

  /* Modificar tipografía base */
  --dcss-font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
}

/* Ajustes específicos para tema claro */
[data-theme="light"],
.light-theme {
  --dcss-bg-canvas: #f8fafc;
  --dcss-bg-surface: #ffffff;
}
```

---

## 💻 Showcase Interactivo

Para explorar todos los componentes en acción, clones visuales, selector de temas y snippets de código listos para copiar, abre el archivo local en tu navegador:

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

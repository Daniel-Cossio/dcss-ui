import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const interactiveCssPath = path.join(rootDir, 'src/css/interactive.css');
const indexCssPath = path.join(rootDir, 'src/css/index.css');

const jsFiles = {
  theme: path.join(rootDir, 'src/js/theme.js'),
  toast: path.join(rootDir, 'src/js/toast.js'),
  modal: path.join(rootDir, 'src/js/modal.js'),
  dropdown: path.join(rootDir, 'src/js/dropdown.js'),
  tabs: path.join(rootDir, 'src/js/tabs.js'),
  drawer: path.join(rootDir, 'src/js/drawer.js'),
  index: path.join(rootDir, 'src/js/index.js')
};

/* ==========================================================================
   Lightweight DOM Simulation Helper for Unit Testing
   ========================================================================== */

class MockClassList {
  constructor() {
    this._set = new Set();
  }
  add(...names) {
    names.forEach(n => n.split(/\s+/).filter(Boolean).forEach(c => this._set.add(c)));
  }
  remove(...names) {
    names.forEach(n => n.split(/\s+/).filter(Boolean).forEach(c => this._set.delete(c)));
  }
  contains(name) {
    return this._set.has(name);
  }
  toString() {
    return Array.from(this._set).join(' ');
  }
}

class MockElement {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.id = '';
    this.classList = new MockClassList();
    this.attributes = {};
    this.children = [];
    this.parentElement = null;
    this.listeners = {};
    this._innerHTML = '';
  }

  get className() {
    return this.classList.toString();
  }

  set className(val) {
    this.classList = new MockClassList();
    if (val) this.classList.add(val);
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(html) {
    this._innerHTML = html;
    // Auto-parse mock children for simple selectors used in dcss components
    if (html.includes('class="')) {
      const classMatches = html.matchAll(/class="([^"]+)"/g);
      for (const m of classMatches) {
        const dummy = new MockElement('span');
        dummy.className = m[1];
        dummy.parentElement = this;
        this.children.push(dummy);
      }
    }
  }

  setAttribute(k, v) {
    this.attributes[k] = String(v);
  }

  getAttribute(k) {
    return this.attributes[k] !== undefined ? this.attributes[k] : null;
  }

  hasAttribute(k) {
    return k in this.attributes;
  }

  removeAttribute(k) {
    delete this.attributes[k];
  }

  appendChild(child) {
    if (child.parentElement) {
      child.parentElement.removeChild(child);
    }
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx !== -1) {
      this.children.splice(idx, 1);
      child.parentElement = null;
    }
    return child;
  }

  contains(el) {
    if (el === this) return true;
    for (const child of this.children) {
      if (child.contains(el)) return true;
    }
    return false;
  }

  closest(selector) {
    let curr = this;
    while (curr) {
      if (curr.matches(selector)) return curr;
      curr = curr.parentElement;
    }
    return null;
  }

  matches(selector) {
    if (selector.includes(',')) {
      return selector.split(',').some(s => this.matches(s.trim()));
    }
    if (selector.startsWith('.')) {
      const classes = selector.split('.').filter(Boolean);
      return classes.every(cls => this.classList.contains(cls));
    }
    if (selector.startsWith('#')) {
      return this.id === selector.slice(1);
    }
    if (selector.startsWith('[') && selector.endsWith(']')) {
      const inside = selector.slice(1, -1);
      if (inside.includes('=')) {
        const [attr, val] = inside.split('=');
        const cleanVal = val.replace(/^["']|["']$/g, '');
        return this.getAttribute(attr) === cleanVal;
      }
      return this.hasAttribute(inside);
    }
    return this.tagName.toLowerCase() === selector.toLowerCase();
  }

  querySelector(selector) {
    return this.querySelectorAll(selector)[0] || null;
  }

  querySelectorAll(selector) {
    const results = [];
    const search = (el) => {
      for (const child of el.children) {
        if (child.matches(selector)) {
          results.push(child);
        }
        search(child);
      }
    };
    search(this);
    return results;
  }

  addEventListener(event, handler) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(handler);
  }

  removeEventListener(event, handler) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter(h => h !== handler);
  }

  dispatchEvent(event) {
    const list = this.listeners[event.type] || [];
    for (const handler of list) {
      handler(event);
    }
    if (this.parentElement && event.bubbles) {
      this.parentElement.dispatchEvent(event);
    }
    return true;
  }
}

function setupMockEnvironment() {
  const store = {};
  const mockLocalStorage = {
    getItem: (k) => store[k] || null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
  };

  const documentElement = new MockElement('html');
  const body = new MockElement('body');
  documentElement.appendChild(body);

  const mockDocument = {
    documentElement,
    body,
    createElement: (tag) => new MockElement(tag),
    getElementById: (id) => {
      const find = (el) => {
        if (el.id === id) return el;
        for (const child of el.children) {
          const res = find(child);
          if (res) return res;
        }
        return null;
      };
      return find(documentElement);
    },
    querySelector: (sel) => documentElement.querySelector(sel),
    querySelectorAll: (sel) => documentElement.querySelectorAll(sel),
    addEventListener: (evt, fn) => documentElement.addEventListener(evt, fn),
    removeEventListener: (evt, fn) => documentElement.removeEventListener(evt, fn),
    dispatchEvent: (evt) => documentElement.dispatchEvent(evt)
  };

  class MockCustomEvent {
    constructor(type, init = {}) {
      this.type = type;
      this.detail = init.detail || {};
      this.bubbles = !!init.bubbles;
    }
  }

  const mockWindow = {
    document: mockDocument,
    localStorage: mockLocalStorage,
    CustomEvent: MockCustomEvent,
    matchMedia: (query) => ({
      matches: false,
      addEventListener: () => {},
      removeEventListener: () => {}
    }),
    addEventListener: (evt, fn) => documentElement.addEventListener(evt, fn),
    removeEventListener: (evt, fn) => documentElement.removeEventListener(evt, fn),
    dispatchEvent: (evt) => documentElement.dispatchEvent(evt)
  };

  global.window = mockWindow;
  global.document = mockDocument;
  global.localStorage = mockLocalStorage;
  global.CustomEvent = MockCustomEvent;
  global.HTMLElement = MockElement;
  global.Node = MockElement;

  return { mockWindow, mockDocument, mockLocalStorage };
}

/* ==========================================================================
   Tests: Hito 3 — Interactive CSS & JS Utilities
   ========================================================================== */

test('Hito 3: Verification of interactive.css Stylesheet', async (t) => {
  await t.test('interactive.css exists and is non-empty', () => {
    assert.ok(fs.existsSync(interactiveCssPath), 'src/css/interactive.css must exist');
    const content = fs.readFileSync(interactiveCssPath, 'utf8').trim();
    assert.ok(content.length > 0, 'interactive.css must not be empty');
  });

  await t.test('interactive.css has balanced braces and parentheses', () => {
    const content = fs.readFileSync(interactiveCssPath, 'utf8');
    const stripped = content.replace(/\/\*[\s\S]*?\*\//g, '');

    let braceCount = 0;
    let parenCount = 0;

    for (let i = 0; i < stripped.length; i++) {
      const char = stripped[i];
      if (char === '{') braceCount++;
      else if (char === '}') braceCount--;
      else if (char === '(') parenCount++;
      else if (char === ')') parenCount--;

      assert.ok(braceCount >= 0, `Unmatched closing brace in interactive.css at index ${i}`);
      assert.ok(parenCount >= 0, `Unmatched closing paren in interactive.css at index ${i}`);
    }

    assert.strictEqual(braceCount, 0, 'Unclosed brace in interactive.css');
    assert.strictEqual(parenCount, 0, 'Unclosed parenthesis in interactive.css');
  });

  await t.test('index.css imports interactive.css', () => {
    const indexContent = fs.readFileSync(indexCssPath, 'utf8');
    assert.match(indexContent, /@import\s+['"]\.\/interactive\.css['"];/, 'index.css must import interactive.css');
  });

  await t.test('interactive.css contains required component classes and states', () => {
    const css = fs.readFileSync(interactiveCssPath, 'utf8');

    // Toasts
    assert.match(css, /\.dcss-toast-container\b/, 'Contains .dcss-toast-container');
    assert.match(css, /\.top-right\b|\.dcss-toast-container--top-right\b/, 'Contains top-right toast positioning');
    assert.match(css, /\.dcss-toast\b/, 'Contains .dcss-toast element');
    assert.match(css, /\.dcss-toast-close\b/, 'Contains .dcss-toast-close button');
    assert.match(css, /\.dcss-toast--info\b|\.dcss-toast\.is-info\b/, 'Contains info toast variant');
    assert.match(css, /\.dcss-toast--success\b|\.dcss-toast\.is-success\b/, 'Contains success toast variant');

    // Modals
    assert.match(css, /\.dcss-modal-backdrop\b/, 'Contains .dcss-modal-backdrop');
    assert.match(css, /\.dcss-modal\b/, 'Contains .dcss-modal container');
    assert.match(css, /\.dcss-modal-dialog\b/, 'Contains .dcss-modal-dialog');
    assert.match(css, /\.dcss-modal-header\b/, 'Contains .dcss-modal-header');
    assert.match(css, /\.dcss-modal-body\b/, 'Contains .dcss-modal-body');
    assert.match(css, /\.dcss-modal-footer\b/, 'Contains .dcss-modal-footer');

    // Dropdown
    assert.match(css, /\.dcss-dropdown\b/, 'Contains .dcss-dropdown container');
    assert.match(css, /\.dcss-dropdown-menu\b/, 'Contains .dcss-dropdown-menu');
    assert.match(css, /\.dcss-dropdown-item\b/, 'Contains .dcss-dropdown-item');

    // Tabs
    assert.match(css, /\.dcss-tabs-nav\b/, 'Contains .dcss-tabs-nav');
    assert.match(css, /\.dcss-tab-btn\b/, 'Contains .dcss-tab-btn');
    assert.match(css, /\.dcss-tab-pane\b/, 'Contains .dcss-tab-pane');

    // Drawer
    assert.match(css, /\.dcss-drawer\b/, 'Contains .dcss-drawer');
    assert.match(css, /\.dcss-drawer-backdrop\b/, 'Contains .dcss-drawer-backdrop');
  });
});

test('Hito 3: Verification of JavaScript Modules Existence and Structure', async (t) => {
  await t.test('All required JS files exist and are non-empty', () => {
    for (const [name, filePath] of Object.entries(jsFiles)) {
      assert.ok(fs.existsSync(filePath), `src/js/${name}.js must exist`);
      const content = fs.readFileSync(filePath, 'utf8').trim();
      assert.ok(content.length > 0, `src/js/${name}.js must not be empty`);
    }
  });

  await t.test('All JS modules export expected interfaces', async () => {
    const themeMod = await import('../src/js/theme.js');
    assert.ok(themeMod.theme, 'theme.js exports theme object');
    assert.strictEqual(typeof themeMod.theme.init, 'function', 'theme.init is function');
    assert.strictEqual(typeof themeMod.theme.toggle, 'function', 'theme.toggle is function');
    assert.strictEqual(typeof themeMod.theme.get, 'function', 'theme.get is function');
    assert.strictEqual(typeof themeMod.theme.set, 'function', 'theme.set is function');
    assert.strictEqual(typeof themeMod.theme.getAccent, 'function', 'theme.getAccent is function');
    assert.strictEqual(typeof themeMod.theme.setAccent, 'function', 'theme.setAccent is function');
    assert.strictEqual(typeof themeMod.theme.getAvailableAccents, 'function', 'theme.getAvailableAccents is function');

    const toastMod = await import('../src/js/toast.js');
    assert.strictEqual(typeof toastMod.toast, 'function', 'toast.js exports toast function');
    assert.strictEqual(typeof toastMod.toast.show, 'function', 'toast.show is function');
    assert.strictEqual(typeof toastMod.toast.dismiss, 'function', 'toast.dismiss is function');

    const modalMod = await import('../src/js/modal.js');
    assert.ok(modalMod.modal, 'modal.js exports modal object');
    assert.strictEqual(typeof modalMod.modal.open, 'function', 'modal.open is function');
    assert.strictEqual(typeof modalMod.modal.close, 'function', 'modal.close is function');
    assert.strictEqual(typeof modalMod.modal.create, 'function', 'modal.create is function');

    const dropdownMod = await import('../src/js/dropdown.js');
    assert.ok(dropdownMod.dropdown, 'dropdown.js exports dropdown object');
    assert.strictEqual(typeof dropdownMod.dropdown.open, 'function', 'dropdown.open is function');
    assert.strictEqual(typeof dropdownMod.dropdown.close, 'function', 'dropdown.close is function');
    assert.strictEqual(typeof dropdownMod.dropdown.toggle, 'function', 'dropdown.toggle is function');
    assert.strictEqual(typeof dropdownMod.dropdown.init, 'function', 'dropdown.init is function');

    const tabsMod = await import('../src/js/tabs.js');
    assert.ok(tabsMod.tabs, 'tabs.js exports tabs object');
    assert.strictEqual(typeof tabsMod.tabs.init, 'function', 'tabs.init is function');
    assert.strictEqual(typeof tabsMod.tabs.activate, 'function', 'tabs.activate is function');

    const drawerMod = await import('../src/js/drawer.js');
    assert.ok(drawerMod.drawer, 'drawer.js exports drawer object');
    assert.strictEqual(typeof drawerMod.drawer.open, 'function', 'drawer.open is function');
    assert.strictEqual(typeof drawerMod.drawer.close, 'function', 'drawer.close is function');
    assert.strictEqual(typeof drawerMod.drawer.toggle, 'function', 'drawer.toggle is function');
    assert.strictEqual(typeof drawerMod.drawer.init, 'function', 'drawer.init is function');

    const indexMod = await import('../src/js/index.js');
    assert.strictEqual(typeof indexMod.initAll, 'function', 'index.js exports initAll function');
    assert.ok(indexMod.DCSS, 'index.js exports DCSS object');
  });
});

test('Hito 3: Theme Manager Functional Tests', async (t) => {
  setupMockEnvironment();
  const { theme } = await import('../src/js/theme.js');

  await t.test('theme.set updates documentElement and localStorage and emits event', () => {
    let capturedEvent = null;
    document.addEventListener('dcss:theme-change', (e) => {
      capturedEvent = e;
    });

    const res = theme.set('light');
    assert.strictEqual(res, 'light');
    assert.strictEqual(document.documentElement.getAttribute('data-theme'), 'light');
    assert.strictEqual(localStorage.getItem('dcss-theme'), 'light');
    assert.ok(capturedEvent, 'Custom event dcss:theme-change was fired');
    assert.strictEqual(capturedEvent.detail.theme, 'light');

    theme.set('dark');
    assert.strictEqual(document.documentElement.getAttribute('data-theme'), 'dark');
    assert.strictEqual(localStorage.getItem('dcss-theme'), 'dark');
    assert.strictEqual(capturedEvent.detail.theme, 'dark');
  });

  await t.test('theme.toggle alternates between dark and light', () => {
    theme.set('dark');
    assert.strictEqual(theme.get(), 'dark');

    const next = theme.toggle();
    assert.strictEqual(next, 'light');
    assert.strictEqual(theme.get(), 'light');

    const nextAgain = theme.toggle();
    assert.strictEqual(nextAgain, 'dark');
    assert.strictEqual(theme.get(), 'dark');
  });

  await t.test('theme.init respects localStorage if present', () => {
    localStorage.setItem('dcss-theme', 'light');
    localStorage.setItem('dcss-accent', 'emerald');
    theme.init();
    assert.strictEqual(document.documentElement.getAttribute('data-theme'), 'light');
    assert.strictEqual(document.documentElement.getAttribute('data-accent'), 'emerald');
  });

  await t.test('theme accent switcher sets attribute, stores in localStorage and emits custom event', () => {
    let capturedAccentEvent = null;
    document.addEventListener('dcss:accent-change', (e) => {
      capturedAccentEvent = e;
    });

    const accents = theme.getAvailableAccents();
    assert.deepStrictEqual(accents, ['ruby', 'monochrome', 'amber', 'emerald', 'amethyst', 'cobalt']);

    const res = theme.setAccent('amber');
    assert.strictEqual(res, 'amber');
    assert.strictEqual(theme.getAccent(), 'amber');
    assert.strictEqual(document.documentElement.getAttribute('data-accent'), 'amber');
    assert.strictEqual(localStorage.getItem('dcss-accent'), 'amber');
    assert.ok(capturedAccentEvent, 'Custom event dcss:accent-change was fired');
    assert.strictEqual(capturedAccentEvent.detail.accent, 'amber');

    // Fallback on invalid accent
    const fallback = theme.setAccent('invalid-color');
    assert.strictEqual(fallback, 'ruby');
    assert.strictEqual(document.documentElement.getAttribute('data-accent'), 'ruby');
  });
});

test('Hito 3: Toast Notification System Tests', async (t) => {
  setupMockEnvironment();
  const { toast, dismiss } = await import('../src/js/toast.js');

  await t.test('toast creates element and appends to container', () => {
    const el = toast({
      title: 'Notificación',
      message: 'Operación exitosa',
      type: 'success',
      duration: 0
    });

    assert.ok(el, 'Toast element was returned');
    assert.ok(el.classList.contains('dcss-toast'), 'Element has .dcss-toast class');
    assert.ok(el.classList.contains('dcss-toast--success'), 'Element has semantic variant class');
    assert.ok(el.parentElement, 'Toast has a parent element');
    assert.ok(el.parentElement.classList.contains('dcss-toast-container'), 'Parent is toast container');
  });

  await t.test('convenience methods (info, warning, danger)', () => {
    const infoEl = toast.info('Info note', { duration: 0 });
    assert.ok(infoEl.classList.contains('dcss-toast--info'));

    const warnEl = toast.warning('Warning note', { duration: 0 });
    assert.ok(warnEl.classList.contains('dcss-toast--warning'));

    const dangerEl = toast.danger('Danger note', { duration: 0 });
    assert.ok(dangerEl.classList.contains('dcss-toast--danger'));
  });

  await t.test('dismiss adds fade-out class', () => {
    const el = toast({ message: 'Auto close', duration: 0 });
    dismiss(el);
    assert.ok(el.classList.contains('is-leaving'), 'Element has is-leaving class');
    assert.ok(el.classList.contains('fade-out'), 'Element has fade-out class');
  });
});

test('Hito 3: Modal Dialog System Tests', async (t) => {
  setupMockEnvironment();
  const { modal } = await import('../src/js/modal.js');

  await t.test('modal.open and modal.close toggle .is-open class and backdrop', () => {
    const modalEl = document.createElement('div');
    modalEl.id = 'test-modal';
    modalEl.className = 'dcss-modal';
    document.body.appendChild(modalEl);

    modal.open(modalEl);
    assert.ok(modalEl.classList.contains('is-open'), 'Modal element has .is-open class');
    assert.strictEqual(modalEl.getAttribute('aria-hidden'), 'false');

    const backdrop = document.querySelector('.dcss-modal-backdrop');
    assert.ok(backdrop, 'Backdrop element exists');
    assert.ok(backdrop.classList.contains('is-open'), 'Backdrop has .is-open class');

    modal.close(modalEl);
    assert.ok(!modalEl.classList.contains('is-open'), 'Modal element removed .is-open class');
    assert.strictEqual(modalEl.getAttribute('aria-hidden'), 'true');
    assert.ok(!backdrop.classList.contains('is-open'), 'Backdrop removed .is-open class');
  });

  await t.test('modal ESC key closes the active modal', () => {
    const modalEl = document.createElement('div');
    modalEl.id = 'esc-modal';
    modalEl.className = 'dcss-modal';
    document.body.appendChild(modalEl);

    modal.open(modalEl);
    assert.ok(modalEl.classList.contains('is-open'));

    // Trigger ESC
    document.dispatchEvent({ type: 'keydown', key: 'Escape' });
    assert.ok(!modalEl.classList.contains('is-open'), 'ESC closed the modal');
  });

  await t.test('modal.create programmatically builds and opens a dialog', () => {
    let confirmed = false;
    const dialogEl = modal.create({
      title: 'Confirmar Eliminación',
      content: '¿Está seguro de continuar?',
      confirmText: 'Sí, eliminar',
      cancelText: 'Cancelar',
      onConfirm: () => { confirmed = true; }
    });

    assert.ok(dialogEl, 'Modal element was returned');
    assert.ok(dialogEl.classList.contains('dcss-modal'), 'Element is a modal');
    assert.ok(dialogEl.classList.contains('is-open'), 'Modal opens automatically');
  });
});

test('Hito 3: Dropdown System Tests', async (t) => {
  setupMockEnvironment();
  const { dropdown } = await import('../src/js/dropdown.js');

  await t.test('dropdown.open, close and toggle work correctly', () => {
    const menuEl = document.createElement('div');
    menuEl.className = 'dcss-dropdown-menu';
    document.body.appendChild(menuEl);

    dropdown.open(menuEl);
    assert.ok(menuEl.classList.contains('is-open'), 'Menu has is-open class');
    assert.strictEqual(menuEl.getAttribute('aria-expanded'), 'true');

    dropdown.close(menuEl);
    assert.ok(!menuEl.classList.contains('is-open'), 'Menu does not have is-open class');
    assert.strictEqual(menuEl.getAttribute('aria-expanded'), 'false');

    dropdown.toggle(menuEl);
    assert.ok(menuEl.classList.contains('is-open'), 'Toggle opened the menu');

    dropdown.toggle(menuEl);
    assert.ok(!menuEl.classList.contains('is-open'), 'Toggle closed the menu');
  });

  await t.test('dropdown.closeAll closes all open menus', () => {
    const menu1 = document.createElement('div');
    menu1.className = 'dcss-dropdown-menu is-open';
    const menu2 = document.createElement('div');
    menu2.className = 'dcss-dropdown-menu is-open';
    document.body.appendChild(menu1);
    document.body.appendChild(menu2);

    dropdown.closeAll();
    assert.ok(!menu1.classList.contains('is-open'));
    assert.ok(!menu2.classList.contains('is-open'));
  });

  await t.test('dropdown.init binds to data-dcss-dropdown and data-dcss-dropdown-trigger', () => {
    const container = document.createElement('div');
    container.className = 'dcss-dropdown';

    const trigger = document.createElement('button');
    trigger.setAttribute('data-dcss-dropdown-trigger', '');
    const menu = document.createElement('div');
    menu.className = 'dcss-dropdown-menu';

    container.appendChild(trigger);
    container.appendChild(menu);
    document.body.appendChild(container);

    dropdown.init(container);

    // Simulate click on trigger
    trigger.dispatchEvent({ type: 'click', preventDefault() {}, stopPropagation() {} });
    assert.ok(menu.classList.contains('is-open'), 'Trigger with data-dcss-dropdown-trigger opened menu');
  });
});

test('Hito 3: Tabs System Tests', async (t) => {
  setupMockEnvironment();
  const { tabs } = await import('../src/js/tabs.js');

  await t.test('tabs.activate selects the target tab and panel', () => {
    const container = document.createElement('div');
    container.className = 'dcss-tabs';

    const nav = document.createElement('div');
    nav.className = 'dcss-tabs-nav';

    const tab1 = document.createElement('button');
    tab1.className = 'dcss-tab-btn is-active';
    tab1.setAttribute('data-dcss-tab-target', '#pane-1');

    const tab2 = document.createElement('button');
    tab2.className = 'dcss-tab-btn';
    tab2.setAttribute('data-dcss-tab-target', '#pane-2');

    nav.appendChild(tab1);
    nav.appendChild(tab2);
    container.appendChild(nav);

    const pane1 = document.createElement('div');
    pane1.id = 'pane-1';
    pane1.className = 'dcss-tab-pane is-active';

    const pane2 = document.createElement('div');
    pane2.id = 'pane-2';
    pane2.className = 'dcss-tab-pane';

    container.appendChild(pane1);
    container.appendChild(pane2);
    document.body.appendChild(container);

    tabs.activate(tab2);

    assert.ok(!tab1.classList.contains('is-active'), 'tab1 deselected');
    assert.strictEqual(tab1.getAttribute('aria-selected'), 'false');

    assert.ok(tab2.classList.contains('is-active'), 'tab2 activated');
    assert.strictEqual(tab2.getAttribute('aria-selected'), 'true');

    assert.ok(!pane1.classList.contains('is-active'), 'pane1 hidden');
    assert.ok(pane2.classList.contains('is-active'), 'pane2 visible');
  });
});

test('Hito 3: Drawer System Tests', async (t) => {
  setupMockEnvironment();
  const { drawer } = await import('../src/js/drawer.js');

  await t.test('drawer.open, close and toggle handle open state and backdrop', () => {
    const drawerEl = document.createElement('div');
    drawerEl.id = 'test-drawer';
    drawerEl.className = 'dcss-drawer';
    document.body.appendChild(drawerEl);

    drawer.open(drawerEl);
    assert.ok(drawerEl.classList.contains('is-open'), 'Drawer has .is-open class');
    assert.strictEqual(drawerEl.getAttribute('aria-hidden'), 'false');

    const backdrop = document.querySelector('.dcss-drawer-backdrop');
    assert.ok(backdrop, 'Drawer backdrop exists');
    assert.ok(backdrop.classList.contains('is-open'), 'Drawer backdrop has .is-open class');

    drawer.close(drawerEl);
    assert.ok(!drawerEl.classList.contains('is-open'), 'Drawer closed');
    assert.strictEqual(drawerEl.getAttribute('aria-hidden'), 'true');
    assert.ok(!backdrop.classList.contains('is-open'), 'Backdrop closed');

    drawer.toggle(drawerEl);
    assert.ok(drawerEl.classList.contains('is-open'), 'Drawer toggled open');

    drawer.toggle(drawerEl);
    assert.ok(!drawerEl.classList.contains('is-open'), 'Drawer toggled closed');
  });

  await t.test('drawer ESC key closes the active drawer', () => {
    const drawerEl = document.createElement('div');
    drawerEl.id = 'esc-drawer';
    drawerEl.className = 'dcss-drawer';
    document.body.appendChild(drawerEl);

    drawer.open(drawerEl);
    assert.ok(drawerEl.classList.contains('is-open'));

    // Trigger ESC
    document.dispatchEvent({ type: 'keydown', key: 'Escape' });
    assert.ok(!drawerEl.classList.contains('is-open'), 'ESC closed the drawer');
  });
});

test('Hito 3: Unified Entrypoint & window.DCSS Verification', async (t) => {
  setupMockEnvironment();
  const indexMod = await import('../src/js/index.js');

  await t.test('initAll initializes declarative elements without error', () => {
    const root = document.createElement('div');

    const toggleBtn = document.createElement('button');
    toggleBtn.setAttribute('data-dcss-theme-toggle', 'true');
    root.appendChild(toggleBtn);

    const modalBtn = document.createElement('button');
    modalBtn.setAttribute('data-dcss-modal-target', '#some-modal');
    root.appendChild(modalBtn);

    assert.doesNotThrow(() => {
      indexMod.initAll(root);
    });
  });

  await t.test('DCSS contains all modules', () => {
    assert.ok(indexMod.DCSS.theme, 'DCSS.theme exists');
    assert.ok(indexMod.DCSS.toast, 'DCSS.toast exists');
    assert.ok(indexMod.DCSS.modal, 'DCSS.modal exists');
    assert.ok(indexMod.DCSS.dropdown, 'DCSS.dropdown exists');
    assert.ok(indexMod.DCSS.tabs, 'DCSS.tabs exists');
    assert.ok(indexMod.DCSS.drawer, 'DCSS.drawer exists');
    assert.ok(indexMod.DCSS.initAll, 'DCSS.initAll exists');
  });
});

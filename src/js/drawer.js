/**
 * dcss-ui — Drawer (Sidebar) System
 * Minimalist Design System & UI Kit
 */

let activeDrawers = [];
let backdropEl = null;
let isKeydownAttached = false;

function getBackdrop() {
  if (typeof document === 'undefined') return null;
  if (!backdropEl || !document.body.contains(backdropEl)) {
    backdropEl = document.querySelector('.dcss-drawer-backdrop');
    if (!backdropEl) {
      backdropEl = document.createElement('div');
      backdropEl.className = 'dcss-drawer-backdrop';
      backdropEl.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backdropEl);
    }
  }
  return backdropEl;
}

function resolveDrawer(drawerElOrId) {
  if (typeof document === 'undefined') return null;
  if (!drawerElOrId) return null;

  if (typeof drawerElOrId === 'string') {
    const sel = drawerElOrId.startsWith('#') || drawerElOrId.startsWith('.')
      ? drawerElOrId
      : `#${drawerElOrId}`;
    return document.querySelector(sel);
  }

  if (drawerElOrId instanceof HTMLElement) {
    if (drawerElOrId.classList.contains('dcss-drawer')) {
      return drawerElOrId;
    }
    const target = drawerElOrId.getAttribute('data-dcss-drawer-target') ||
                   drawerElOrId.getAttribute('data-dcss-drawer');
    if (target) {
      const sel = target.startsWith('#') || target.startsWith('.') ? target : `#${target}`;
      return document.querySelector(sel);
    }
  }

  return null;
}

function onGlobalKeydown(e) {
  if (e.key === 'Escape' && activeDrawers.length > 0) {
    const topDrawer = activeDrawers[activeDrawers.length - 1];
    drawer.close(topDrawer);
  }
}

export const drawer = {
  /**
   * Open a drawer
   * @param {HTMLElement|string} drawerElOrId
   */
  open(drawerElOrId) {
    const el = resolveDrawer(drawerElOrId);
    if (!el) return null;

    const backdrop = getBackdrop();
    if (backdrop) {
      backdrop.classList.add('is-open');
    }

    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');

    if (!activeDrawers.includes(el)) {
      activeDrawers.push(el);
    }

    if (!isKeydownAttached && typeof document !== 'undefined') {
      document.addEventListener('keydown', onGlobalKeydown);
      isKeydownAttached = true;
    }

    // Attach listeners on close buttons
    const closeBtns = el.querySelectorAll('[data-dcss-drawer-close], .dcss-drawer-close');
    closeBtns.forEach((btn) => {
      if (!btn._drawerCloseBound) {
        btn._drawerCloseBound = true;
        btn.addEventListener('click', () => drawer.close(el));
      }
    });

    if (backdrop && !backdrop._clickBound) {
      backdrop.addEventListener('click', () => {
        if (activeDrawers.length > 0) {
          drawer.close(activeDrawers[activeDrawers.length - 1]);
        }
      });
      backdrop._clickBound = true;
    }

    return el;
  },

  /**
   * Close a drawer
   * @param {HTMLElement|string} drawerElOrId
   */
  close(drawerElOrId) {
    const el = resolveDrawer(drawerElOrId);
    if (!el) return null;

    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');

    activeDrawers = activeDrawers.filter((d) => d !== el);

    if (activeDrawers.length === 0) {
      const backdrop = getBackdrop();
      if (backdrop) {
        backdrop.classList.remove('is-open');
      }
      if (isKeydownAttached && typeof document !== 'undefined') {
        document.removeEventListener('keydown', onGlobalKeydown);
        isKeydownAttached = false;
      }
    }

    return el;
  },

  /**
   * Toggle a drawer open/close
   * @param {HTMLElement|string} drawerElOrId
   */
  toggle(drawerElOrId) {
    const el = resolveDrawer(drawerElOrId);
    if (!el) return null;

    if (el.classList.contains('is-open')) {
      return this.close(el);
    } else {
      return this.open(el);
    }
  },

  /**
   * Initialize declarative drawer triggers
   * @param {Document|HTMLElement} root
   */
  init(root = typeof document !== 'undefined' ? document : null) {
    if (!root) return;

    const triggers = root.querySelectorAll('[data-dcss-drawer-target], [data-dcss-drawer]');
    triggers.forEach((trigger) => {
      if (trigger._drawerInit) return;
      trigger._drawerInit = true;

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggle(trigger);
      });
    });
  }
};

export default drawer;

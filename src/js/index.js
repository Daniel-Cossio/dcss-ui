/**
 * dcss-ui — Main JavaScript Entrypoint
 * Minimalist Design System & UI Kit
 */

import { theme } from './theme.js';
import { toast } from './toast.js';
import { modal } from './modal.js';
import { dropdown } from './dropdown.js';
import { tabs } from './tabs.js';
import { drawer } from './drawer.js';

/**
 * Initialize all declarative components and listeners
 * @param {Document|HTMLElement} root
 */
export function initAll(root = typeof document !== 'undefined' ? document : null) {
  if (!root || typeof document === 'undefined') return;

  // 1. Initialize Theme
  theme.init();

  // 2. Initialize Theme Toggle buttons [data-dcss-theme-toggle]
  const themeToggles = root.querySelectorAll('[data-dcss-theme-toggle]');
  themeToggles.forEach((btn) => {
    if (btn._themeToggleBound) return;
    btn._themeToggleBound = true;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      theme.toggle();
    });
  });

  // 3. Initialize Modal Open triggers [data-dcss-modal-target]
  const modalTriggers = root.querySelectorAll('[data-dcss-modal-target]');
  modalTriggers.forEach((btn) => {
    if (btn._modalTriggerBound) return;
    btn._modalTriggerBound = true;
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const target = btn.getAttribute('data-dcss-modal-target');
      if (target) modal.open(target);
    });
  });

  // 4. Initialize Dropdowns
  dropdown.init(root);

  // 5. Initialize Tabs
  tabs.init(root);

  // 6. Initialize Drawers
  drawer.init(root);
}

export const DCSS = {
  theme,
  toast,
  modal,
  dropdown,
  tabs,
  drawer,
  initAll
};

// Auto-initialize when loaded in browser environments
if (typeof window !== 'undefined') {
  window.DCSS = DCSS;

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        initAll(document);
      });
    } else {
      initAll(document);
    }
  }
}

export { theme, toast, modal, dropdown, tabs, drawer };
export default DCSS;

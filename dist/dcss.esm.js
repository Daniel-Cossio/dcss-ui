/*! dcss-ui v0.1.0 | MIT License | Minimalist Design System & UI Kit */


/* --- Module: theme --- */
const theme = (() => {
/**
 * dcss-ui — Theme & Accent Manager
 * Minimalist Design System & UI Kit
 * Supports Light/Dark Modes & Multi-Accent Palettes (Zero AI Look)
 */

const STORAGE_KEY = 'dcss-theme';
const ACCENT_STORAGE_KEY = 'dcss-accent';
const AVAILABLE_ACCENTS = ['ruby', 'monochrome', 'amber', 'emerald', 'amethyst', 'cobalt'];
const theme = {
  /**
   * Get list of available palette accents
   */
  getAvailableAccents() {
    return [...AVAILABLE_ACCENTS];
  },

  /**
   * Get the current active theme ('dark' or 'light')
   */
  get() {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') {
          return saved;
        }
      } catch (e) {
        // localStorage might be unavailable or restricted
      }
    }

    if (typeof document !== 'undefined' && document.documentElement) {
      const currentAttr = document.documentElement.getAttribute('data-theme');
      if (currentAttr === 'light' || currentAttr === 'dark') {
        return currentAttr;
      }
    }

    return 'dark'; // Strict dark-first default (Raycast aesthetic)
  },

  /**
   * Set the theme explicitly to 'dark' or 'light'
   * @param {'dark'|'light'} val
   */
  set(val) {
    const nextTheme = val === 'light' ? 'light' : 'dark';

    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.setAttribute('data-theme', nextTheme);
    }

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, nextTheme);
      } catch (e) {
        // Ignore storage errors in restricted contexts
      }
    }

    if (typeof document !== 'undefined' && typeof CustomEvent !== 'undefined') {
      const event = new CustomEvent('dcss:theme-change', {
        detail: { theme: nextTheme },
        bubbles: true
      });
      document.dispatchEvent(event);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(event);
      }
    }

    return nextTheme;
  },

  /**
   * Toggle between 'dark' and 'light'
   */
  toggle() {
    const current = this.get();
    const next = current === 'dark' ? 'light' : 'dark';
    return this.set(next);
  },

  /**
   * Get the current active color accent palette
   * @returns {'ruby'|'monochrome'|'amber'|'emerald'|'amethyst'|'cobalt'}
   */
  getAccent() {
    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem(ACCENT_STORAGE_KEY);
        if (AVAILABLE_ACCENTS.includes(saved)) {
          return saved;
        }
      } catch (e) {
        // localStorage might be unavailable or restricted
      }
    }

    if (typeof document !== 'undefined' && document.documentElement) {
      const currentAttr = document.documentElement.getAttribute('data-accent');
      if (AVAILABLE_ACCENTS.includes(currentAttr)) {
        return currentAttr;
      }
    }

    return 'ruby'; // Raycast Ruby default (anti-AI look)
  },

  /**
   * Set the accent palette
   * @param {'ruby'|'monochrome'|'amber'|'emerald'|'amethyst'|'cobalt'} name
   */
  setAccent(name) {
    const nextAccent = AVAILABLE_ACCENTS.includes(name) ? name : 'ruby';

    if (typeof document !== 'undefined' && document.documentElement) {
      document.documentElement.setAttribute('data-accent', nextAccent);
    }

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(ACCENT_STORAGE_KEY, nextAccent);
      } catch (e) {
        // Ignore storage errors
      }
    }

    if (typeof document !== 'undefined' && typeof CustomEvent !== 'undefined') {
      const event = new CustomEvent('dcss:accent-change', {
        detail: { accent: nextAccent },
        bubbles: true
      });
      document.dispatchEvent(event);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(event);
      }
    }

    return nextAccent;
  },

  /**
   * Initialize theme and accent from localStorage or defaults
   */
  init() {
    let initialTheme = 'dark'; // Strict dark-first default
    let initialAccent = 'ruby'; // Strict anti-AI Ruby default

    if (typeof localStorage !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem(STORAGE_KEY);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          initialTheme = savedTheme;
        }
        const savedAccent = localStorage.getItem(ACCENT_STORAGE_KEY);
        if (AVAILABLE_ACCENTS.includes(savedAccent)) {
          initialAccent = savedAccent;
        }
      } catch (e) {
        // Fallback to defaults
      }
    }

    this.set(initialTheme);
    this.setAccent(initialAccent);

    // Setup declarative click handlers if in DOM
    if (typeof document !== 'undefined' && document.addEventListener) {
      document.addEventListener('click', (e) => {
        const trigger = e.target.closest('[data-dcss-accent-set]');
        if (trigger) {
          const targetAccent = trigger.getAttribute('data-dcss-accent-set');
          if (targetAccent) {
            this.setAccent(targetAccent);
          }
        }
      });
    }

    return { theme: initialTheme, accent: initialAccent };
  }
};
  return theme;
})();

/* --- Module: toast --- */
const toast = (() => {
/**
 * dcss-ui — Toast Notification System
 * Minimalist Design System & UI Kit
 */

const ICONS = {
  info: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>',
  success: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
  warning: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>',
  danger: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>'
};

/**
 * Get or create container element for given position
 * @param {string} position
 * @returns {HTMLElement|null}
 */
function getContainer(position = 'top-right') {
  if (typeof document === 'undefined') return null;

  const validPositions = ['top-right', 'top-left', 'bottom-right', 'bottom-left'];
  const pos = validPositions.includes(position) ? position : 'top-right';
  const containerId = `dcss-toast-container-${pos}`;

  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.className = `dcss-toast-container ${pos} dcss-toast-container--${pos}`;
    container.setAttribute('role', 'region');
    container.setAttribute('aria-live', 'polite');
    document.body.appendChild(container);
  }
  return container;
}

/**
 * Dismiss a toast element with exit animation
 * @param {HTMLElement} toastEl
 */
function dismiss(toastEl) {
  if (!toastEl || toastEl._isDismissing) return;
  toastEl._isDismissing = true;
  toastEl.classList.add('is-leaving', 'fade-out');

  setTimeout(() => {
    if (toastEl.parentElement) {
      toastEl.parentElement.removeChild(toastEl);
    }
  }, 220);
}

/**
 * Show a toast notification
 * @param {Object|string} options
 * @returns {HTMLElement|null}
 */
function toast(options = {}) {
  if (typeof document === 'undefined') return null;

  const opts = typeof options === 'string' ? { message: options } : options;
  const {
    message = '',
    title = '',
    type = 'info',
    duration = 4000,
    position = 'top-right'
  } = opts;

  const container = getContainer(position);
  if (!container) return null;

  const toastEl = document.createElement('div');
  const validTypes = ['info', 'success', 'warning', 'danger'];
  const safeType = validTypes.includes(type) ? type : 'info';

  toastEl.className = `dcss-toast dcss-toast--${safeType} is-${safeType}`;
  toastEl.setAttribute('role', 'alert');

  const iconMarkup = `<div class="dcss-toast-icon">${ICONS[safeType] || ICONS.info}</div>`;
  const titleMarkup = title ? `<div class="dcss-toast-title">${title}</div>` : '';
  const messageMarkup = message ? `<div class="dcss-toast-message">${message}</div>` : '';
  const closeButtonMarkup = `
    <button type="button" class="dcss-toast-close" aria-label="Close">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;

  toastEl.innerHTML = `
    ${iconMarkup}
    <div class="dcss-toast-content">
      ${titleMarkup}
      ${messageMarkup}
    </div>
    ${closeButtonMarkup}
  `;

  // Close button click handler
  const closeBtn = toastEl.querySelector('.dcss-toast-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => dismiss(toastEl));
  }

  // Auto dismiss timer
  if (duration > 0) {
    setTimeout(() => {
      dismiss(toastEl);
    }, duration);
  }

  container.appendChild(toastEl);
  return toastEl;
}

// Convenience methods attached to toast
toast.show = toast;
toast.dismiss = dismiss;
toast.info = (message, opts = {}) => toast({ ...opts, message, type: 'info' });
toast.success = (message, opts = {}) => toast({ ...opts, message, type: 'success' });
toast.warning = (message, opts = {}) => toast({ ...opts, message, type: 'warning' });
toast.danger = (message, opts = {}) => toast({ ...opts, message, type: 'danger' });
toast.clearAll = () => {
  if (typeof document === 'undefined') return;
  const toasts = document.querySelectorAll('.dcss-toast');
  toasts.forEach((t) => dismiss(t));
};
  return toast;
})();

/* --- Module: modal --- */
const modal = (() => {
/**
 * dcss-ui — Modal Dialog System
 * Minimalist Design System & UI Kit
 */

let activeModals = [];
let backdropEl = null;
let isKeydownAttached = false;

function getBackdrop() {
  if (typeof document === 'undefined') return null;
  if (!backdropEl || !document.body.contains(backdropEl)) {
    backdropEl = document.querySelector('.dcss-modal-backdrop');
    if (!backdropEl) {
      backdropEl = document.createElement('div');
      backdropEl.className = 'dcss-modal-backdrop';
      backdropEl.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backdropEl);
    }
  }
  return backdropEl;
}

function resolveElement(elOrId) {
  if (typeof document === 'undefined') return null;
  if (!elOrId) return null;
  if (typeof elOrId === 'string') {
    const selector = elOrId.startsWith('#') ? elOrId : `#${elOrId}`;
    return document.querySelector(selector);
  }
  return elOrId;
}

function onGlobalKeydown(e) {
  if (e.key === 'Escape' && activeModals.length > 0) {
    const topModal = activeModals[activeModals.length - 1];
    modal.close(topModal);
  }
}
const modal = {
  /**
   * Open a modal element or by ID
   * @param {HTMLElement|string} modalElOrId
   */
  open(modalElOrId) {
    const el = resolveElement(modalElOrId);
    if (!el) return null;

    const backdrop = getBackdrop();
    if (backdrop) {
      backdrop.classList.add('is-open');
    }

    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');

    if (!activeModals.includes(el)) {
      activeModals.push(el);
    }

    if (!isKeydownAttached && typeof document !== 'undefined') {
      document.addEventListener('keydown', onGlobalKeydown);
      isKeydownAttached = true;
    }

    // Attach click listener on backdrop or modal wrapper click outside dialog
    if (!el._backdropBound) {
      el.addEventListener('click', (event) => {
        if (event.target === el) {
          modal.close(el);
        }
      });

      const closeButtons = el.querySelectorAll('[data-dcss-modal-close], .dcss-modal-close');
      closeButtons.forEach((btn) => {
        btn.addEventListener('click', () => modal.close(el));
      });

      el._backdropBound = true;
    }

    if (backdrop && !backdrop._clickBound) {
      backdrop.addEventListener('click', () => {
        if (activeModals.length > 0) {
          modal.close(activeModals[activeModals.length - 1]);
        }
      });
      backdrop._clickBound = true;
    }

    return el;
  },

  /**
   * Close a modal element or by ID
   * @param {HTMLElement|string} modalElOrId
   */
  close(modalElOrId) {
    const el = resolveElement(modalElOrId);
    if (!el) return null;

    el.classList.remove('is-open');
    el.setAttribute('aria-hidden', 'true');

    activeModals = activeModals.filter((m) => m !== el);

    if (activeModals.length === 0) {
      const backdrop = getBackdrop();
      if (backdrop) {
        backdrop.classList.remove('is-open');
      }
      if (isKeydownAttached && typeof document !== 'undefined') {
        document.removeEventListener('keydown', onGlobalKeydown);
        isKeydownAttached = false;
      }
    }

    if (el._isProgrammatic) {
      setTimeout(() => {
        if (el.parentElement) {
          el.parentElement.removeChild(el);
        }
      }, 300);
    }

    return el;
  },

  /**
   * Programmatic modal dialog
   * @param {Object} options
   */
  create(options = {}) {
    if (typeof document === 'undefined') return null;

    const {
      title = 'Confirmación',
      content = '',
      confirmText = 'Aceptar',
      cancelText = 'Cancelar',
      onConfirm = null,
      onCancel = null
    } = options;

    const modalEl = document.createElement('div');
    modalEl.className = 'dcss-modal';
    modalEl.setAttribute('role', 'dialog');
    modalEl.setAttribute('aria-modal', 'true');
    modalEl.setAttribute('aria-hidden', 'true');
    modalEl._isProgrammatic = true;

    const cancelBtnMarkup = cancelText
      ? `<button type="button" class="dcss-btn dcss-btn--ghost dcss-modal-btn-cancel">${cancelText}</button>`
      : '';
    const confirmBtnMarkup = confirmText
      ? `<button type="button" class="dcss-btn dcss-btn--primary dcss-modal-btn-confirm">${confirmText}</button>`
      : '';

    modalEl.innerHTML = `
      <div class="dcss-modal-dialog">
        <div class="dcss-modal-header">
          <h3 class="dcss-modal-title">${title}</h3>
          <button type="button" class="dcss-modal-close" aria-label="Cerrar">&times;</button>
        </div>
        <div class="dcss-modal-body">
          ${typeof content === 'string' ? `<p>${content}</p>` : ''}
        </div>
        <div class="dcss-modal-footer">
          ${cancelBtnMarkup}
          ${confirmBtnMarkup}
        </div>
      </div>
    `;

    if (typeof content !== 'string' && content instanceof Node) {
      const body = modalEl.querySelector('.dcss-modal-body');
      body.appendChild(content);
    }

    document.body.appendChild(modalEl);

    const confirmBtn = modalEl.querySelector('.dcss-modal-btn-confirm');
    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        if (typeof onConfirm === 'function') onConfirm(modalEl);
        modal.close(modalEl);
      });
    }

    const cancelBtn = modalEl.querySelector('.dcss-modal-btn-cancel');
    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        if (typeof onCancel === 'function') onCancel(modalEl);
        modal.close(modalEl);
      });
    }

    modal.open(modalEl);
    return modalEl;
  }
};
  return modal;
})();

/* --- Module: dropdown --- */
const dropdown = (() => {
/**
 * dcss-ui — Dropdown System
 * Minimalist Design System & UI Kit
 */

let isOutsideClickAttached = false;

function resolveMenu(triggerOrMenu) {
  if (typeof document === 'undefined') return null;
  if (!triggerOrMenu) return null;

  if (typeof triggerOrMenu === 'string') {
    const sel = triggerOrMenu.startsWith('#') || triggerOrMenu.startsWith('.')
      ? triggerOrMenu
      : `#${triggerOrMenu}`;
    return document.querySelector(sel);
  }

  if (triggerOrMenu instanceof HTMLElement) {
    if (triggerOrMenu.classList.contains('dcss-dropdown-menu')) {
      return triggerOrMenu;
    }

    // Check data attribute target
    const target = triggerOrMenu.getAttribute('data-dcss-dropdown') ||
                   triggerOrMenu.getAttribute('data-dcss-dropdown-trigger');
    if (target && target !== '' && target !== 'true') {
      const targetEl = document.querySelector(target.startsWith('#') ? target : `#${target}`);
      if (targetEl) return targetEl;
    }

    // Check sibling or descendant within .dcss-dropdown
    const parentContainer = triggerOrMenu.closest('.dcss-dropdown');
    if (parentContainer) {
      return parentContainer.querySelector('.dcss-dropdown-menu');
    }

    // Direct sibling
    if (triggerOrMenu.nextElementSibling?.classList?.contains('dcss-dropdown-menu')) {
      return triggerOrMenu.nextElementSibling;
    }
  }

  return null;
}

function handleOutsideClick(e) {
  if (typeof document === 'undefined') return;

  const openMenus = document.querySelectorAll('.dcss-dropdown-menu.is-open');
  if (openMenus.length === 0) return;

  openMenus.forEach((menu) => {
    const container = menu.closest('.dcss-dropdown');
    const isInsideMenu = menu.contains(e.target);
    const isInsideContainer = container && container.contains(e.target);
    const isTrigger = e.target.hasAttribute?.('data-dcss-dropdown') ||
                      e.target.hasAttribute?.('data-dcss-dropdown-trigger') ||
                      e.target.closest?.('[data-dcss-dropdown], [data-dcss-dropdown-trigger]');

    if (!isInsideMenu && !isInsideContainer && !isTrigger) {
      dropdown.close(menu);
    }
  });
}

function handleDropdownKeydown(e) {
  if (e.key === 'Escape') {
    dropdown.closeAll();
  }
}
const dropdown = {
  /**
   * Open dropdown menu
   * @param {HTMLElement|string} triggerOrMenu
   */
  open(triggerOrMenu) {
    const menu = resolveMenu(triggerOrMenu);
    if (!menu) return null;

    // Close any other open dropdowns first for cleaner UX
    this.closeAll();

    menu.classList.add('is-open');
    menu.setAttribute('aria-expanded', 'true');

    if (!isOutsideClickAttached && typeof document !== 'undefined') {
      document.addEventListener('click', handleOutsideClick);
      document.addEventListener('keydown', handleDropdownKeydown);
      isOutsideClickAttached = true;
    }

    return menu;
  },

  /**
   * Close dropdown menu
   * @param {HTMLElement|string} triggerOrMenu
   */
  close(triggerOrMenu) {
    const menu = resolveMenu(triggerOrMenu);
    if (!menu) return null;

    menu.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
    return menu;
  },

  /**
   * Toggle dropdown open/close state
   * @param {HTMLElement|string} triggerOrMenu
   */
  toggle(triggerOrMenu) {
    const menu = resolveMenu(triggerOrMenu);
    if (!menu) return null;

    if (menu.classList.contains('is-open')) {
      return this.close(menu);
    } else {
      return this.open(menu);
    }
  },

  /**
   * Close all currently open dropdown menus
   */
  closeAll() {
    if (typeof document === 'undefined') return;
    const openMenus = document.querySelectorAll('.dcss-dropdown-menu.is-open');
    openMenus.forEach((m) => {
      m.classList.remove('is-open');
      m.setAttribute('aria-expanded', 'false');
    });
  },

  /**
   * Initialize dropdown triggers on the page or inside root
   * @param {Document|HTMLElement} root
   */
  init(root = typeof document !== 'undefined' ? document : null) {
    if (!root) return;

    const triggers = root.querySelectorAll('[data-dcss-dropdown], [data-dcss-dropdown-trigger]');
    triggers.forEach((trigger) => {
      if (trigger._dropdownInitialized) return;
      trigger._dropdownInitialized = true;

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggle(trigger);
      });
    });

    // Auto-close open menu when an item is selected
    const items = root.querySelectorAll('.dcss-dropdown-item');
    items.forEach((item) => {
      if (item._dropdownItemBound) return;
      item._dropdownItemBound = true;
      item.addEventListener('click', () => {
        const parentMenu = item.closest('.dcss-dropdown-menu');
        if (parentMenu) {
          this.close(parentMenu);
        }
      });
    });

    if (!isOutsideClickAttached && typeof document !== 'undefined') {
      document.addEventListener('click', handleOutsideClick);
      document.addEventListener('keydown', handleDropdownKeydown);
      isOutsideClickAttached = true;
    }
  }
};
  return dropdown;
})();

/* --- Module: tabs --- */
const tabs = (() => {
/**
 * dcss-ui — Tabs System
 * Minimalist Design System & UI Kit
 */

/**
 * Resolve target tab pane selector or element
 * @param {HTMLElement} btn
 * @returns {string|HTMLElement|null}
 */
function getPaneTarget(btn) {
  const targetAttr = btn.getAttribute('data-dcss-tab-target') ||
                     btn.getAttribute('data-tab-target') ||
                     btn.getAttribute('href');
  return targetAttr;
}
const tabs = {
  /**
   * Activate a specific tab button and its corresponding pane
   * @param {HTMLElement} tabBtn
   */
  activate(tabBtn) {
    if (!tabBtn) return;

    const nav = tabBtn.closest('.dcss-tabs-nav') || tabBtn.closest('[role="tablist"]');
    const container = tabBtn.closest('[data-dcss-tabs], .dcss-tabs');

    // Deselect other tabs in the same tablist
    if (nav) {
      const allButtons = nav.querySelectorAll('.dcss-tab-btn, [role="tab"]');
      allButtons.forEach((btn) => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-selected', 'false');
        btn.setAttribute('tabindex', '-1');
      });
    }

    // Activate the current tab button
    tabBtn.classList.add('is-active');
    tabBtn.setAttribute('aria-selected', 'true');
    tabBtn.setAttribute('tabindex', '0');

    // Find and activate the corresponding tab pane
    const target = getPaneTarget(tabBtn);
    if (!target) return;

    // Search inside the tabs container first, then global document
    let pane = null;
    if (container) {
      pane = container.querySelector(target.startsWith('#') ? target : `#${target}`);
    }
    if (!pane && typeof document !== 'undefined') {
      pane = document.querySelector(target.startsWith('#') ? target : `#${target}`);
    }

    if (pane) {
      const contentContainer = pane.closest('.dcss-tabs-content') || pane.parentElement;
      if (contentContainer) {
        const allPanes = contentContainer.querySelectorAll('.dcss-tab-pane, [role="tabpanel"]');
        allPanes.forEach((p) => p.classList.remove('is-active'));
      }
      pane.classList.add('is-active');
    }
  },

  /**
   * Initialize tab containers
   * @param {Document|HTMLElement} root
   */
  init(root = typeof document !== 'undefined' ? document : null) {
    if (!root) return;

    const tabContainers = root.querySelectorAll('[data-dcss-tabs], .dcss-tabs');

    tabContainers.forEach((container) => {
      const tabNav = container.querySelector('.dcss-tabs-nav') || container;
      if (tabNav) {
        tabNav.setAttribute('role', 'tablist');
      }

      const buttons = container.querySelectorAll('.dcss-tab-btn, [role="tab"]');
      let hasActive = false;

      buttons.forEach((btn, index) => {
        btn.setAttribute('role', 'tab');

        if (btn.classList.contains('is-active') || btn.getAttribute('aria-selected') === 'true') {
          hasActive = true;
          this.activate(btn);
        } else {
          btn.setAttribute('aria-selected', 'false');
          btn.setAttribute('tabindex', '-1');
        }

        if (!btn._tabsInitialized) {
          btn._tabsInitialized = true;
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            this.activate(btn);
          });

          // Keyboard arrow navigation between tabs
          btn.addEventListener('keydown', (e) => {
            let targetBtn = null;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
              e.preventDefault();
              targetBtn = buttons[(index + 1) % buttons.length];
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
              e.preventDefault();
              targetBtn = buttons[(index - 1 + buttons.length) % buttons.length];
            }

            if (targetBtn) {
              targetBtn.focus();
              this.activate(targetBtn);
            }
          });
        }
      });

      // If no tab was active by default, activate the first one
      if (!hasActive && buttons.length > 0) {
        this.activate(buttons[0]);
      }
    });
  }
};
  return tabs;
})();

/* --- Module: drawer --- */
const drawer = (() => {
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
const drawer = {
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
  return drawer;
})();

function initAll(root = typeof document !== 'undefined' ? document : null) {
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

const DCSS = {
  theme,
  toast,
  modal,
  dropdown,
  tabs,
  drawer,
  initAll
};


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

export { theme, toast, modal, dropdown, tabs, drawer, initAll, DCSS };
export default DCSS;

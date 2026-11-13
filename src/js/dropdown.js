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

export const dropdown = {
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

    // Progressive Popover API support
    if (typeof menu.showPopover === 'function' && menu.hasAttribute('popover')) {
      try {
        menu.showPopover();
      } catch (_) {}
    }

    // Sync ARIA expanded state on trigger if within container
    const container = menu.closest ? menu.closest('.dcss-dropdown') : null;
    if (container) {
      const trigger = container.querySelector('[data-dcss-dropdown], [data-dcss-dropdown-trigger]');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'true');
      }
    }

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

    // Progressive Popover API support
    if (typeof menu.hidePopover === 'function' && menu.hasAttribute('popover')) {
      try {
        menu.hidePopover();
      } catch (_) {}
    }

    // Sync ARIA expanded state on trigger if within container
    const container = menu.closest ? menu.closest('.dcss-dropdown') : null;
    if (container) {
      const trigger = container.querySelector('[data-dcss-dropdown], [data-dcss-dropdown-trigger]');
      if (trigger) {
        trigger.setAttribute('aria-expanded', 'false');
      }
    }

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

      if (typeof m.hidePopover === 'function' && m.hasAttribute('popover')) {
        try {
          m.hidePopover();
        } catch (_) {}
      }

      const container = m.closest ? m.closest('.dcss-dropdown') : null;
      if (container) {
        const trigger = container.querySelector('[data-dcss-dropdown], [data-dcss-dropdown-trigger]');
        if (trigger) {
          trigger.setAttribute('aria-expanded', 'false');
        }
      }
    });
  },

  /**
   * Initialize dropdown triggers on the page or inside root
   * @param {Document|HTMLElement} root
   */
  init(root = typeof document !== 'undefined' ? document : null) {
    if (!root) return;

    const containers = root.querySelectorAll('.dcss-dropdown');
    containers.forEach((container) => {
      const menu = container.querySelector('.dcss-dropdown-menu');
      if (menu && !menu.getAttribute('role')) {
        menu.setAttribute('role', 'menu');
      }
    });

    const triggers = root.querySelectorAll('[data-dcss-dropdown], [data-dcss-dropdown-trigger]');
    triggers.forEach((trigger) => {
      if (!trigger.hasAttribute('aria-haspopup')) {
        trigger.setAttribute('aria-haspopup', 'menu');
      }
      if (!trigger.hasAttribute('aria-expanded')) {
        trigger.setAttribute('aria-expanded', 'false');
      }

      if (trigger._dropdownInitialized) return;
      trigger._dropdownInitialized = true;

      trigger.addEventListener('click', (e) => {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
        this.toggle(trigger);
      });

      // Keyboard navigation from trigger (ArrowDown opens and focuses first item)
      trigger.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          if (typeof e.preventDefault === 'function') e.preventDefault();
          const menu = this.open(trigger);
          if (menu) {
            const firstItem = menu.querySelector('.dcss-dropdown-item:not(:disabled)');
            if (firstItem && typeof firstItem.focus === 'function') firstItem.focus();
          }
        }
      });
    });

    // Auto-close open menu when an item is selected & keyboard navigation
    const items = root.querySelectorAll('.dcss-dropdown-item');
    items.forEach((item) => {
      if (!item.hasAttribute('role')) {
        item.setAttribute('role', 'menuitem');
      }

      if (item._dropdownItemBound) return;
      item._dropdownItemBound = true;

      item.addEventListener('click', () => {
        const parentMenu = item.closest ? item.closest('.dcss-dropdown-menu') : null;
        if (parentMenu) {
          this.close(parentMenu);
        }
      });

      // WAI-ARIA keyboard navigation within dropdown items
      item.addEventListener('keydown', (e) => {
        const parentMenu = item.closest ? item.closest('.dcss-dropdown-menu') : null;
        if (!parentMenu) return;

        const menuItems = Array.from(parentMenu.querySelectorAll('.dcss-dropdown-item:not(:disabled)'));
        const currentIndex = menuItems.indexOf(item);

        if (e.key === 'ArrowDown') {
          if (typeof e.preventDefault === 'function') e.preventDefault();
          const next = menuItems[(currentIndex + 1) % menuItems.length];
          if (next && typeof next.focus === 'function') next.focus();
        } else if (e.key === 'ArrowUp') {
          if (typeof e.preventDefault === 'function') e.preventDefault();
          const prev = menuItems[(currentIndex - 1 + menuItems.length) % menuItems.length];
          if (prev && typeof prev.focus === 'function') prev.focus();
        } else if (e.key === 'Home') {
          if (typeof e.preventDefault === 'function') e.preventDefault();
          if (menuItems[0] && typeof menuItems[0].focus === 'function') menuItems[0].focus();
        } else if (e.key === 'End') {
          if (typeof e.preventDefault === 'function') e.preventDefault();
          const last = menuItems[menuItems.length - 1];
          if (last && typeof last.focus === 'function') last.focus();
        } else if (e.key === 'Escape') {
          if (typeof e.preventDefault === 'function') e.preventDefault();
          this.close(parentMenu);
          const container = parentMenu.closest ? parentMenu.closest('.dcss-dropdown') : null;
          if (container) {
            const trig = container.querySelector('[data-dcss-dropdown], [data-dcss-dropdown-trigger]');
            if (trig && typeof trig.focus === 'function') trig.focus();
          }
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

export default dropdown;

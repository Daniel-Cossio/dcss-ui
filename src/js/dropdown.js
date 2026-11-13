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
    const target = triggerOrMenu.getAttribute('data-dcss-dropdown');
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
                      e.target.closest?.('[data-dcss-dropdown]');

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

    const triggers = root.querySelectorAll('[data-dcss-dropdown]');
    triggers.forEach((trigger) => {
      if (trigger._dropdownInitialized) return;
      trigger._dropdownInitialized = true;

      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.toggle(trigger);
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

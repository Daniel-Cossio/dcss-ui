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

export const tabs = {
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
        allPanes.forEach((p) => {
          p.classList.remove('is-active');
          p.setAttribute('aria-hidden', 'true');
        });
      }
      pane.classList.add('is-active');
      pane.setAttribute('aria-hidden', 'false');
      if (!pane.hasAttribute('role')) {
        pane.setAttribute('role', 'tabpanel');
      }
      pane.setAttribute('tabindex', '0');
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

          // Keyboard arrow & Home/End navigation between tabs (WAI-ARIA Tabs pattern)
          btn.addEventListener('keydown', (e) => {
            let targetBtn = null;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
              e.preventDefault();
              targetBtn = buttons[(index + 1) % buttons.length];
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
              e.preventDefault();
              targetBtn = buttons[(index - 1 + buttons.length) % buttons.length];
            } else if (e.key === 'Home') {
              e.preventDefault();
              targetBtn = buttons[0];
            } else if (e.key === 'End') {
              e.preventDefault();
              targetBtn = buttons[buttons.length - 1];
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

export default tabs;

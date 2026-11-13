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

export const modal = {
  /**
   * Open a modal element or by ID
   * @param {HTMLElement|string} modalElOrId
   */
  open(modalElOrId) {
    const el = resolveElement(modalElOrId);
    if (!el) return null;

    // Save previous active element for focus restoration (WCAG 2.4.3)
    if (typeof document !== 'undefined' && document.activeElement && document.activeElement !== document.body) {
      el._previousActiveElement = document.activeElement;
    }

    const backdrop = getBackdrop();
    if (backdrop) {
      backdrop.classList.add('is-open');
    }

    el.classList.add('is-open');
    el.setAttribute('aria-hidden', 'false');

    // Progressive enhancement: Native HTML5 <dialog> support
    if (typeof el.showModal === 'function' && !el.open) {
      try {
        el.showModal();
      } catch (_) {
        // Fallback gracefully if already open or custom element
      }
    }

    if (!activeModals.includes(el)) {
      activeModals.push(el);
    }

    if (!isKeydownAttached && typeof document !== 'undefined') {
      document.addEventListener('keydown', onGlobalKeydown);
      isKeydownAttached = true;
    }

    // Native <dialog> cancel event sync (ESC key in browser top-layer)
    if (!el._cancelBound) {
      el.addEventListener('cancel', (e) => {
        e.preventDefault();
        modal.close(el);
      });
      el._cancelBound = true;
    }

    // Accessible Focus Trap inside modal dialog
    if (!el._focusTrapBound) {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          const focusable = el.querySelectorAll('button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])');
          if (focusable.length > 0) {
            const first = focusable[0];
            const last = focusable[focusable.length - 1];
            if (e.shiftKey && (document.activeElement === first || document.activeElement === el)) {
              e.preventDefault();
              if (typeof last.focus === 'function') last.focus();
            } else if (!e.shiftKey && document.activeElement === last) {
              e.preventDefault();
              if (typeof first.focus === 'function') first.focus();
            }
          }
        }
      });
      el._focusTrapBound = true;
    }

    // Auto-focus first focusable control inside modal or dialog itself
    const firstFocusable = el.querySelector('button:not(:disabled), [href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])');
    if (firstFocusable && typeof firstFocusable.focus === 'function') {
      firstFocusable.focus();
    } else if (typeof el.focus === 'function') {
      el.focus();
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

    // Progressive enhancement: Native HTML5 <dialog> close
    if (typeof el.close === 'function' && el.open) {
      try {
        el.close();
      } catch (_) {
        // Fallback gracefully
      }
    }

    // Restore previous focus
    if (el._previousActiveElement && typeof el._previousActiveElement.focus === 'function') {
      try {
        el._previousActiveElement.focus();
      } catch (_) {}
      el._previousActiveElement = null;
    }

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
      onCancel = null,
      useDialog = false
    } = options;

    const modalEl = (useDialog && typeof HTMLDialogElement !== 'undefined')
      ? document.createElement('dialog')
      : document.createElement('div');
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

export default modal;

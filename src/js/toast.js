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
export function dismiss(toastEl) {
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
export function toast(options = {}) {
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

export default toast;

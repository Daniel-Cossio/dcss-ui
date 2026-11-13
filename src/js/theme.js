/**
 * dcss-ui — Theme & Accent Manager
 * Minimalist Design System & UI Kit
 * Supports Light/Dark Modes & Multi-Accent Palettes (Zero AI Look)
 */

const STORAGE_KEY = 'dcss-theme';
const ACCENT_STORAGE_KEY = 'dcss-accent';
const AVAILABLE_ACCENTS = ['ruby', 'monochrome', 'amber', 'emerald', 'amethyst', 'cobalt'];

export const theme = {
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

export default theme;

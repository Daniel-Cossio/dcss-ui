/**
 * dcss-ui — Theme Manager
 * Minimalist Design System & UI Kit
 */

const STORAGE_KEY = 'dcss-theme';

export const theme = {
  /**
   * Get the current active theme ('dark' or 'light')
   */
  get() {
    if (typeof document !== 'undefined' && document.documentElement) {
      const currentAttr = document.documentElement.getAttribute('data-theme');
      if (currentAttr === 'light' || currentAttr === 'dark') {
        return currentAttr;
      }
    }

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

    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return prefersDark ? 'dark' : 'light';
    }

    return 'dark'; // Default fallback
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
   * Initialize theme from localStorage or system preferences
   */
  init() {
    let initialTheme = 'dark';

    if (typeof localStorage !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'light' || saved === 'dark') {
          initialTheme = saved;
        } else if (typeof window !== 'undefined' && window.matchMedia) {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          initialTheme = prefersDark ? 'dark' : 'light';
        }
      } catch (e) {
        if (typeof window !== 'undefined' && window.matchMedia) {
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          initialTheme = prefersDark ? 'dark' : 'light';
        }
      }
    }

    this.set(initialTheme);

    // Listen to OS theme changes if user hasn't explicitly set localStorage
    if (typeof window !== 'undefined' && window.matchMedia) {
      try {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', (e) => {
            let hasSaved = false;
            try {
              hasSaved = Boolean(localStorage.getItem(STORAGE_KEY));
            } catch (err) {}
            if (!hasSaved) {
              this.set(e.matches ? 'dark' : 'light');
            }
          });
        }
      } catch (e) {}
    }

    return initialTheme;
  }
};

export default theme;

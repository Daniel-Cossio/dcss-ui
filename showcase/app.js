/**
 * dcss-ui — Showcase Interactive Application Script
 * Raycast-Inspired Productivity & Minimalist UI Kit
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Interactive Button Loading Simulation (1.5 seconds)
  // ==========================================================================
  const btnLoading = document.getElementById('btn-demo-loading');
  if (btnLoading) {
    btnLoading.addEventListener('click', (e) => {
      e.preventDefault();
      if (btnLoading.classList.contains('dcss-btn-loading')) return;

      btnLoading.classList.add('dcss-btn-loading');
      btnLoading.disabled = true;

      setTimeout(() => {
        btnLoading.classList.remove('dcss-btn-loading');
        btnLoading.disabled = false;
        if (typeof window.DCSS !== 'undefined' && window.DCSS.toast) {
          window.DCSS.toast({
            message: '¡Acción asíncrona completada con éxito (1.5s)!',
            type: 'success',
            position: 'top-right'
          });
        }
      }, 1500);
    });
  }

  // ==========================================================================
  // 2. Toast Demonstration Triggers
  // ==========================================================================
  const toastSuccessBtn = document.getElementById('toast-success-btn');
  if (toastSuccessBtn) {
    toastSuccessBtn.addEventListener('click', () => {
      window.DCSS?.toast?.({
        message: '¡Operación guardada correctamente en el sistema!',
        type: 'success',
        position: 'top-right'
      });
    });
  }

  const toastDangerBtn = document.getElementById('toast-danger-btn');
  if (toastDangerBtn) {
    toastDangerBtn.addEventListener('click', () => {
      window.DCSS?.toast?.({
        message: '✕ Error 500: Fallo en la comunicación con el servidor.',
        type: 'danger',
        position: 'bottom-right'
      });
    });
  }

  const toastWarningBtn = document.getElementById('toast-warning-btn');
  if (toastWarningBtn) {
    toastWarningBtn.addEventListener('click', () => {
      window.DCSS?.toast?.({
        message: '⚠️ Advertencia: Memoria de caché cercana al 85% de capacidad.',
        type: 'warning',
        position: 'top-left'
      });
    });
  }

  const toastInfoBtn = document.getElementById('toast-info-btn');
  if (toastInfoBtn) {
    toastInfoBtn.addEventListener('click', () => {
      window.DCSS?.toast?.({
        message: 'ℹ️ Información: dcss-ui v0.1.0 (Cobalt Tech + Raycast) cargado con éxito.',
        type: 'info',
        position: 'bottom-left'
      });
    });
  }

  // ==========================================================================
  // 3. Programmatic Modal Creation via DCSS.modal.create(...)
  // ==========================================================================
  const btnModalProg = document.getElementById('btn-modal-programmatic');
  if (btnModalProg) {
    btnModalProg.addEventListener('click', () => {
      if (window.DCSS?.modal?.create) {
        window.DCSS.modal.create({
          title: 'Modal Programático (JS)',
          content: 'Este diálogo modal fue instanciado dinámicamente mediante la API JavaScript DCSS.modal.create({ ... }) sin requerir marcado HTML previo.',
          confirmText: 'Aceptar y Cerrar',
          cancelText: 'Descartar',
          onConfirm: () => {
            window.DCSS?.toast?.success('Acción confirmada desde modal programático.');
          },
          onCancel: () => {
            window.DCSS?.toast?.info('Modal cancelado.');
          }
        });
      }
    });
  }

  // ==========================================================================
  // 4. Code Snippet Copy Functionality with Toast Feedback
  // ==========================================================================
  const copyButtons = document.querySelectorAll('.btn-copy-snippet');
  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const targetSelector = btn.getAttribute('data-copy-target');
      let textToCopy = '';

      if (targetSelector) {
        const targetEl = document.querySelector(targetSelector);
        if (targetEl) {
          textToCopy = targetEl.textContent || '';
        }
      }

      if (!textToCopy) {
        const codeEl = btn.closest('.showcase-code-wrapper')?.querySelector('code');
        if (codeEl) {
          textToCopy = codeEl.textContent || '';
        }
      }

      if (!textToCopy) return;

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(textToCopy);
        } else {
          // Fallback for environments without clipboard API
          const textarea = document.createElement('textarea');
          textarea.value = textToCopy;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);
        }

        // Show Toast Notification
        if (window.DCSS?.toast) {
          window.DCSS.toast({
            message: '¡Snippet copiado al portapapeles!',
            type: 'success',
            position: 'top-right'
          });
        }
      } catch (err) {
        console.error('Error al copiar snippet:', err);
      }
    });
  });

  // ==========================================================================
  // 5. Global ⌘K / Ctrl+K Shortcut to Focus Command Bar
  // ==========================================================================
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      const commandInput = document.getElementById('showcase-command-input');
      if (commandInput) {
        commandInput.focus();
        commandInput.select();
        commandInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        window.DCSS?.toast?.info('Barra de comandos activada (⌘K)');
      }
    }
  });

  // Header Command Bar Search Navigation
  const headerCommandInput = document.getElementById('showcase-command-input');
  if (headerCommandInput) {
    headerCommandInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = headerCommandInput.value.trim().toLowerCase();
        if (!query) return;

        const sectionMap = [
          { keywords: ['raycast', 'kbd', 'tecla', 'split', 'list', 'action'], id: 'raycast' },
          { keywords: ['token', 'color', 'obsidian', 'sombras', 'fuente'], id: 'tokens' },
          { keywords: ['boton', 'button', 'loading'], id: 'buttons' },
          { keywords: ['tarjeta', 'card', 'glass'], id: 'cards' },
          { keywords: ['form', 'input', 'switch', 'check', 'valid'], id: 'forms' },
          { keywords: ['badge', 'chip', 'pill', 'pulse'], id: 'badges' },
          { keywords: ['tabla', 'table'], id: 'tables' },
          { keywords: ['interactivo', 'toast', 'modal', 'dropdown', 'tab', 'drawer'], id: 'interactive' }
        ];

        const match = sectionMap.find((s) => s.keywords.some((k) => query.includes(k)));
        const targetId = match ? match.id : 'raycast';
        const targetSection = document.getElementById(targetId);

        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.DCSS?.toast?.info(`Navegando a #${targetId}`);
        } else {
          window.DCSS?.toast?.warning(`No se encontró sección para "${query}"`);
        }
      }
    });
  }

  // ==========================================================================
  // 6. Interactive Standalone List Items Selection Toggle
  // ==========================================================================
  const standaloneListItems = document.querySelectorAll('#demo-standalone-list .dcss-list-item');
  standaloneListItems.forEach((item) => {
    item.addEventListener('click', () => {
      standaloneListItems.forEach((sibling) => sibling.classList.remove('is-selected'));
      item.classList.add('is-selected');

      const actionName = item.getAttribute('data-action-name') || item.querySelector('.dcss-list-item-title')?.textContent;
      window.DCSS?.toast?.info(`Comando seleccionado: ${actionName}`);
    });
  });

  // ==========================================================================
  // 7. Interactive Split View (Master / Detail & Action Bar)
  // ==========================================================================
  const splitItems = document.querySelectorAll('#split-items-list .dcss-list-item');
  const splitFilterInput = document.getElementById('split-filter-input');
  const splitItemCount = document.getElementById('split-item-count');

  // Detail panel elements
  const detailIcon = document.getElementById('split-detail-icon');
  const detailTitle = document.getElementById('split-detail-title');
  const detailBadge = document.getElementById('split-detail-badge');
  const detailDesc = document.getElementById('split-detail-desc');
  const detailRuntime = document.getElementById('split-detail-runtime');
  const detailStatus = document.getElementById('split-detail-status');
  const detailTarget = document.getElementById('split-detail-target');
  const detailShortcut = document.getElementById('split-detail-shortcut');

  function updateSplitDetail(item) {
    if (!item) return;

    const title = item.getAttribute('data-title') || '';
    const desc = item.getAttribute('data-desc') || '';
    const badgeText = item.getAttribute('data-badge') || '';
    const badgeClass = item.getAttribute('data-badge-class') || 'dcss-badge-primary';
    const icon = item.getAttribute('data-icon') || '⚡';
    const shortcut = item.getAttribute('data-shortcut') || '';
    const runtime = item.getAttribute('data-meta-runtime') || '';
    const status = item.getAttribute('data-meta-status') || '';
    const target = item.getAttribute('data-meta-target') || '';

    if (detailTitle) detailTitle.textContent = title;
    if (detailDesc) detailDesc.textContent = desc;
    if (detailIcon) detailIcon.textContent = icon;

    if (detailBadge) {
      detailBadge.textContent = badgeText;
      detailBadge.className = `dcss-badge ${badgeClass} dcss-badge-pill`;
    }

    if (detailRuntime) detailRuntime.textContent = runtime;
    if (detailStatus) detailStatus.textContent = status;
    if (detailTarget) detailTarget.textContent = target;
    if (detailShortcut) {
      detailShortcut.innerHTML = `<kbd class="dcss-kbd dcss-kbd-sm">${shortcut}</kbd>`;
    }
  }

  splitItems.forEach((item) => {
    item.addEventListener('click', () => {
      splitItems.forEach((sibling) => sibling.classList.remove('is-selected'));
      item.classList.add('is-selected');
      updateSplitDetail(item);
    });
  });

  // Filter input on split view
  if (splitFilterInput) {
    splitFilterInput.addEventListener('input', (e) => {
      const term = e.target.value.toLowerCase().trim();
      let visibleCount = 0;

      splitItems.forEach((item) => {
        const title = (item.getAttribute('data-title') || '').toLowerCase();
        const desc = (item.getAttribute('data-desc') || '').toLowerCase();
        const text = item.textContent.toLowerCase();

        if (title.includes(term) || desc.includes(term) || text.includes(term)) {
          item.style.display = 'flex';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });

      if (splitItemCount) {
        splitItemCount.textContent = `${visibleCount} elemento${visibleCount === 1 ? '' : 's'}`;
      }
    });
  }

  // Split view action bar buttons
  const splitActionRun = document.getElementById('split-action-run');
  if (splitActionRun) {
    splitActionRun.addEventListener('click', (e) => {
      e.preventDefault();
      const currentTitle = detailTitle ? detailTitle.textContent : 'Comando';
      window.DCSS?.toast?.success(`⚡ Ejecutando: ${currentTitle}`);
    });
  }

  const splitActionCopy = document.getElementById('split-action-copy');
  if (splitActionCopy) {
    splitActionCopy.addEventListener('click', async (e) => {
      e.preventDefault();
      const currentTitle = detailTitle ? detailTitle.textContent : 'Comando';
      const info = JSON.stringify({
        title: currentTitle,
        desc: detailDesc?.textContent || '',
        runtime: detailRuntime?.textContent || '',
        status: detailStatus?.textContent || '',
        target: detailTarget?.textContent || ''
      }, null, 2);

      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(info);
        }
        window.DCSS?.toast?.info('Detalles de comando copiados al portapapeles');
      } catch (err) {
        console.error(err);
      }
    });
  }

  // ==========================================================================
  // 8. Drawer links close drawer on mobile navigation
  // ==========================================================================
  const drawerLinks = document.querySelectorAll('#main-drawer a[href^="#"]');
  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const drawerEl = document.getElementById('main-drawer');
      if (drawerEl && window.DCSS?.drawer?.close) {
        window.DCSS.drawer.close(drawerEl);
      }
    });
  });

  // ==========================================================================
  // 9. Multi-Palette Switcher Reactive Sync
  // ==========================================================================
  const paletteNames = {
    ruby: { name: 'Ruby', hex: '#FF6363', desc: 'Raycast macOS Original' },
    monochrome: { name: 'Monochrome', hex: '#EDEDED', desc: 'Vercel Geist / Rams' },
    amber: { name: 'Amber', hex: '#FF7D3C', desc: 'Arc Browser Sunset' },
    emerald: { name: 'Emerald', hex: '#3ECF8E', desc: 'Supabase Terminal' },
    amethyst: { name: 'Amethyst', hex: '#5E6AD2', desc: 'Linear.app Titanium' },
    cobalt: { name: 'Cobalt', hex: '#3B82F6', desc: 'Tech Clásico' }
  };

  function updatePaletteUI(accent) {
    const meta = paletteNames[accent] || paletteNames.ruby;

    // Header label
    const headerLabel = document.getElementById('current-palette-label');
    if (headerLabel) headerLabel.textContent = meta.name;

    // Hero badge
    const heroBadge = document.getElementById('hero-palette-badge');
    if (heroBadge) heroBadge.textContent = `Paleta: ${meta.name} (${meta.hex})`;

    // Swatch text
    const swatchVal = document.getElementById('swatch-primary-val');
    if (swatchVal) swatchVal.textContent = meta.hex;

    // Pill buttons in hero
    document.querySelectorAll('.palette-btn').forEach((btn) => {
      const target = btn.getAttribute('data-dcss-accent-set');
      if (target === accent) {
        btn.classList.add('dcss-btn-primary');
        btn.classList.remove('dcss-btn-ghost');
      } else {
        btn.classList.remove('dcss-btn-primary');
        btn.classList.add('dcss-btn-ghost');
      }
    });

    // Cards in showcase #palettes
    document.querySelectorAll('.palette-card').forEach((card) => {
      const p = card.getAttribute('data-palette');
      const ind = card.querySelector(`[data-palette-indicator="${p}"]`);
      if (p === accent) {
        card.style.borderColor = 'var(--dcss-primary)';
        card.style.boxShadow = 'var(--dcss-shadow-glow)';
        if (ind) {
          ind.style.display = 'inline-block';
          ind.className = 'dcss-badge dcss-badge-primary dcss-badge-pill';
        }
      } else {
        card.style.borderColor = 'var(--dcss-border-default)';
        card.style.boxShadow = 'none';
        if (ind) ind.style.display = 'none';
      }
    });
  }

  // Listen to accent changes with deduplication
  let lastNotifiedAccent = null;
  let lastNotifiedTime = 0;

  window.addEventListener('dcss:accent-change', (e) => {
    const accent = e.detail?.accent;
    if (!accent) return;

    updatePaletteUI(accent);

    const now = Date.now();
    // Only notify if accent changed or if more than 500ms passed
    if (accent !== lastNotifiedAccent || (now - lastNotifiedTime > 500)) {
      lastNotifiedAccent = accent;
      lastNotifiedTime = now;
      const meta = paletteNames[accent] || paletteNames.ruby;
      window.DCSS?.toast?.info(`🎨 Paleta activada: ${meta.name} (${meta.hex})`);
    }
  });

  // Clicking anywhere on a .palette-card switches the palette
  document.querySelectorAll('.palette-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('button')) return; // let button handler run
      const p = card.getAttribute('data-palette');
      if (p && window.DCSS?.theme?.setAccent) {
        window.DCSS.theme.setAccent(p);
      }
    });
  });

  // Initial UI sync
  const currentInitialAccent = window.DCSS?.theme?.getAccent ? window.DCSS.theme.getAccent() : 'ruby';
  updatePaletteUI(currentInitialAccent);
});

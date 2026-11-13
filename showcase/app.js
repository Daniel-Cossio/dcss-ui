/**
 * dcss-ui — Showcase Interactive Application Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Interactive Button Loading Simulation (1.5 seconds)
  const btnLoading = document.getElementById('btn-demo-loading');
  if (btnLoading) {
    btnLoading.addEventListener('click', (e) => {
      e.preventDefault();
      if (btnLoading.classList.contains('dcss-btn-loading')) return;

      const originalText = btnLoading.querySelector('.dcss-btn-text')?.textContent || btnLoading.textContent;
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

  // 2. Toast Demonstration Triggers
  const toastSuccessBtn = document.getElementById('toast-success-btn');
  if (toastSuccessBtn) {
    toastSuccessBtn.addEventListener('click', () => {
      window.DCSS?.toast({
        message: '¡Operación guardada correctamente en el sistema!',
        type: 'success',
        position: 'top-right'
      });
    });
  }

  const toastDangerBtn = document.getElementById('toast-danger-btn');
  if (toastDangerBtn) {
    toastDangerBtn.addEventListener('click', () => {
      window.DCSS?.toast({
        message: '✕ Error 500: Fallo en la comunicación con el servidor.',
        type: 'danger',
        position: 'bottom-right'
      });
    });
  }

  const toastWarningBtn = document.getElementById('toast-warning-btn');
  if (toastWarningBtn) {
    toastWarningBtn.addEventListener('click', () => {
      window.DCSS?.toast({
        message: '⚠️ Advertencia: Memoria de caché cercana al 85% de capacidad.',
        type: 'warning',
        position: 'top-left'
      });
    });
  }

  const toastInfoBtn = document.getElementById('toast-info-btn');
  if (toastInfoBtn) {
    toastInfoBtn.addEventListener('click', () => {
      window.DCSS?.toast({
        message: 'ℹ️ Información: dcss-ui v1.0.0 cargado con éxito.',
        type: 'info',
        position: 'bottom-left'
      });
    });
  }

  // 3. Programmatic Modal Creation via DCSS.modal.create(...)
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

  // 4. Code Snippet Copy Functionality
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

  // 5. Drawer links close drawer on mobile navigation
  const drawerLinks = document.querySelectorAll('#main-drawer a[href^="#"]');
  drawerLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const drawerEl = document.getElementById('main-drawer');
      if (drawerEl && window.DCSS?.drawer?.close) {
        window.DCSS.drawer.close(drawerEl);
      }
    });
  });
});

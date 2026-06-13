/* ============================================
   SERTIFIKAT MODAL POPUP
   ============================================ */
export function initSertifikatModal() {
  const modal = document.getElementById('certModal');
  if (!modal) return;

  const iframe = document.getElementById('certModalIframe');
  const openBtn = document.getElementById('certModalOpen');
  const titleEl = document.getElementById('certModalTitle');
  const closeBtn = document.getElementById('certModalClose');
  const popupBox = modal.querySelector('.cert-modal-box');

  function openModal(url, title) {
    const fallback = document.getElementById('certModalOfflineFallback');
    
    if (!navigator.onLine) {
      if (iframe) iframe.style.display = 'none';
      if (!fallback) {
        const div = document.createElement('div');
        div.id = 'certModalOfflineFallback';
        div.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;height:55vh;padding:30px;text-align:center;background:rgba(0,0,0,0.02);border:2px dashed #DEE2E8;border-radius:8px;font-family:sans-serif;';
        div.innerHTML = '<i class="fa-solid fa-wifi-slash" style="font-size:2.5rem;color:#98A2B3;margin-bottom:16px;"></i><h4 style="margin-bottom:8px;color:#344054;font-weight:600;">Koneksi Offline</h4><p style="margin-bottom:0;color:#667085;max-width:400px;font-size:0.9rem;line-height:1.4;">Dokumen sertifikat ini bersumber dari Google Drive dan membutuhkan koneksi internet untuk ditampilkan. Silakan hubungkan ke internet.</p>';
        if (iframe && iframe.parentNode) {
          iframe.parentNode.insertBefore(div, iframe.nextSibling);
        }
      } else {
        fallback.style.display = 'flex';
      }
    } else {
      if (iframe) {
        iframe.style.display = 'block';
        iframe.src = url;
      }
      if (fallback) fallback.style.display = 'none';
    }

    openBtn.href = url.replace('/preview', '/view');
    if (titleEl && title) titleEl.textContent = title;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
 
    if (typeof gsap !== 'undefined') {
      gsap.fromTo(modal, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
      gsap.fromTo(popupBox,
        { scale: 0.85, opacity: 0, y: 18 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.5)', clearProps: 'transform' }
      );
    }
  }
 
  function closeModal() {
    const fallback = document.getElementById('certModalOfflineFallback');
    if (fallback) fallback.style.display = 'none';

    if (typeof gsap !== 'undefined') {
      gsap.to(popupBox, { scale: 0.9, opacity: 0, y: 20, duration: 0.2, ease: 'power2.in' });
      gsap.to(modal, {
        opacity: 0, duration: 0.25, ease: 'power2.in',
        onComplete: () => {
          modal.style.display = 'none';
          if (iframe) {
            iframe.src = '';
            iframe.style.display = 'block';
          }
          document.body.style.overflow = '';
        }
      });
    } else {
      modal.style.display = 'none';
      if (iframe) {
        iframe.src = '';
        iframe.style.display = 'block';
      }
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('.cert-btn[data-cert-url]').forEach(btn => {
    btn.addEventListener('click', () => {
      const url = btn.getAttribute('data-cert-url');
      const card = btn.closest('.cert-card');
      const title = card ? card.querySelector('h4').textContent : 'Sertifikat';
      openModal(url, title);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') closeModal();
  });
}

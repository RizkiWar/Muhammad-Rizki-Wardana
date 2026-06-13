/* ============================================
   PARALLAX SCROLL
   Lightweight, accessibility-aware parallax effects.
   ============================================ */
(function () {
  const maxOffset = window.innerWidth < 768 ? 18 : 42;
  const parallaxLayers = Array.from(document.querySelectorAll('.parallax-layer'));
  const imageLayers = Array.from(document.querySelectorAll('.parallax-image-frame img'));

  const autoCards = [
    ...Array.from(document.querySelectorAll('.portfolio-card')).slice(0, 6),
    ...Array.from(document.querySelectorAll('.timeline-card')).slice(0, 3),
    ...Array.from(document.querySelectorAll('.pillar-card')).slice(0, 4),
  ];

  autoCards.forEach((card, index) => {
    card.classList.add('parallax-card');
    card.dataset.parallaxSpeed = index % 2 === 0 ? '0.035' : '-0.025';
  });

  const parallaxCards = Array.from(document.querySelectorAll('.parallax-card'));
  const floatTargets = Array.from(document.querySelectorAll('.parallax-float'));

  let ticking = false;

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function getProgress(rect) {
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const midpoint = rect.top + rect.height / 2;
    const viewportMidpoint = viewportHeight / 2;
    return (viewportMidpoint - midpoint) / viewportHeight;
  }

  function setLayerOffset(el, speedMultiplier) {
    const rect = el.getBoundingClientRect();
    if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;

    const speed = Number(el.dataset.parallaxSpeed || speedMultiplier || 0.05);
    const offset = clamp(getProgress(rect) * speed * 360, -maxOffset, maxOffset);
    el.style.setProperty('--parallax-y', offset.toFixed(2) + 'px');
  }

  function updateParallax() {
    ticking = false;

    parallaxLayers.forEach((el) => setLayerOffset(el, 0.05));
    parallaxCards.forEach((el) => setLayerOffset(el, 0.03));

    imageLayers.forEach((img) => {
      const frame = img.closest('.parallax-image-frame');
      if (!frame) return;
      const rect = frame.getBoundingClientRect();
      if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;

      const offset = clamp(getProgress(rect) * -36, -28, 28);
      img.style.setProperty('--parallax-y', offset.toFixed(2) + 'px');
    });

    floatTargets.forEach((el) => {
      const rect = el.getBoundingClientRect();
      const tilt = clamp(getProgress(rect) * -3, -2.5, 2.5);
      el.style.setProperty('--parallax-tilt', tilt.toFixed(2) + 'deg');
    });
  }

  function requestTick() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(updateParallax);
  }

  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick, { passive: true });
  window.addEventListener('load', requestTick, { passive: true });
  requestTick();
})();

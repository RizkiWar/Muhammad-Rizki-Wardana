/* ============================================
   PORTFOLIO CHOOSER SCREEN
   Show 2 portfolio options after intro loading
   ============================================ */
export function initPortfolioChooser() {
  const chooser = document.getElementById('portfolioChooser');
  const introTear = document.getElementById('introTear');
  if (!chooser) return;

  const STORAGE_KEY = 'selectedPortfolio';
  const cards = chooser.querySelectorAll('.chooser-card');
  const prefersReducedMotion = false;
  const ep2Wrapper = document.getElementById('eportfolio2Wrapper');

  // Auto-unlock UAS chooser starting 27 May 2026.
  // Pakai server time dari HTTP Date header agar tidak bisa diakali
  // dengan ubah jam PC. Fallback ke client time hanya kalau request gagal.
  (function maybeAutoUnlockEp2() {
    const UNLOCK_AT = Date.UTC(2026, 4, 26, 17, 0, 0); // 27 Mei 00:00 WIB (UTC+7)

    const ep2Card = chooser.querySelector('.chooser-card[data-portfolio="2"]');
    if (!ep2Card) return;

    function applyUnlock() {
      ep2Card.classList.remove('is-locked');
      ep2Card.removeAttribute('aria-disabled');
      delete ep2Card.dataset.locked;
      const lockBadge = ep2Card.querySelector('.chooser-card-lock');
      if (lockBadge) lockBadge.remove();
      const cta = ep2Card.querySelector('.chooser-card-cta');
      if (cta) cta.textContent = 'Lihat E-Portfolio 2 →';
    }

    function checkUnlock(nowMs) {
      if (nowMs >= UNLOCK_AT) applyUnlock();
    }

    // Get trusted server time via HTTP Date header
    fetch(window.location.href, { method: 'HEAD', cache: 'no-store' })
      .then(res => {
        const dateHeader = res.headers.get('date');
        if (!dateHeader) throw new Error('no date header');
        const serverMs = new Date(dateHeader).getTime();
        if (!Number.isFinite(serverMs)) throw new Error('invalid date');
        checkUnlock(serverMs);
      })
      .catch(() => {
        // Network gagal: fallback ke client clock (best-effort)
        checkUnlock(Date.now());
      });
  })();

  function showChooser() {
    chooser.classList.add('active');
    chooser.setAttribute('aria-hidden', 'false');
    chooser.style.opacity = '1';
    chooser.style.display = 'flex';
    chooser.style.visibility = 'visible';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';
    document.body.style.position = 'fixed';
    document.body.style.width = '100%';
    document.body.style.top = '0';
    document.body.classList.add('chooser-active');

    setTimeout(() => {
      if (chooser.classList.contains('active')) {
        chooser.style.display = 'flex';
        chooser.style.opacity = '1';
        chooser.style.visibility = 'visible';
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
      }
    }, 300);

    if (typeof gsap !== 'undefined' && window.innerWidth > 768) {
      gsap.from('.chooser-content > *', {
        opacity: 0, y: 12, duration: 0.25, stagger: 0.03, ease: 'power2.out', delay: 0
      });
    }
  }

  function hideChooser() {
    chooser.classList.remove('active');
    chooser.setAttribute('aria-hidden', 'true');
    chooser.style.display = 'none';
    chooser.style.visibility = 'hidden';
    document.body.style.overflow = '';
    document.body.style.height = '';
    document.body.style.position = '';
    document.body.style.width = '';
    document.body.style.top = '';
    document.body.classList.remove('chooser-active');
  }

  function showEP2() {
    if (!ep2Wrapper) return;
    // Hide all E-Portfolio 1 sections
    document.querySelectorAll('body > section, body > footer, .floating-shapes, .scroll-progress, #navbar, .back-to-top, .scroll-rail').forEach(el => {
      el.style.display = 'none';
    });
    // Show E-Portfolio 2
    ep2Wrapper.style.display = 'block';
    document.body.style.overflow = '';
    document.body.style.position = '';
    window.scrollTo({ top: 0, behavior: 'auto' });

    // Trigger reveal animations + refresh GSAP ScrollTrigger
    setTimeout(() => {
      ep2Wrapper.querySelectorAll('.reveal').forEach(el => {
        el.classList.add('visible');
      });
      if (typeof window.refreshEp2Animation === 'function') {
        window.refreshEp2Animation();
      }
    }, 0);
  }

  function hideEP2() {
    if (!ep2Wrapper) return;
    ep2Wrapper.style.display = 'none';
    // Restore E-Portfolio 1 sections
    document.querySelectorAll('body > section, body > footer, .floating-shapes, .scroll-progress, #navbar, .back-to-top, .scroll-rail').forEach(el => {
      el.style.display = '';
    });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function selectPortfolio(num) {
    document.body.setAttribute('data-portfolio', num);

    if (num === '2') {
      hideChooser();
      showEP2();
    } else {
      hideChooser();
    }
  }

  cards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (card.dataset.locked === 'true' || card.classList.contains('is-locked')) {
        e.preventDefault();
        e.stopPropagation();
        card.classList.remove('shake');
        void card.offsetWidth;
        card.classList.add('shake');
        return;
      }
      const num = card.getAttribute('data-portfolio');
      selectPortfolio(num);
    });
  });

  // EP1 home button & footer switch -> back to chooser
  var ep1BackTriggers = document.querySelectorAll('#homeBtn, #ep1FooterBack');
  ep1BackTriggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'auto' });
      showChooser();
    });
  });

  // EP2 back buttons
  if (ep2Wrapper) {
    var backBtns = ep2Wrapper.querySelectorAll('#ep2BackBtn, #ep2BackChooser, #ep2FooterBack');
    backBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        hideEP2();
        showChooser();
      });
    });
  }

  function introAnimationCompleted() {
    if (!introTear) return true;
    if (window.location.hash) return document.body.classList.contains('intro-opened');
    if (prefersReducedMotion) return document.body.classList.contains('intro-opened');
    return introTear.classList.contains('is-opening') && introTear.classList.contains('is-complete');
  }

  function tryShowChooser() {
    if (introAnimationCompleted()) {
      handleInitialHash() || showChooser();
    } else {
      const observer = new MutationObserver(() => {
        if (introAnimationCompleted()) {
          observer.disconnect();
          handleInitialHash() || showChooser();
        }
      });
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

      if (introTear) {
        observer.observe(introTear, { attributes: true, attributeFilter: ['class'] });
      }
    }
  }

  function handleInitialHash() {
    const hash = window.location.hash;
    if (!hash || hash.length < 2) return false;

    const ep2Card = chooser.querySelector('.chooser-card[data-portfolio="2"]');
    const ep2Locked = ep2Card && (ep2Card.classList.contains('is-locked') || ep2Card.dataset.locked === 'true');
    const isEp2Hash = hash.startsWith('#ep2-');

    // EP2 hash but card is locked: ignore deep link, show chooser instead
    if (isEp2Hash && ep2Locked) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
      return false;
    }

    if (isEp2Hash) {
      hideChooser();
      showEP2();
    } else {
      hideChooser();
    }

    setTimeout(() => {
      const target = document.querySelector(hash);
      if (target && typeof target.scrollIntoView === 'function') {
        target.scrollIntoView({ behavior: 'auto', block: 'start' });
      }
    }, 60);

    return true;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryShowChooser);
  } else {
    tryShowChooser();
  }
}



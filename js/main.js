/* ============================================
   E-PORTFOLIO — MAIN JS
   Core interactions, nav, theme, scroll reveal
   ============================================ */

import './gsap-init.js';
import '../css/index.css';
import './particles.js';
import './scroll-experience.js';
import './section-transitions.js';
import './artefak.js';
import { initProfilAnimation } from './profil-animation.js';
import { initPendidikanAnimation } from './pendidikan-animation.js';
import { initArtefakAnimation } from './artefak-animation.js';
import { initAnalisisAnimation } from './analisis-animation.js';
import { initModelGuruAnimation } from './model-guru-animation.js';
import { initKeahlianAnimation } from './keahlian-animation.js';
import { initGaleriAnimation } from './galeri-animation.js';
import { initKontakAnimation } from './kontak-animation.js';
import { initFooterAnimation } from './footer-animation.js';
import { initPortfolioChooser } from './portfolio-chooser.js';
import { initSertifikatModal } from './sertifikat-modal.js';
import { refreshEp2Animation } from './eportfolio2-animation.js';

window.refreshEp2Animation = refreshEp2Animation;

let mainInitialized = false;

function waitForWindowLoad() {
  if (document.readyState === 'complete') return Promise.resolve();
  return new Promise(resolve => window.addEventListener('load', resolve, { once: true }));
}

function preloadPageContent() {
  const loadingFill = document.querySelector('.intro-panel-loading-fill');
  const loadingStatus = document.getElementById('introLoadingStatus');
  const images = Array.from(document.images);
  const tasks = [];
  let completed = 0;

  const statusSteps = [
    { at: 0, text: 'Menyiapkan tampilan awal...' },
    { at: 18, text: 'Memuat gambar dan thumbnail...' },
    { at: 42, text: 'Menyiapkan animasi halaman...' },
    { at: 66, text: 'Merapikan dokumen dan preview...' },
    { at: 88, text: 'Hampir selesai...' },
    { at: 100, text: 'Siap dibuka.' }
  ];
  let currentStatus = '';

  const setLoadingStatus = percent => {
    if (!loadingStatus) return;
    const next = statusSteps.reduce((active, step) => (percent >= step.at ? step : active), statusSteps[0]).text;
    if (next === currentStatus) return;
    currentStatus = next;
    loadingStatus.classList.add('is-changing');
    setTimeout(() => {
      loadingStatus.textContent = next;
      loadingStatus.classList.remove('is-changing');
    }, 120);
  };

  setLoadingStatus(0);

  const updateProgress = () => {
    completed += 1;
    const total = Math.max(tasks.length, 1);
    const percent = Math.min(100, Math.round((completed / total) * 100));
    if (loadingFill) loadingFill.style.width = percent + '%';
    setLoadingStatus(percent);
  };

  images.forEach(img => {
    if (img.dataset && img.dataset.src && !img.src) img.src = img.dataset.src;
    img.loading = 'eager';

    if (img.complete && img.naturalWidth > 0) {
      tasks.push(Promise.resolve().then(updateProgress));
      return;
    }

    const imageTask = new Promise(resolve => {
      const done = () => resolve();
      img.addEventListener('load', done, { once: true });
      img.addEventListener('error', done, { once: true });
    }).then(() => (img.decode ? img.decode().catch(() => {}) : undefined)).then(updateProgress);

    tasks.push(imageTask);
  });

  if (document.fonts && document.fonts.ready) {
    tasks.push(document.fonts.ready.catch(() => {}).then(updateProgress));
  }

  tasks.push(waitForWindowLoad().then(updateProgress));

  return Promise.race([
    Promise.allSettled(tasks),
    new Promise(resolve => setTimeout(resolve, 15000))
  ]).then(() => {
    if (loadingFill) loadingFill.style.width = '100%';
    setLoadingStatus(100);
  });
}

function initMain() {
  if (mainInitialized) return;
  mainInitialized = true;

  // ---------- Loading Screen ----------
  const loadingScreen = document.getElementById('loadingScreen');
  const preloadReady = preloadPageContent();

  const hideLoadingScreen = () => {
    if (!loadingScreen) return;
    loadingScreen.classList.add('hidden');
    loadingScreen.setAttribute('aria-hidden', 'true');
  };

  if (loadingScreen) {
    const minLoadingTime = 800;
    const startedAt = performance.now();

    preloadReady.then(() => {
      const elapsed = performance.now() - startedAt;
      setTimeout(hideLoadingScreen, Math.max(0, minLoadingTime - elapsed));
    });
  }

  // ---------- Intro Screen (Two-Phase) ----------
  const introTear = document.getElementById('introTear');
  let introOpened = false;

  const completeIntro = () => {
    if (!introTear) return;
    introTear.classList.add('is-complete');
    document.body.classList.add('intro-ready', 'intro-opened');
  };

  if (introTear) {
    // Phase 1: Loading bar runs via CSS animation (~1.5s)
    // After page load, transition to Phase 2: "Scroll to view"
    try { window.history.scrollRestoration = 'manual'; } catch (_) {}
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

    const minLoaderTime = 800;
    const maxLoaderTime = 15000;
    const startedAt = performance.now();
    let loaderDone = false;

    const showPrompt = () => {
      if (loaderDone) return;
      loaderDone = true;
      const elapsed = performance.now() - startedAt;
      const delay = Math.max(0, minLoaderTime - elapsed);
      setTimeout(() => {
        introTear.classList.add('loader-complete');
        // Phase 2: Wait for user interaction to open
        addIntroListeners();
      }, delay);
    };

    preloadReady.then(showPrompt);
    setTimeout(showPrompt, maxLoaderTime);

    // Phase 2: Listen for scroll/touch/keyboard to open the intro
    const openKeys = new Set(['ArrowDown', 'PageDown', ' ', 'Spacebar', 'Enter']);

    const openIntro = () => {
      if (introOpened || !introTear.classList.contains('loader-complete')) return;
      introOpened = true;
      removeIntroListeners();
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

      // Tear-open animation
      introTear.classList.add('is-opening');
      setTimeout(completeIntro, 600);
    };

    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= 1) return;
      e.preventDefault();
      openIntro();
    };
    const onTouch = () => openIntro();
    const onKey = (e) => {
      if (!openKeys.has(e.key)) return;
      e.preventDefault();
      openIntro();
    };
    let scrollListenerReady = false;
    setTimeout(() => { scrollListenerReady = true; }, 800);
    const onScroll = () => { if (scrollListenerReady && window.scrollY > 2) openIntro(); };

    function addIntroListeners() {
      if (introOpened) return;
      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('touchstart', onTouch, { passive: true });
      window.addEventListener('keydown', onKey);
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    function removeIntroListeners() {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouch);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('scroll', onScroll);
    }
  } else {
    // No intro needed (hash in URL or no introTear element)
    if (introTear) completeIntro();
    document.body.classList.add('intro-ready');
  }

  // ---------- Scroll Progress Bar ----------
  const scrollProgress = document.getElementById('scrollProgress');
  let scrollTicking = false;
  function updateScrollProgress() {
    if (!scrollProgress) return;
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';
    scrollTicking = false;
  }
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      requestAnimationFrame(updateScrollProgress);
      scrollTicking = true;
    }
  }, { passive: true });

  // ---------- Typed Text Effect ----------
  const typedTextEl = document.getElementById('typedText');
  const phrases = [
    'Calon Guru Profesional Teknik Pemesinan',
    'Pendidik yang Adaptif dan Inovatif',
    'Fasilitator Pembelajaran Berbasis Praktik',
    'Pengembang Keterampilan Industri'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 80;

  function typeEffect() {
    const current = phrases[phraseIdx];

    if (isDeleting) {
      typedTextEl.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 40;
    } else {
      typedTextEl.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 80;
    }

    if (!isDeleting && charIdx === current.length) {
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  if (typedTextEl) typeEffect();

  // ---------- Navbar Scroll ----------
  const navbar = document.getElementById('navbar');

  let navScrollTicking = false;
  function handleNavScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    navScrollTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!navScrollTicking) {
      requestAnimationFrame(handleNavScroll);
      navScrollTicking = true;
    }
  }, { passive: true });

  // ---------- Active Nav Link ----------
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');
  let lastSyncedHash = '';

  function highlightNav() {
    // Trigger highlight when section reaches the upper third of the screen
    const scrollPos = window.scrollY + (window.innerHeight / 3);
    let activeId = '';

    sections.forEach(sec => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      const id = sec.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        activeId = id;
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });

    // Sync URL hash with active section without scrolling
    if (activeId && window.scrollY > 80) {
      const nextHash = `#${activeId}`;
      if (nextHash !== lastSyncedHash && nextHash !== window.location.hash) {
        history.replaceState(null, '', nextHash);
        lastSyncedHash = nextHash;
      }
    } else if (!activeId && window.scrollY < 80 && window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
      lastSyncedHash = '';
    }
  }

  let highlightTicking = false;
  window.addEventListener('scroll', () => {
    if (!highlightTicking) {
      requestAnimationFrame(() => { highlightNav(); highlightTicking = false; });
      highlightTicking = true;
    }
  }, { passive: true });

  // ---------- Hamburger ----------
  const hamburger = document.getElementById('hamburger');
  const navLinksEl = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksEl.classList.toggle('open');
  });

  navLinksEl.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinksEl.classList.remove('open');
    });
  });

  // ---------- Dark / Light Mode Toggle ----------
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
  themeIcon.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    if (current === 'dark') {
      document.documentElement.setAttribute('data-theme', 'light');
      themeIcon.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      themeIcon.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    }
  });

  // ---------- Performance Mode Toggle ----------
  (function setupPerfToggle(){
    const perfButtons = document.querySelectorAll('#perfToggle, #ep2PerfToggle');
    if (!perfButtons.length) return;
    const html = document.documentElement;
    const overlay = document.getElementById('perfInfoOverlay');
    const overlayEnable = document.getElementById('perfInfoEnable');
    const overlayLater = document.getElementById('perfInfoLater');
    const toast = document.getElementById('perfToast');
    const toastText = toast ? toast.querySelector('.perf-toast-text') : null;
    let toastTimer = null;

    const apply = () => {
      const on = html.classList.contains('perf-mode');
      perfButtons.forEach(btn => {
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        btn.title = on ? 'Performance Mode: AKTIF (klik untuk matikan)' : 'Performance Mode: NONAKTIF (klik untuk aktifkan)';
      });
    };
    apply();

    function showToast(message){
      if (!toast) return;
      if (toastText) toastText.textContent = message;
      toast.classList.add('show');
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
    }

    function setMode(next, opts){
      const silent = opts && opts.silent;
      html.classList.toggle('perf-mode', next);
      localStorage.setItem('perfMode', next ? '1' : '0');
      if (next) {
        const ep2Canvas = document.getElementById('ep2ParticleCanvas');
        if (ep2Canvas) ep2Canvas.remove();
        const wrapper = document.getElementById('eportfolio2Wrapper');
        if (wrapper) delete wrapper.dataset.particlesBound;
      }
      apply();
      if (!silent) showToast(next ? '⚡ Performance Mode aktif' : 'Performance Mode dimatikan');
    }

    function openInfo(){
      if (!overlay) return false;
      overlay.classList.add('active');
      return true;
    }
    function closeInfo(){
      if (overlay) overlay.classList.remove('active');
    }

    if (overlayEnable) overlayEnable.addEventListener('click', () => { setMode(true); closeInfo(); });
    if (overlayLater) overlayLater.addEventListener('click', () => {
      localStorage.setItem('perfInfoSeen', '1');
      closeInfo();
    });
    if (overlay) overlay.addEventListener('click', (e) => { if (e.target === overlay) closeInfo(); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) closeInfo();
    });

    perfButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const seen = localStorage.getItem('perfInfoSeen') === '1';
        const isOn = html.classList.contains('perf-mode');
        if (!seen && !isOn) {
          if (openInfo()) {
            localStorage.setItem('perfInfoSeen', '1');
            return;
          }
        }
        setMode(!isOn);
      });
    });
  })();

  // ---------- Hero Background Parallax ----------
  const heroSection = document.querySelector('#hero.hero.section');
  const reducedMotionQuery = { matches: false };

  if (heroSection && !reducedMotionQuery.matches) {
    const getShift = () => (window.innerWidth < 768 ? -34 : -96);

    if (window.gsap && window.ScrollTrigger) {
      window.gsap.registerPlugin(window.ScrollTrigger);
      window.gsap.to(heroSection, {
        '--hero-scroll-shift': () => `${getShift()}px`,
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.8,
          invalidateOnRefresh: true
        }
      });
    } else {
      let ticking = false;
      const updateHeroParallax = () => {
        const progress = Math.min(1, Math.max(0, -heroSection.getBoundingClientRect().top / Math.max(heroSection.offsetHeight, 1)));
        heroSection.style.setProperty('--hero-scroll-shift', `${Math.round(progress * getShift())}px`);
        ticking = false;
      };
      const requestHeroParallax = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(updateHeroParallax);
      };
      updateHeroParallax();
      window.addEventListener('scroll', requestHeroParallax, { passive: true });
      window.addEventListener('resize', requestHeroParallax, { passive: true });
    }
  }

  // ---------- Scroll Reveal ----------
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0,
    rootMargin: '0px 0px 10% 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- Skill Bar Animation ----------
  const skillBars = document.querySelectorAll('.bar-fill');

  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('data-width');
        entry.target.style.width = width + '%';
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(bar => skillObserver.observe(bar));

  // ---------- Portfolio Filter ----------
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  const portfolioGridWrapper = document.getElementById('portfolioGridWrapper');
  const portfolioGridInner = document.getElementById('portfolioGridInner');

  function getActiveSiklus() {
    const activeTab = document.querySelector('.tab-btn.active');
    return activeTab ? activeTab.getAttribute('data-tab') : 'all';
  }

  function getActiveFilter() {
    const activeFilter = document.querySelector('.filter-btn.active');
    return activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
  }

  function applyFilters(siklus, filter) {
    portfolioCards.forEach(card => {
      const cardSiklus = card.getAttribute('data-siklus') || 'siklus1';
      const cardCategory = card.getAttribute('data-category');
      const matchesSiklus = (siklus === 'all' || cardSiklus === siklus);
      const matchesFilter = (filter === 'all' || cardCategory === filter);
      if (matchesSiklus && matchesFilter) {
        card.style.display = '';
        card.style.animation = 'fadeIn 0.5s ease forwards';
      } else {
        card.style.display = 'none';
      }
    });
    if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
      requestAnimationFrame(() => window.ScrollTrigger.refresh());
    }
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isActive = btn.classList.contains('active');
      
      filterBtns.forEach(b => b.classList.remove('active'));

      if (isActive) {
        // Toggle off (Collapse everything with animation)
        if (portfolioGridWrapper && portfolioGridInner) {
          portfolioGridWrapper.style.gridTemplateRows = '0fr';
          portfolioGridInner.style.opacity = '0';
          portfolioGridInner.style.marginTop = '-20px';
        } else {
          portfolioCards.forEach(card => card.style.display = 'none');
        }
      } else {
        // Toggle on (Expand with animation)
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        applyFilters(getActiveSiklus(), filter);

        // Buka wrapper dengan animasi
        if (portfolioGridWrapper && portfolioGridInner) {
          portfolioGridWrapper.style.gridTemplateRows = '1fr';
          portfolioGridInner.style.opacity = '1';
          portfolioGridInner.style.marginTop = '0';
        }
      }
    });
  });

  // ---------- Back to Top ----------
  const backToTop = document.getElementById('backToTop');

  let bttTicking = false;
  window.addEventListener('scroll', () => {
    if (!bttTicking) {
      requestAnimationFrame(() => {
        if (window.scrollY > 500) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
        bttTicking = false;
      });
      bttTicking = true;
    }
  }, { passive: true });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---------- Contact Form (Formspree AJAX) ----------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formSuccess = document.getElementById('formSuccess');
      const btn = contactForm.querySelector('.form-submit');
      const originalText = btn.textContent;

      btn.textContent = '⏳ Mengirim...';
      btn.disabled = true;

      try {
        const formData = new FormData(contactForm);
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          btn.style.display = 'none';
          if (formSuccess) formSuccess.style.display = 'block';
          contactForm.reset();
          setTimeout(() => {
            btn.style.display = '';
            btn.textContent = originalText;
            btn.disabled = false;
            if (formSuccess) formSuccess.style.display = 'none';
          }, 4000);
        } else {
          const data = await response.json().catch(() => ({}));
          const errMsg = data.errors ? data.errors.map(e => e.message).join(', ') : 'Gagal mengirim pesan. Coba lagi.';
          btn.textContent = '❌ ' + errMsg;
          btn.disabled = false;
          setTimeout(() => {
            btn.textContent = originalText;
          }, 4000);
        }
      } catch (err) {
        btn.textContent = '❌ Koneksi gagal. Coba lagi.';
        btn.disabled = false;
        setTimeout(() => {
          btn.textContent = originalText;
        }, 4000);
      }
    });
  }

  // ---------- Smooth anchor scrolling ----------
  const prefersReducedMotion = false;

  function getAnchorScrollOffset() {
    if (!navbar) return 0;
    const wasScrolled = navbar.classList.contains('scrolled');
    if (!wasScrolled) navbar.classList.add('scrolled');
    const navHeight = navbar.getBoundingClientRect().height;
    if (!wasScrolled) navbar.classList.remove('scrolled');
    return Math.ceil(navHeight - 10);
  }

  function scrollToAnchor(target) {
    const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
    const scrollTop = Math.max(0, targetTop - getAnchorScrollOffset());

    window.scrollTo({
      top: scrollTop,
      behavior: prefersReducedMotion ? 'auto' : 'smooth'
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (!href || href === '#') {
        e.preventDefault();
        return;
      }

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        scrollToAnchor(target);
        hamburger.classList.remove('active');
        navLinksEl.classList.remove('open');
      }
    });
  });

  // ---------- Count-up Animation ----------
  const statNumbers = document.querySelectorAll('.about-stat .number');

  function countUp(el, target, suffix) {
    let current = 0;
    const increment = target / 60;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, 16);
  }

  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const text = entry.target.textContent;
        const num = parseInt(text);
        if (isNaN(num)) return;
        const suffix = text.includes('+') ? '+' : '';
        countUp(entry.target, num, suffix);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => countObserver.observe(el));

  // ---------- Portfolio Siklus Tabs ----------
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.getAttribute('data-tab');
      applyFilters(tab, getActiveFilter());
      filterHasilSiswa(tab);
    });
  });

  // ---------- Konten Tabs (Artefak / Hasil Siswa) ----------
  const kontenTabs = document.querySelectorAll('.konten-tab-btn');
  const hasilSiswaWrapper = document.getElementById('hasilSiswaWrapper');
  const portfolioFilterEl = document.querySelector('.portfolio-filter');

  function filterHasilSiswa(siklus) {
    if (!hasilSiswaWrapper) return;
    const cards = hasilSiswaWrapper.querySelectorAll('.hasil-card');
    cards.forEach(card => {
      const cardSiklus = card.getAttribute('data-hasil-siklus') || '';
      const match = (siklus === 'all' || cardSiklus === siklus);
      card.style.display = match ? '' : 'none';
    });
  }

  kontenTabs.forEach(btn => {
    btn.addEventListener('click', () => {
      kontenTabs.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const konten = btn.getAttribute('data-konten');
      const isHasil = konten === 'hasil-siswa';

      if (portfolioGridWrapper) portfolioGridWrapper.style.display = isHasil ? 'none' : '';
      if (portfolioFilterEl) portfolioFilterEl.style.display = isHasil ? 'none' : '';
      if (hasilSiswaWrapper) hasilSiswaWrapper.hidden = !isHasil;

      if (isHasil) filterHasilSiswa(getActiveSiklus());

      if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
        requestAnimationFrame(() => window.ScrollTrigger.refresh());
      }
    });
  });

  // ---------- Skills Tabs ----------
  const skillsTabBtns = document.querySelectorAll('.skills-tab-btn');
  skillsTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillsTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.skills-panel').forEach(p => p.classList.remove('active'));
      const target = document.getElementById('skills-' + btn.getAttribute('data-skills-tab'));
      if (target) target.classList.add('active');
    });
  });

  // ---------- Accordion ----------
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const isOpen = header.getAttribute('aria-expanded') === 'true';
      document.querySelectorAll('.accordion-header').forEach(h => {
        h.setAttribute('aria-expanded', 'false');
        h.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        header.setAttribute('aria-expanded', 'true');
        header.nextElementSibling.classList.add('open');
      }
    });
  });

  // ---------- Pillar Progress Animation ----------
  const pillarObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.pillar-progress-fill');
        if (fill) {
          const styleAttr = fill.getAttribute('style') || '';
          const match = styleAttr.match(/--progress:\s*([^;"]+)/);
          const width = match ? match[1].trim() : '80%';
          fill.style.width = width;
        }
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('.pillar-card').forEach(card => pillarObserver.observe(card));

  // ---------- Gallery Accordion Interaction ----------
  const galleryItems = document.querySelectorAll('.gallery-accordion .gallery-item');
  
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      // Remove active from all
      galleryItems.forEach(el => el.classList.remove('active'));
      // Add active to clicked
      item.classList.add('active');
    });
  });

  initProfilAnimation();
  initPendidikanAnimation();
  initArtefakAnimation();
  initAnalisisAnimation();
  initModelGuruAnimation();
  initKeahlianAnimation();
  initGaleriAnimation();
  initKontakAnimation();
  initFooterAnimation();
  initPortfolioChooser();
  initSertifikatModal();

}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMain, { once: true });
} else {
  initMain();
}

// Fade-in keyframe (used by filter)
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
document.head.appendChild(style);

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    const base = import.meta.env.BASE_URL || '/';
    navigator.serviceWorker.register(`${base}sw.js`)
      .then((reg) => {
        console.log('[PWA] Service Worker registered with scope:', reg.scope);
      })
      .catch((err) => {
        console.error('[PWA] Service Worker registration failed:', err);
      });
  });
}

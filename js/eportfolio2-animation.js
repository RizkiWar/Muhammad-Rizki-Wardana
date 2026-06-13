export function initEp2Animation() {
  var wrapper = document.getElementById('eportfolio2Wrapper');
  if (!wrapper) return;

  var navLinks = wrapper.querySelectorAll('#ep2NavLinks a');
  var sections = wrapper.querySelectorAll('section[id]');
  var navbar = document.getElementById('ep2Navbar');

  function updateActiveNav() {
    var scrollTop = wrapper.scrollTop;
    var wrapperH = wrapper.clientHeight;
    var current = '';
    sections.forEach(function(section) {
      if (section.offsetTop <= scrollTop + wrapperH * 0.5) {
        current = section.id;
      }
    });
    navLinks.forEach(function(link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
    if (navbar) {
      navbar.classList.toggle('scrolled', scrollTop > 24);
    }
  }

  wrapper.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // Smooth scroll for nav links
  wrapper.querySelectorAll('a[href^="#ep2-"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      var target = wrapper.querySelector(link.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      var ep2Ham = document.getElementById('ep2Hamburger');
      var ep2Nav = document.getElementById('ep2NavLinks');
      if (ep2Ham && ep2Nav) {
        ep2Ham.classList.remove('active');
        ep2Nav.classList.remove('open');
      }
    });
  });

  // EP2 Hamburger toggle
  var ep2Hamburger = document.getElementById('ep2Hamburger');
  var ep2NavLinksEl = document.getElementById('ep2NavLinks');
  if (ep2Hamburger && ep2NavLinksEl) {
    ep2Hamburger.addEventListener('click', function() {
      ep2Hamburger.classList.toggle('active');
      ep2NavLinksEl.classList.toggle('open');
    });
  }

  // Initialize GSAP animations
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    initEp2GsapAnimations(wrapper);
    initEp2HoverMicroMotion(wrapper);
    initEp2GlowPulse(wrapper);
  } else {
    initEp2FallbackReveals(wrapper);
  }
}

/* ============================================
   GSAP SCROLLTRIGGER ANIMATIONS
   ============================================ */
function initEp2GsapAnimations(wrapper) {
  if (wrapper.dataset.gsapBound === '1') return;
  wrapper.dataset.gsapBound = '1';

  var prefersReduced = false;
  if (prefersReduced) {
    initEp2FallbackReveals(wrapper);
    return;
  }

  // --- Hero entrance timeline ---
  var heroTl = gsap.timeline({ delay: 0.1 });

  var heroLeft = wrapper.querySelector('.ep2-hero-left');
  var heroGreeting = wrapper.querySelector('.ep2-hero-greeting');
  var heroTitle = wrapper.querySelector('.ep2-title');
  var heroSubtitle = wrapper.querySelector('.ep2-subtitle');
  var heroQuote = wrapper.querySelector('.ep2-hero-quote');
  var heroActions = wrapper.querySelector('.ep2-hero-actions');
  var heroPreviewCards = wrapper.querySelectorAll('.ep2-hero-preview-card');

  if (heroLeft) {
    heroTl.fromTo(heroLeft,
      { autoAlpha: 0, scale: 0.85, rotateY: -15, filter: 'blur(8px)' },
      { autoAlpha: 1, scale: 1, rotateY: 0, filter: 'blur(0px)', duration: 0.6, ease: 'back.out(1.4)' }
    );
  }

  if (heroGreeting) {
    heroTl.fromTo(heroGreeting,
      { autoAlpha: 0, x: -30, scale: 0.9 },
      { autoAlpha: 1, x: 0, scale: 1, duration: 0.4, ease: 'power3.out' },
      '-=0.3'
    );
  }

  if (heroTitle) {
    splitTextReveal(heroTitle, heroTl);
  }

  if (heroSubtitle) {
    heroTl.fromTo(heroSubtitle,
      { autoAlpha: 0, y: 20, filter: 'blur(4px)' },
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' },
      '-=0.2'
    );
  }

  if (heroQuote) {
    heroTl.fromTo(heroQuote,
      { autoAlpha: 0, x: -20, scaleX: 0.95 },
      { autoAlpha: 1, x: 0, scaleX: 1, duration: 0.4, ease: 'power2.out' },
      '-=0.2'
    );
  }

  if (heroActions) {
    heroTl.fromTo(heroActions,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      '-=0.2'
    );
  }

  if (heroPreviewCards.length) {
    heroTl.fromTo(heroPreviewCards,
      { autoAlpha: 0, y: 40, rotateX: 8, scale: 0.92 },
      { autoAlpha: 1, y: 0, rotateX: 0, scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(1.3)' },
      '-=0.2'
    );
  }

  // --- Hero photo entrance ---
  var heroPhoto = wrapper.querySelector('.ep2-hero-photo');
  if (heroPhoto) {
    heroTl.fromTo(heroPhoto,
      { autoAlpha: 0, scale: 0.6, rotation: -10 },
      { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.6)' },
      0.05
    );
  }

  // --- Hero social icons stagger ---
  var socialIcons = wrapper.querySelectorAll('.ep2-hero-social a');
  if (socialIcons.length) {
    heroTl.fromTo(socialIcons,
      { autoAlpha: 0, scale: 0, rotation: -180 },
      { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.4, stagger: 0.05, ease: 'back.out(2)' },
      '-=0.4'
    );
  }

  // --- Hero parallax on scroll ---
  initEp2Parallax(wrapper);

  // --- Section scroll-triggered entrances ---
  initEp2SectionEntrances(wrapper);
}

/* ============================================
   WORD-BY-WORD TITLE REVEAL
   ============================================ */
function splitTextReveal(el, timeline) {
  var html = el.innerHTML;
  var parts = html.split(/<br\s*\/?>/i);
  el.innerHTML = '';
  el.style.overflow = 'hidden';
  el.style.visibility = 'visible';

  parts.forEach(function(part, pi) {
    var words = part.trim().split(/\s+/);
    words.forEach(function(word) {
      if (!word) return;
      var span = document.createElement('span');
      span.innerHTML = word + ' ';
      span.style.display = 'inline-block';
      span.style.willChange = 'transform, opacity';
      span.classList.add('ep2-word');
      el.appendChild(span);
    });
    if (pi < parts.length - 1) {
      el.appendChild(document.createElement('br'));
    }
  });

  var wordSpans = el.querySelectorAll('.ep2-word');
  timeline.fromTo(wordSpans,
    { yPercent: 80, rotationX: 45, autoAlpha: 0 },
    { yPercent: 0, rotationX: 0, autoAlpha: 1, duration: 0.5, stagger: 0.03, ease: 'power3.out' },
    '-=0.3'
  );
}

/* ============================================
   HERO PARALLAX SCRUB
   ============================================ */
function initEp2Parallax(wrapper) {
  var photo = wrapper.querySelector('.ep2-hero-photo');
  var previewCards = wrapper.querySelectorAll('.ep2-hero-preview-card');
  var shapes = wrapper.querySelectorAll('.ep2-hero-shapes .shape');
  var heroSection = wrapper.querySelector('.ep2-hero');

  if (!heroSection) return;

  if (photo) {
    gsap.to(photo, {
      yPercent: -12,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        scroller: wrapper,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2
      }
    });
  }

  if (previewCards.length) {
    gsap.to(previewCards, {
      yPercent: -6,
      ease: 'none',
      scrollTrigger: {
        trigger: heroSection,
        scroller: wrapper,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5
      }
    });
  }

  if (shapes.length) {
    shapes.forEach(function(shape, i) {
      gsap.to(shape, {
        yPercent: -30 - (i * 10),
        rotation: 15 + (i * 5),
        ease: 'none',
        scrollTrigger: {
          trigger: heroSection,
          scroller: wrapper,
          start: 'top top',
          end: 'bottom top',
          scrub: 2
        }
      });
    });
  }
}

/* ============================================
   SECTION SCROLL-TRIGGERED ENTRANCES
   ============================================ */
function initEp2SectionEntrances(wrapper) {
  // --- Refleksi section ---
  var refleksiHeader = wrapper.querySelector('#ep2-refleksi .section-header');
  var questionCards = wrapper.querySelectorAll('.ep2-question-card');
  var summaryItems = wrapper.querySelectorAll('.ep2-refleksi-summary-item');

  if (refleksiHeader) {
    gsap.fromTo(refleksiHeader,
      { autoAlpha: 0, y: 30, filter: 'blur(6px)' },
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: refleksiHeader, scroller: wrapper, start: 'top 82%', once: true }
      }
    );
  }

  if (questionCards.length) {
    gsap.fromTo(questionCards,
      { autoAlpha: 0, y: 50, rotateX: 12, scale: 0.88, filter: 'blur(4px)' },
      { autoAlpha: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)',
        duration: 0.5, stagger: 0.1, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: questionCards[0], scroller: wrapper, start: 'top 80%', once: true }
      }
    );
  }

  if (summaryItems.length) {
    gsap.fromTo(summaryItems,
      { autoAlpha: 0, x: -30, scale: 0.92 },
      { autoAlpha: 1, x: 0, scale: 1,
        duration: 0.4, stagger: 0.07, ease: 'power3.out',
        scrollTrigger: { trigger: summaryItems[0], scroller: wrapper, start: 'top 85%', once: true }
      }
    );
  }

  // --- Filosofi section ---
  var filosofiHeader = wrapper.querySelector('#ep2-filosofi .section-header');
  var quoteBanner = wrapper.querySelector('.ep2-quote-banner');
  var filosofiCards = wrapper.querySelectorAll('.ep2-filosofi-mini-card');
  var valuesSection = wrapper.querySelector('.ep2-values-section');
  var valueMinis = wrapper.querySelectorAll('.ep2-value-mini');

  if (filosofiHeader) {
    gsap.fromTo(filosofiHeader,
      { autoAlpha: 0, y: 30, filter: 'blur(6px)' },
      { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: filosofiHeader, scroller: wrapper, start: 'top 82%', once: true }
      }
    );
  }

  if (quoteBanner) {
    gsap.fromTo(quoteBanner,
      { autoAlpha: 0, scale: 0.92, y: 20 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: quoteBanner, scroller: wrapper, start: 'top 80%', once: true }
      }
    );
    var quoteMark = quoteBanner.querySelector('.ep2-quote-mark');
    if (quoteMark) {
      gsap.fromTo(quoteMark,
        { autoAlpha: 0, scale: 0, rotation: -90 },
        { autoAlpha: 0.5, scale: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)',
          scrollTrigger: { trigger: quoteBanner, scroller: wrapper, start: 'top 80%', once: true }
        }
      );
    }
  }

  if (filosofiCards.length) {
    gsap.fromTo(filosofiCards,
      { autoAlpha: 0, y: 50, rotateX: 10, scale: 0.88, filter: 'blur(4px)' },
      { autoAlpha: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)',
        duration: 0.5, stagger: 0.12, ease: 'back.out(1.4)',
        scrollTrigger: { trigger: filosofiCards[0], scroller: wrapper, start: 'top 80%', once: true }
      }
    );
  }

  if (valuesSection) {
    gsap.fromTo(valuesSection,
      { autoAlpha: 0, y: 30 },
      { autoAlpha: 1, y: 0, duration: 0.5, ease: 'power2.out',
        scrollTrigger: { trigger: valuesSection, scroller: wrapper, start: 'top 82%', once: true }
      }
    );
  }

  if (valueMinis.length) {
    gsap.fromTo(valueMinis,
      { autoAlpha: 0, y: 30, scale: 0.9 },
      { autoAlpha: 1, y: 0, scale: 1,
        duration: 0.4, stagger: 0.07, ease: 'back.out(1.6)',
        scrollTrigger: { trigger: valueMinis[0], scroller: wrapper, start: 'top 85%', once: true }
      }
    );
  }

  // --- Footer entrance ---
  var footerBrand = wrapper.querySelector('.ep2-footer .footer-brand');
  var footerSitemap = wrapper.querySelector('.ep2-footer .footer-sitemap');
  if (footerBrand) {
    gsap.fromTo(footerBrand,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: footerBrand, scroller: wrapper, start: 'top 90%', once: true }
      }
    );
  }
  if (footerSitemap) {
    gsap.fromTo(footerSitemap,
      { autoAlpha: 0, y: 20 },
      { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: footerSitemap, scroller: wrapper, start: 'top 90%', once: true }
      }
    );
  }
}

/* ============================================
   HOVER MICRO-MOTION (3D tilt, elastic bounce)
   ============================================ */
function initEp2HoverMicroMotion(wrapper) {
  if (wrapper.dataset.hoverBound === '1') return;
  wrapper.dataset.hoverBound = '1';

  var isTouchDevice = 'ontouchstart' in window;
  if (isTouchDevice) return;

  // --- 3D Card Tilt ---
  var tiltCards = wrapper.querySelectorAll('.ep2-question-card, .ep2-filosofi-mini-card, .ep2-hero-preview-card');
  tiltCards.forEach(function(card) {
    card.style.transformStyle = 'preserve-3d';
    card.style.perspective = '800px';

    var rect = null;
    card.addEventListener('mouseenter', function() {
      rect = card.getBoundingClientRect();
    });

    card.addEventListener('mousemove', function(e) {
      if (!rect) rect = card.getBoundingClientRect();
      var x = (e.clientX - rect.left) / rect.width - 0.5;
      var y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, {
        rotateY: x * 12,
        rotateX: -y * 8,
        scale: 1.03,
        duration: 0.4,
        ease: 'power2.out'
      });
    });

    card.addEventListener('mouseleave', function() {
      rect = null;
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        scale: 1,
        duration: 0.6,
        ease: 'elastic.out(1, 0.5)'
      });
    });
  });

  // --- Icon elastic bounce on hover ---
  var icons = wrapper.querySelectorAll('.ep2-question-icon, .ep2-filosofi-mini-icon, .ep2-value-mini-icon');
  icons.forEach(function(icon) {
    icon.addEventListener('mouseenter', function() {
      gsap.fromTo(icon,
        { scale: 1, rotation: 0 },
        { scale: 1.2, rotation: 8, duration: 0.4, ease: 'back.out(3)', yoyo: true, repeat: 1 }
      );
    });
  });

  // --- Social icon hover: elastic scale + rotation ---
  var socialLinks = wrapper.querySelectorAll('.ep2-hero-social a');
  socialLinks.forEach(function(link) {
    link.addEventListener('mouseenter', function() {
      gsap.to(link, { scale: 1.25, rotation: 12, duration: 0.3, ease: 'back.out(2.5)' });
    });
    link.addEventListener('mouseleave', function() {
      gsap.to(link, { scale: 1, rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });

  // --- Button click bounce ---
  var buttons = wrapper.querySelectorAll('.ep2-filosofi-expand, .ep2-question-cta, .ep2-hero-actions .btn');
  buttons.forEach(function(btn) {
    btn.addEventListener('click', function() {
      gsap.fromTo(btn,
        { scale: 1 },
        { scale: 0.92, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.inOut' }
      );
    });
  });
}

/* ============================================
   GLOW PULSE ANIMATIONS
   ============================================ */
function initEp2GlowPulse(wrapper) {
  // Hero photo glow pulse
  var photo = wrapper.querySelector('.ep2-hero-photo');
  if (photo) {
    gsap.to(photo, {
      boxShadow: '0 0 40px rgba(46, 196, 182, 0.4), 0 14px 36px rgba(15, 94, 168, 0.18)',
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });
  }

  // Question card numbers glow
  var nums = wrapper.querySelectorAll('.ep2-question-num');
  nums.forEach(function(num, i) {
    var colors = [
      'rgba(46, 196, 182, 0.5)',
      'rgba(57, 189, 235, 0.5)',
      'rgba(155, 114, 207, 0.5)'
    ];
    gsap.to(num, {
      textShadow: '0 0 20px ' + (colors[i] || colors[0]),
      duration: 2.5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      delay: i * 0.4
    });
  });
}

/* ============================================
   MODAL GSAP TRANSITIONS
   ============================================ */
function openModalGsap(overlay, modalContent, templateId) {
  var template = document.getElementById(templateId + '-template');
  if (!template || !overlay || !modalContent) return;

  modalContent.innerHTML = '';
  modalContent.appendChild(template.content.cloneNode(true));
  overlay.classList.add('active');
  overlay.setAttribute('aria-hidden', 'false');

  var container = overlay.querySelector('.ep2-modal-container');
  if (container && typeof gsap !== 'undefined') {
    gsap.fromTo(container,
      { scale: 0.85, autoAlpha: 0, rotateX: 5, filter: 'blur(6px)' },
      { scale: 1, autoAlpha: 1, rotateX: 0, filter: 'blur(0px)', duration: 0.5, ease: 'back.out(1.5)' }
    );

    var children = container.querySelectorAll('.ep2-modal-header, .ep2-modal-body > *, .ep2-modal-step, .ep2-modal-challenge, .ep2-modal-feedback');
    if (children.length) {
      gsap.fromTo(children,
        { autoAlpha: 0, y: 20 },
        { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out', delay: 0.2 }
      );
    }
  }
}

function closeModalGsap(overlay, modalContent) {
  if (!overlay) return;
  var container = overlay.querySelector('.ep2-modal-container');

  if (container && typeof gsap !== 'undefined') {
    gsap.to(container, {
      scale: 0.9, autoAlpha: 0, filter: 'blur(4px)',
      duration: 0.3, ease: 'power2.in',
      onComplete: function() {
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        if (modalContent) modalContent.innerHTML = '';
        gsap.set(container, { clearProps: 'all' });
      }
    });
  } else {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    setTimeout(function() { if (modalContent) modalContent.innerHTML = ''; }, 300);
  }
}

/* ============================================
   FALLBACK (no GSAP)
   ============================================ */
function initEp2FallbackReveals(wrapper) {
  if (wrapper.dataset.animationsBound === '1') return;
  wrapper.dataset.animationsBound = '1';

  var animatedItems = wrapper.querySelectorAll([
    '.ep2-hero-left', '.ep2-hero-greeting', '.ep2-title', '.ep2-subtitle',
    '.ep2-hero-quote', '.ep2-hero-actions', '.ep2-hero-preview-card',
    '.section-header', '.ep2-question-card', '.ep2-refleksi-summary-item',
    '.ep2-quote-banner', '.ep2-filosofi-mini-card', '.ep2-values-section',
    '.ep2-value-mini', '.ep2-footer .footer-brand', '.ep2-footer .footer-sitemap'
  ].join(','));

  animatedItems.forEach(function(item, index) {
    item.classList.add('ep2-animate');
    item.style.setProperty('--ep2-delay', '0ms');
  });

  if (!('IntersectionObserver' in window)) {
    animatedItems.forEach(function(item) { item.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { root: wrapper, threshold: 0, rootMargin: '0px 0px 10% 0px' });

  animatedItems.forEach(function(item) { observer.observe(item); });
}

/* ============================================
   INTERACTIONS (modals, theme toggle)
   ============================================ */
function initEp2Interactions() {
  var wrapper = document.getElementById('eportfolio2Wrapper');
  if (!wrapper || wrapper.dataset.interactionsBound === '1') return;
  wrapper.dataset.interactionsBound = '1';

  var overlay = document.getElementById('ep2ModalOverlay');
  var modalContent = document.getElementById('ep2ModalContent');
  var closeBtn = document.getElementById('ep2ModalClose');

  // Question card click -> open modal
  wrapper.querySelectorAll('[data-ep2-modal]').forEach(function(card) {
    card.addEventListener('click', function() {
      openModalGsap(overlay, modalContent, card.getAttribute('data-ep2-modal'));
    });
  });

  // Filosofi expand buttons -> open modal
  wrapper.querySelectorAll('[data-ep2-expand]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var id = 'ep2-' + btn.getAttribute('data-ep2-expand');
      openModalGsap(overlay, modalContent, id);
    });
  });

  // Close handlers
  if (closeBtn) closeBtn.addEventListener('click', function() { closeModalGsap(overlay, modalContent); });
  if (overlay) {
    overlay.addEventListener('click', function(e) {
      if (e.target === overlay) closeModalGsap(overlay, modalContent);
    });
  }
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
      closeModalGsap(overlay, modalContent);
    }
  });

  // EP2 theme toggle
  var ep2ThemeToggle = document.getElementById('ep2ThemeToggle');
  if (ep2ThemeToggle) {
    var ep2ThemeIcon = ep2ThemeToggle.querySelector('.theme-icon');
    var current = document.documentElement.getAttribute('data-theme') || 'light';
    if (ep2ThemeIcon) ep2ThemeIcon.textContent = current === 'dark' ? '☀️' : '🌙';
    ep2ThemeToggle.addEventListener('click', function() {
      var now = document.documentElement.getAttribute('data-theme') || 'light';
      var next = now === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      if (ep2ThemeIcon) ep2ThemeIcon.textContent = next === 'dark' ? '☀️' : '🌙';
      var ep1Icon = document.querySelector('#themeToggle .theme-icon');
      if (ep1Icon) ep1Icon.textContent = next === 'dark' ? '☀️' : '🌙';
    });
  }
}

export function refreshEp2Animation() {
  initEp2Animation();
  initEp2Interactions();
  initEp2Particles();
  initEp2ScrollRail();
}

/* ============================================
   EP2 CANVAS PARTICLES (EP1-style mechanical shapes)
   ============================================ */
function initEp2Particles() {
  var wrapper = document.getElementById('eportfolio2Wrapper');
  if (!wrapper || wrapper.dataset.particlesBound === '1') return;
  wrapper.dataset.particlesBound = '1';

  if (false) return;
  if (window.innerWidth < 768) return;
  if (document.documentElement.classList.contains('perf-mode')) return;

  var canvas = document.createElement('canvas');
  canvas.id = 'ep2ParticleCanvas';
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:3;';
  wrapper.insertBefore(canvas, wrapper.firstChild);

  var ctx = canvas.getContext('2d');
  var particles = [];
  var mouseX = -999, mouseY = -999;
  var particleCount = Math.min(Math.floor(window.innerWidth / 30), 40);
  var colors = ['#0F5EA8', '#39BDEB', '#2EC4B6', '#F1C05B'];
  var shapes = ['gear', 'hexBolt', 'cube', 'spark', 'circle'];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function createParticle(x, y, burst) {
    var angle = burst ? Math.random() * Math.PI * 2 : 0;
    var speed = burst ? 2 + Math.random() * 2.5 : 0;
    return {
      x: x !== undefined ? x : Math.random() * canvas.width,
      y: y !== undefined ? y : Math.random() * canvas.height,
      vx: burst ? Math.cos(angle) * speed : (Math.random() - 0.5) * 0.3,
      vy: burst ? Math.sin(angle) * speed : (Math.random() - 0.5) * 0.3,
      size: Math.random() * 8 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      alpha: burst ? 1 : 0.35 + Math.random() * 0.25,
      life: burst ? 50 : Infinity
    };
  }

  for (var i = 0; i < particleCount; i++) {
    particles.push(createParticle());
  }

  wrapper.addEventListener('mousemove', function(e) { mouseX = e.clientX; mouseY = e.clientY; });
  wrapper.addEventListener('mouseleave', function() { mouseX = -999; mouseY = -999; });

  var ripples = [];
  var burstParticles = [];

  // Click ripple (EP1-style: expanding rings + burst)
  wrapper.addEventListener('click', function(e) {
    var color = colors[Math.floor(Math.random() * colors.length)];
    ripples.push({ x: e.clientX, y: e.clientY, radius: 0, maxRadius: 150 + Math.random() * 80, alpha: 0.4, color: color });
    ripples.push({ x: e.clientX, y: e.clientY, radius: 0, maxRadius: 80 + Math.random() * 60, alpha: 0.25, color: colors[Math.floor(Math.random() * colors.length)] });
    for (var j = 0; j < 12; j++) {
      var angle = (Math.PI * 2 / 12) * j + Math.random() * 0.3;
      var speed = 2 + Math.random() * 3;
      var bColor = colors[Math.floor(Math.random() * colors.length)];
      burstParticles.push({
        x: e.clientX, y: e.clientY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1.5,
        alpha: 0.8,
        color: bColor,
        life: 1,
        decay: 0.015 + Math.random() * 0.015
      });
    }
  });

  function drawGear(size) {
    var teeth = 7;
    ctx.beginPath();
    for (var i = 0; i < teeth * 2; i++) {
      var radius = i % 2 === 0 ? size : size * 0.72;
      var a = (Math.PI * 2 * i) / (teeth * 2);
      var x = Math.cos(a) * radius;
      var y = Math.sin(a) * radius;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawHexBolt(size) {
    ctx.beginPath();
    for (var i = 0; i < 6; i++) {
      var a = Math.PI / 6 + (Math.PI * 2 * i) / 6;
      var x = Math.cos(a) * size;
      var y = Math.sin(a) * size;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawCube(size) {
    var h = size * 0.55;
    var o = size * 0.3;
    ctx.strokeRect(-h, -h, size, size);
    ctx.strokeRect(-h + o, -h - o, size, size);
    ctx.beginPath();
    ctx.moveTo(-h, -h); ctx.lineTo(-h + o, -h - o);
    ctx.moveTo(h, -h); ctx.lineTo(h + o, -h - o);
    ctx.moveTo(-h, h); ctx.lineTo(-h + o, h - o);
    ctx.moveTo(h, h); ctx.lineTo(h + o, h - o);
    ctx.stroke();
  }

  function drawSpark(size) {
    ctx.beginPath();
    for (var i = 0; i < 4; i++) {
      var a = (Math.PI * 2 * i) / 4;
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(a) * size, Math.sin(a) * size);
    }
    ctx.stroke();
  }

  function drawCircle(size) {
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.6, 0, Math.PI * 2);
    ctx.stroke();
  }

  var drawFns = { gear: drawGear, hexBolt: drawHexBolt, cube: drawCube, spark: drawSpark, circle: drawCircle };

  var isScrolling = false;
  var scrollTimeout;
  wrapper.addEventListener('scroll', function() {
    isScrolling = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() { isScrolling = false; }, 150);
  }, { passive: true });

  function animate() {
    if (canvas.offsetWidth === 0) {
      setTimeout(animate, 250);
      return;
    }
    if (isScrolling) {
      setTimeout(animate, 100);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw ripples (EP1-style expanding rings)
    for (var ri = ripples.length - 1; ri >= 0; ri--) {
      var r = ripples[ri];
      r.radius += 3;
      r.alpha -= 0.006;
      if (r.alpha <= 0 || r.radius >= r.maxRadius) { ripples.splice(ri, 1); continue; }
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = r.color.replace(')', ',' + r.alpha + ')').replace('rgb(', 'rgba(');
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    // Draw burst particles
    for (var bi = burstParticles.length - 1; bi >= 0; bi--) {
      var b = burstParticles[bi];
      b.x += b.vx; b.y += b.vy;
      b.vx *= 0.96; b.vy *= 0.96;
      b.life -= b.decay;
      b.alpha = b.life * 0.8;
      if (b.life <= 0) { burstParticles.splice(bi, 1); continue; }
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.size * b.life, 0, Math.PI * 2);
      ctx.fillStyle = b.color.replace(')', ',' + b.alpha + ')').replace('rgb(', 'rgba(');
      ctx.fill();
    }

    // Draw main particles
    for (var i = particles.length - 1; i >= 0; i--) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotSpeed;
      if (p.life !== Infinity) p.life--;

      // Mouse repulsion
      var dx = p.x - mouseX;
      var dy = p.y - mouseY;
      var dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120 && dist > 0) {
        var force = (120 - dist) / 120 * 0.6;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      // Damping
      p.vx *= 0.985;
      p.vy *= 0.985;

      // Wrap edges
      if (p.x < -20) p.x = canvas.width + 20;
      if (p.x > canvas.width + 20) p.x = -20;
      if (p.y < -20) p.y = canvas.height + 20;
      if (p.y > canvas.height + 20) p.y = -20;

      // Draw
      var alpha = p.life !== Infinity ? (p.life / 50) * p.alpha : p.alpha;
      if (alpha <= 0) { particles.splice(i, 1); continue; }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = p.color;
      ctx.lineWidth = Math.max(1, p.size * 0.1);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      drawFns[p.shape](p.size);
      ctx.restore();

      // Connection lines
      for (var j = i - 1; j >= Math.max(0, i - 8); j--) {
        var p2 = particles[j];
        if (p2.life !== Infinity) continue;
        var d = Math.sqrt((p.x - p2.x) ** 2 + (p.y - p2.y) ** 2);
        if (d < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = 'rgba(57,189,235,' + ((1 - d / 110) * 0.12) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
}

/* ============================================
   EP2 SCROLL RAIL (dot navigation)
   ============================================ */
function initEp2ScrollRail() {
  var wrapper = document.getElementById('eportfolio2Wrapper');
  if (!wrapper || wrapper.dataset.railBound === '1') return;
  wrapper.dataset.railBound = '1';
  if (window.innerWidth < 768) return;

  var sections = wrapper.querySelectorAll('section[id]');
  if (sections.length < 2) return;

  // Create rail
  var rail = document.createElement('div');
  rail.className = 'ep2-scroll-rail';
  rail.setAttribute('aria-hidden', 'true');

  var sectionNames = { 'ep2-hero': 'Beranda', 'ep2-refleksi': 'Refleksi', 'ep2-filosofi': 'Filosofi' };

  sections.forEach(function(section) {
    var dot = document.createElement('button');
    dot.className = 'ep2-rail-dot';
    dot.setAttribute('data-target', section.id);
    dot.setAttribute('title', sectionNames[section.id] || section.id);
    dot.addEventListener('click', function() {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    rail.appendChild(dot);
  });

  wrapper.appendChild(rail);

  // Update active dot on scroll
  function updateRail() {
    var scrollTop = wrapper.scrollTop;
    var wrapperH = wrapper.clientHeight;
    var current = '';
    sections.forEach(function(section) {
      if (section.offsetTop <= scrollTop + wrapperH * 0.5) {
        current = section.id;
      }
    });
    rail.querySelectorAll('.ep2-rail-dot').forEach(function(dot) {
      dot.classList.toggle('active', dot.getAttribute('data-target') === current);
    });
  }

  wrapper.addEventListener('scroll', updateRail, { passive: true });
  updateRail();
}

const { gsap, ScrollTrigger } = window;

if (!gsap || !ScrollTrigger) {
  throw new Error('GSAP vendor scripts must be loaded before scroll-experience.js');
}

gsap.registerPlugin(ScrollTrigger);
gsap.config({ nullTargetWarn: false });

const motionQuery = { matches: false };
window.__portfolioScrollExperience = true;

const SECTION_PALETTES = {
  hero: {
    accent: '#39BDEB',
    rgb: '57, 189, 235',
    wash: 'rgba(57, 189, 235, 0.18)',
    sweep: 'rgba(57, 189, 235, 0.22)'
  },
  about: {
    accent: '#2EC4B6',
    rgb: '46, 196, 182',
    wash: 'rgba(46, 196, 182, 0.16)',
    sweep: 'rgba(46, 196, 182, 0.22)'
  },
  education: {
    accent: '#9B72CF',
    rgb: '155, 114, 207',
    wash: 'rgba(155, 114, 207, 0.15)',
    sweep: 'rgba(155, 114, 207, 0.2)'
  },
  portfolio: {
    accent: '#0F5EA8',
    rgb: '15, 94, 168',
    wash: 'rgba(15, 94, 168, 0.16)',
    sweep: 'rgba(15, 94, 168, 0.21)'
  },
  penilaian: {
    accent: '#6BCB77',
    rgb: '107, 203, 119',
    wash: 'rgba(107, 203, 119, 0.15)',
    sweep: 'rgba(107, 203, 119, 0.22)'
  },
  'model-guru': {
    accent: '#F1A340',
    rgb: '241, 163, 64',
    wash: 'rgba(241, 163, 64, 0.13)',
    sweep: 'rgba(241, 163, 64, 0.2)'
  },
  skills: {
    accent: '#56CCF2',
    rgb: '86, 204, 242',
    wash: 'rgba(86, 204, 242, 0.15)',
    sweep: 'rgba(86, 204, 242, 0.21)'
  },
  certificates: {
    accent: '#7C9A2D',
    rgb: '124, 154, 45',
    wash: 'rgba(124, 154, 45, 0.13)',
    sweep: 'rgba(124, 154, 45, 0.19)'
  },
  gallery: {
    accent: '#B794E0',
    rgb: '183, 148, 224',
    wash: 'rgba(183, 148, 224, 0.14)',
    sweep: 'rgba(183, 148, 224, 0.2)'
  },
  contact: {
    accent: '#FF6F91',
    rgb: '255, 111, 145',
    wash: 'rgba(255, 111, 145, 0.12)',
    sweep: 'rgba(255, 111, 145, 0.18)'
  }
};

const MOTION_TARGETS = [
  '.hero-greeting',
  '.hero-name',
  '.hero-role',
  '.hero-desc',
  '.hero-actions',
  '.hero-social',
  '.hero-image',
  '.hero-badge',
  '.section-header',
  '.about-image',
  '.profil-narasi',
  '.about-info-item',
  '.profil-quote',
  '.life-timeline',
  '.timeline-item',
  '.portfolio-tabs',
  '.portfolio-filter',
  '.portfolio-card',
  '.accordion-item',
  '.philosophy-card',
  '.pillar-card',
  '.skills-tabs',
  '.skill-item-card',
  '.cert-card',
  '.gallery-accordion',
  '.gallery-item',
  '.contact-info',
  '.contact-detail-item',
  '.contact-form'
];

const CARD_TARGETS = [
  '.portfolio-card',
  '.timeline-card',
  '.accordion-item',
  '.assessment-card',
  '.chart-panel',
  '.philosophy-card',
  '.pillar-card',
  '.skill-item-card',
  '.cert-card',
  '.gallery-item',
  '.contact-form'
].join(', ');

function onReady(callback) {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', callback, { once: true });
    return;
  }

  callback();
}

function waitForIntroReady(callback) {
  let started = false;
  const start = () => {
    if (started) return;
    started = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(callback);
    });
  };

  if (document.body.classList.contains('intro-ready')) {
    start();
    return;
  }

  const observer = new MutationObserver(() => {
    if (!document.body.classList.contains('intro-ready')) return;
    observer.disconnect();
    start();
  });

  observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}

function getPalette(sectionId) {
  return SECTION_PALETTES[sectionId] || SECTION_PALETTES.hero;
}

function getSectionLabel(section, index) {
  const title = section.querySelector('.section-title')?.textContent?.trim();
  const navLabel = document.querySelector(`.nav-links a[href="#${section.id}"]`)?.textContent?.trim();
  return title || navLabel || `Section ${index + 1}`;
}

function getAnchorScrollOffset() {
  const navbar = document.getElementById('navbar');
  const navHeight = navbar ? navbar.getBoundingClientRect().height : 0;
  const extraGap = window.innerWidth <= 768 ? 6 : 8;
  return Math.ceil(navHeight + extraGap);
}

function scrollToSection(section) {
  const targetTop = section.getBoundingClientRect().top + window.pageYOffset;

  window.scrollTo({
    top: Math.max(0, targetTop - getAnchorScrollOffset()),
    behavior: motionQuery.matches ? 'auto' : 'smooth'
  });
}

function createScrollUi(sections) {
  const rail = document.createElement('nav');
  rail.className = 'scroll-rail';
  rail.setAttribute('aria-label', 'Navigasi section');
  const dots = sections.map((section, index) => {
    const dot = document.createElement('button');
    const label = getSectionLabel(section, index);
    dot.type = 'button';
    dot.className = 'scroll-rail__dot';
    dot.setAttribute('aria-label', `Ke section ${label}`);
    dot.setAttribute('title', label);
    dot.style.setProperty('--dot-index', index);
    dot.addEventListener('click', () => scrollToSection(section));
    rail.appendChild(dot);
    return dot;
  });

  document.body.append(rail);
  return { rail, dots };
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  })[char]);
}

function wrapSectionTitle(section) {
  const title = section.querySelector('.section-title');
  if (!title || title.dataset.scrollWords === 'true') return [];

  const words = title.textContent.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2) return [];

  title.dataset.scrollWords = 'true';
  title.innerHTML = words
    .map(word => `<span class="scroll-title-word"><span>${escapeHtml(word)}</span></span>`)
    .join(' ');

  return gsap.utils.toArray(title.querySelectorAll('.scroll-title-word > span'));
}

function uniqueElements(items) {
  return [...new Set(items)].filter(item => item instanceof HTMLElement);
}

function collectMotionTargets(section) {
  const items = MOTION_TARGETS.flatMap(selector => (
    gsap.utils.toArray(section.querySelectorAll(selector))
  ));

  return uniqueElements(items);
}

function prepareSection(section, index) {
  const palette = getPalette(section.id);
  section.classList.add('scroll-fx-section');
  section.style.setProperty('--fx-accent', palette.accent);
  section.style.setProperty('--fx-accent-rgb', palette.rgb);
  section.style.setProperty('--fx-sweep', palette.sweep);
  section.style.setProperty('--fx-order', index);

  const container = section.querySelector(':scope > .container');
  if (container) {
    container.classList.add('scroll-fx-container');
  }

  const cards = section.querySelectorAll(CARD_TARGETS);
  cards.forEach(card => card.classList.add('scroll-fx-card'));

  const items = collectMotionTargets(section);
  items.forEach((item, itemIndex) => {
    item.classList.add('scroll-fx-item');
    item.style.setProperty('--fx-item-order', Math.min(itemIndex, 14));
  });

  return {
    titleWords: wrapSectionTitle(section),
    items
  };
}

function buildSectionEntrance(section, prepared, index) {
  const isHeroSection = section.id === 'hero';
  const header = section.querySelector('.section-header');
  const icons = gsap.utils.toArray(section.querySelectorAll(
    '.hero-badge-icon, .info-icon, .timeline-dot, .edu-logo, .pillar-icon, .skill-item-icon, .cert-icon, .detail-icon'
  ));

  const start = index === 0 ? 'top 92%' : 'top 78%';
  const timeline = gsap.timeline({
    defaults: { ease: 'power4.out' },
    scrollTrigger: {
      trigger: section,
      start,
      toggleActions: 'play none none none'
    }
  });

  timeline.set(section, {
    '--fx-line-opacity': 0,
    '--fx-line-scale': 0
  });

  if (header) {
    timeline.fromTo(header, {
      autoAlpha: 0,
      x: 0,
      y: 26,
      rotationX: 6,
      filter: 'blur(4px)',
      transformPerspective: 900
    }, {
      autoAlpha: 1,
      x: 0,
      y: 0,
      rotationX: 0,
      filter: 'blur(0px)',
      duration: 1.05
    }, 0.04);
  }

  if (prepared.titleWords.length) {
    timeline.fromTo(prepared.titleWords, {
      autoAlpha: 0,
      yPercent: 78,
      rotationX: 42,
      transformOrigin: 'left bottom',
      transformPerspective: 900
    }, {
      autoAlpha: 1,
      yPercent: 0,
      rotationX: 0,
      duration: 0.95,
      stagger: 0.035,
      ease: 'power4.out'
    }, 0.14);
  }

  timeline.to(section, {
    '--fx-line-opacity': 1,
    '--fx-line-scale': 1,
    duration: 0.95,
    ease: 'power3.out'
  }, 0.2);

  const bodyItems = prepared.items.filter(item => item !== header);
  if (bodyItems.length) {
    if (isHeroSection) {
      timeline.set(bodyItems, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotationX: 0,
        filter: 'none'
      }, 0);
    } else {
      timeline.fromTo(bodyItems, {
        autoAlpha: 0,
        x: 0,
        y: 32,
        scale: 0.985,
        rotationX: 4,
        filter: 'blur(4px)',
        transformPerspective: 900
      }, {
        autoAlpha: 1,
        x: 0,
        y: 0,
        scale: 1,
        rotationX: 0,
        filter: 'none',
        duration: 0.98,
        stagger: {
          each: 0.055,
          from: 'start'
        }
      }, header ? 0.32 : 0.08);
    }
  }

  if (icons.length) {
    timeline.fromTo(icons, {
      scale: 0.86,
      rotate: -3
    }, {
      scale: 1,
      rotate: 0,
      duration: 0.74,
      stagger: 0.035,
      ease: 'back.out(1.25)'
    }, 0.46);
  }
}

function buildSectionScrub(section) {
  const parallaxTargets = gsap.utils.toArray(section.querySelectorAll(
    '.hero-image-wrapper, .about-image-card, .philosophy-card'
  ));

  if (parallaxTargets.length) {
    gsap.to(parallaxTargets, {
      yPercent: -4,
      rotate: index => (index % 2 === 0 ? 0.6 : -0.6),
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.35
      }
    });
  }

  const floatingIcons = gsap.utils.toArray(section.querySelectorAll(
    '.timeline-dot, .edu-logo, .pillar-icon, .skill-item-icon, .cert-icon, .detail-icon'
  ));

  if (floatingIcons.length) {
    gsap.to(floatingIcons, {
      y: -5,
      rotate: index => (index % 2 === 0 ? 1.5 : -1.5),
      ease: 'none',
      stagger: 0.02,
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.45
      }
    });
  }

  const timeline = section.querySelector('.timeline');
  if (timeline) {
    gsap.fromTo(timeline, {
      '--timeline-reveal': '100%'
    }, {
      '--timeline-reveal': '0%',
      ease: 'none',
      scrollTrigger: {
        trigger: timeline,
        start: 'top 78%',
        end: 'bottom 42%',
        scrub: 1.1
      }
    });
  }
}

function setActiveSection(section, index, ui) {
  document.querySelectorAll('.scroll-fx-current').forEach(activeSection => {
    activeSection.classList.remove('scroll-fx-current');
  });
  section.classList.add('scroll-fx-current');

  ui.dots.forEach((dot, dotIndex) => {
    dot.classList.toggle('is-active', dotIndex === index);
    if (dotIndex === index) {
      dot.setAttribute('aria-current', 'true');
    } else {
      dot.removeAttribute('aria-current');
    }
  });
}

function refreshSoon() {
  window.clearTimeout(refreshSoon.timer);
  refreshSoon.timer = window.setTimeout(() => ScrollTrigger.refresh(), 420);
}

function animateVisiblePortfolioCards() {
  const cards = gsap.utils.toArray('.portfolio-card').filter(card => (
    card.offsetParent !== null && getComputedStyle(card).display !== 'none'
  ));

  gsap.fromTo(cards, {
    autoAlpha: 0,
    y: 16,
    scale: 0.988
  }, {
    autoAlpha: 1,
    y: 0,
    scale: 1,
    duration: 0.62,
    stagger: 0.04,
    ease: 'power4.out',
    overwrite: true
  });
}

function buildInteractionMicroMotion() {
  document.querySelectorAll('.skills-tab-btn').forEach(button => {
    button.addEventListener('click', () => {
      requestAnimationFrame(() => {
        const activePanel = document.querySelector('.skills-panel.active');
        const cards = activePanel ? gsap.utils.toArray(activePanel.querySelectorAll('.skill-item-card')) : [];
        gsap.fromTo(cards, {
          autoAlpha: 0,
          y: 20,
          scale: 0.985,
          rotationX: 4
        }, {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 0.66,
          stagger: 0.055,
          ease: 'power4.out',
          overwrite: true
        });
        refreshSoon();
      });
    });
  });

  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      requestAnimationFrame(() => {
        const body = header.nextElementSibling;
        if (!body || !body.classList.contains('open')) {
          refreshSoon();
          return;
        }

        gsap.fromTo(body.querySelectorAll('.accordion-row'), {
          autoAlpha: 0,
          x: -12,
          scale: 0.992
        }, {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          duration: 0.54,
          stagger: 0.055,
          ease: 'power4.out',
          overwrite: true
        });
        refreshSoon();
      });
    });
  });

  document.querySelectorAll('.filter-btn, .tab-btn').forEach(button => {
    button.addEventListener('click', () => {
      requestAnimationFrame(() => {
        animateVisiblePortfolioCards();
        refreshSoon();
      });
    });
  });
}

function getInitialSection(sections) {
  return sections.find(section => {
    const rect = section.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.55 && rect.bottom >= window.innerHeight * 0.35;
  }) || sections[0];
}

function initScrollExperience() {
  const sections = gsap.utils.toArray('section.section[id]').filter(s => !s.closest('.eportfolio2-wrapper'));
  if (!sections.length) return;

  document.body.classList.add('gsap-ready', 'scroll-fx-ready');

  const ui = createScrollUi(sections);
  const preparedSections = sections.map((section, index) => prepareSection(section, index));

  sections.forEach((section, index) => {
    buildSectionEntrance(section, preparedSections[index], index);
    buildSectionScrub(section);

    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: () => setActiveSection(section, index, ui),
      onEnterBack: () => setActiveSection(section, index, ui)
    });
  });

  buildInteractionMicroMotion();

  const initialSection = getInitialSection(sections);
  setActiveSection(initialSection, sections.indexOf(initialSection), ui);

  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
  ScrollTrigger.refresh();
}

onReady(() => {
  waitForIntroReady(initScrollExperience);
});

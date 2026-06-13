/* ============================================
   GSAP ENHANCEMENTS
   Timeline-based hero motion, ScrollTrigger reveal, and Chart.js dashboard.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const html = document.documentElement;
  const body = document.body;

  document.querySelectorAll('a[href="#"]').forEach(link => {
    link.classList.add('is-placeholder-link');
    link.setAttribute('aria-disabled', 'true');
    if (!link.getAttribute('title')) {
      link.setAttribute('title', 'Tautan akan dilengkapi');
    }
    link.addEventListener('click', event => event.preventDefault());
  });

  const hasGsap = Boolean(window.gsap);
  const hasScrollTrigger = Boolean(window.ScrollTrigger);
  const introTear = document.getElementById('introTear');
  const prefersReducedMotion = false;
  const introOpenKeys = new Set(['ArrowDown', 'PageDown', ' ', 'Spacebar', 'Enter']);
  let introOpened = false;

  document.querySelectorAll('.hero-actions a[href^="#"], .hero-social a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      event.preventDefault();
      completeIntro();
      const navbar = document.getElementById('navbar');
      let navHeight = 0;
      if (navbar) {
        const wasScrolled = navbar.classList.contains('scrolled');
        if (!wasScrolled) navbar.classList.add('scrolled');
        navHeight = navbar.getBoundingClientRect().height;
        if (!wasScrolled) navbar.classList.remove('scrolled');
      }
      const offset = Math.ceil(navHeight - 10);
      const targetTop = target.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: Math.max(0, targetTop - offset),
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  });

  if (introTear && !window.location.hash) {
    try {
      window.history.scrollRestoration = 'manual';
    } catch (error) {
      // Some browsers do not allow changing scroll restoration.
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }

  const completeIntro = () => {
    if (!introTear) return;
    introTear.classList.add('is-complete');
    body.classList.add('intro-ready', 'intro-opened');
  };

  const setupIntroOpen = gsapInstance => {
    if (!introTear || introOpened) return;

    if (window.location.hash) {
      introOpened = true;
      completeIntro();
      return;
    }

    const openIntro = () => {
      if (introOpened || !introTear.classList.contains('loader-complete')) return;

      introOpened = true;
      removeListeners();
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });

      if (gsapInstance) {
        gsapInstance.to(introTear, {
          y: -34,
          scale: 1.018,
          autoAlpha: 0,
          duration: 0.62,
          ease: 'power3.inOut',
          overwrite: 'auto',
          onStart: () => introTear.classList.add('is-opening'),
          onComplete: completeIntro,
        });
        return;
      }

      introTear.classList.add('is-opening');
      window.setTimeout(completeIntro, 640);
    };

    const onWheel = event => {
      if (Math.abs(event.deltaY) <= 1) return;
      event.preventDefault();
      openIntro();
    };

    const onTouchStart = () => openIntro();

    const onKeydown = event => {
      if (!introOpenKeys.has(event.key)) return;
      event.preventDefault();
      openIntro();
    };

    const onScroll = () => {
      if (window.scrollY > 2) openIntro();
    };

    function removeListeners() {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('keydown', onKeydown);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('portfolio:loader-hidden', addListeners);
    }

    function addListeners() {
      if (introOpened) return;
      window.addEventListener('wheel', onWheel, { passive: false });
      window.addEventListener('touchstart', onTouchStart, { passive: true });
      window.addEventListener('keydown', onKeydown);
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    if (introTear.classList.contains('loader-complete')) {
      addListeners();
    } else {
      window.addEventListener('portfolio:loader-hidden', addListeners, { once: true });
    }
  };

  if (hasGsap) {
    const gsap = window.gsap;
    body.classList.add('gsap-ready');
    gsap.defaults({ duration: 0.65, ease: 'power3.out' });

    if (prefersReducedMotion) {
      completeIntro();
    } else {
      setupIntroOpen(gsap);
    }

    if (hasScrollTrigger) {
      gsap.registerPlugin(window.ScrollTrigger);
    }

    const mm = gsap.matchMedia();

    mm.add({
      reduceMotion: '(max-width: 0px)',
      isDesktop: '(min-width: 900px)',
    }, context => {
      const { reduceMotion, isDesktop } = context.conditions;

      if (reduceMotion) {
        completeIntro();
        gsap.set([
          '.hero-greeting',
          '.hero-name',
          '.hero-role',
          '.hero-desc',
          '.hero-actions',
          '.hero-social',
          '.hero-image-wrapper',
          '.hero-badge',
        ], { clearProps: 'all' });
        return;
      }

      const heroTl = gsap.timeline({
        defaults: { duration: 0.72, ease: 'power3.out' },
      });

      heroTl
        .from('.hero-greeting, .hero-name, .hero-role, .hero-desc', {
          y: isDesktop ? 28 : 18,
          autoAlpha: 0,
          stagger: 0.075,
          clearProps: 'transform,visibility',
        })
        .from('.hero-actions .btn', {
          y: 14,
          autoAlpha: 0,
          stagger: 0.07,
          clearProps: 'transform,visibility',
        }, '-=0.16')
        .from('.hero-social a', {
          y: 10,
          autoAlpha: 0,
          stagger: 0.045,
          clearProps: 'transform,visibility',
        }, '-=0.12')
        .from('.hero-image-wrapper', {
          y: isDesktop ? 22 : 12,
          scale: 0.96,
          autoAlpha: 0,
          clearProps: 'transform,visibility',
        }, 0.18)
        .from('.hero-badge', {
          y: 12,
          autoAlpha: 0,
          stagger: 0.06,
          clearProps: 'transform,visibility',
        }, '-=0.3');

      if (!hasScrollTrigger) {
        return;
      }

      const ScrollTrigger = window.ScrollTrigger;

      const revealTargets = [
        '.section-header',
        '.timeline-card',
        '.profil-quote',
        '.life-timeline',
        '.assessment-card',
        '.chart-panel',
        '.accordion',
        '.philosophy-card',
        '.pillar-card',
        '.gallery-item',
        '.skills-tabs',
        '.skill-item-card',
        '.cert-card',
        '.contact-detail-item',
        '.contact-form',
      ].join(', ');

      ScrollTrigger.batch(revealTargets, {
        start: 'top 88%',
        once: true,
        batchMax: isDesktop ? 6 : 3,
        interval: 0.08,
        onEnter: batch => {
          gsap.fromTo(batch,
            { y: isDesktop ? 30 : 18, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.62,
              stagger: 0.07,
              overwrite: 'auto',
              clearProps: 'transform,visibility',
            },
          );
        },
      });

      ScrollTrigger.batch('.portfolio-card', {
        start: 'top 86%',
        once: true,
        batchMax: isDesktop ? 4 : 2,
        interval: 0.08,
        onEnter: batch => {
          gsap.fromTo(batch,
            { y: isDesktop ? 34 : 20, scale: 0.985, autoAlpha: 0 },
            {
              y: 0,
              scale: 1,
              autoAlpha: 1,
              duration: 0.68,
              stagger: 0.075,
              overwrite: 'auto',
              clearProps: 'transform,visibility',
            },
          );
        },
      });

      window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    });
  } else if (prefersReducedMotion) {
    completeIntro();
  } else {
    setupIntroOpen(null);
  }

  if (!window.Chart) return;

  const progressCanvas = document.getElementById('assessmentProgressChart');
  const radarCanvas = document.getElementById('competencyRadarChart');
  if (!progressCanvas || !radarCanvas) return;

  const cssValue = name => getComputedStyle(html).getPropertyValue(name).trim();
  const isDark = () => html.getAttribute('data-theme') === 'dark';

  const palette = () => ({
    primary: cssValue('--primary') || '#0F5EA8',
    accent: cssValue('--accent') || '#39BDEB',
    teal: cssValue('--teal') || '#2EC4B6',
    text: cssValue('--gray-700') || '#2D3443',
    muted: cssValue('--gray-500') || '#6E7787',
    grid: isDark() ? 'rgba(255,255,255,0.12)' : 'rgba(15,94,168,0.12)',
    surface: isDark() ? 'rgba(57,189,235,0.16)' : 'rgba(57,189,235,0.14)',
  });

  let progressChart;
  let radarChart;
  let chartsAnimated = false;

  function buildCharts(animate = true) {
    const colors = palette();
    const progressValues = [100, 55, 15];
    const radarValues = [82, 88, 78, 84, 86];

    if (progressChart) progressChart.destroy();
    if (radarChart) radarChart.destroy();

    progressChart = new Chart(progressCanvas, {
      type: 'bar',
      data: {
        labels: ['Siklus 1', 'Siklus 2', 'Siklus 3'],
        datasets: [{
          label: 'Kelengkapan dokumen',
          data: animate ? [0, 0, 0] : progressValues,
          backgroundColor: [colors.primary, colors.accent, 'rgba(148, 163, 184, 0.7)'],
          borderColor: [colors.primary, colors.accent, 'rgba(148, 163, 184, 1)'],
          borderWidth: 1,
          borderRadius: 8,
          maxBarThickness: 56,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 650, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: context => `${context.raw}% status portofolio`,
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: colors.text, font: { weight: 700 } },
          },
          y: {
            min: 0,
            max: 100,
            grid: { color: colors.grid },
            ticks: {
              color: colors.muted,
              callback: value => `${value}%`,
            },
          },
        },
      },
    });

    radarChart = new Chart(radarCanvas, {
      type: 'radar',
      data: {
        labels: ['Pedagogik', 'Profesional', 'Sosial', 'Kepribadian', 'Teknologi'],
        datasets: [{
          label: 'Fokus pengembangan',
          data: animate ? [0, 0, 0, 0, 0] : radarValues,
          backgroundColor: colors.surface,
          borderColor: colors.accent,
          borderWidth: 2,
          pointBackgroundColor: colors.primary,
          pointBorderColor: '#FFFFFF',
          pointHoverRadius: 5,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 650, easing: 'easeOutQuart' },
        plugins: {
          legend: {
            labels: { color: colors.text, boxWidth: 12, font: { weight: 700 } },
          },
          tooltip: {
            callbacks: {
              label: context => `${context.dataset.label}: ${context.raw}/100 indeks visual`,
            },
          },
        },
        scales: {
          r: {
            min: 0,
            max: 100,
            angleLines: { color: colors.grid },
            grid: { color: colors.grid },
            pointLabels: { color: colors.text, font: { weight: 700 } },
            ticks: {
              display: false,
              stepSize: 20,
            },
          },
        },
      },
    });

    if (!animate) return;

    const runChartAnimation = () => {
      if (chartsAnimated) return;
      chartsAnimated = true;
      progressChart.data.datasets[0].data = progressValues;
      radarChart.data.datasets[0].data = radarValues;
      progressChart.update();
      radarChart.update();
    };

    if (window.ScrollTrigger && hasGsap) {
      window.ScrollTrigger.create({
        trigger: '.assessment-dashboard',
        start: 'top 78%',
        once: true,
        onEnter: runChartAnimation,
      });
    } else {
      runChartAnimation();
    }
  }

  buildCharts(true);

  const themeObserver = new MutationObserver(mutations => {
    const themeChanged = mutations.some(mutation => mutation.attributeName === 'data-theme');
    if (!themeChanged) return;
    buildCharts(!chartsAnimated);
  });

  themeObserver.observe(html, { attributes: true });
});

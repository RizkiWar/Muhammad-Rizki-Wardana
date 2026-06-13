/* ============================================
   SECTION TRANSITIONS
   Active-section motion and lightweight content cascade.
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = false;
  const enhancedScrollFx = window.__portfolioScrollExperience === true;
  const sections = Array.from(document.querySelectorAll('section.section[id]'));

  if (!sections.length || reduceMotion || enhancedScrollFx || !('IntersectionObserver' in window)) {
    document.body.classList.add('section-motion-ready');
    return;
  }

  const motionTargets = [
    '.section-header',
    '.about-content',
    '.about-image',
    '.timeline-item',
    '.portfolio-card',
    '.accordion-item',
    '.philosophy-card',
    '.pillar-card',
    '.skills-tab-btn',
    '.skill-item-card',
    '.cert-card',
    '.gallery-accordion',
    '.contact-info',
    '.contact-form'
  ].join(', ');

  document.body.classList.add('section-motion-ready');

  sections.forEach((section, sectionIndex) => {
    section.classList.add('section-motion-section');
    section.style.setProperty('--section-motion-index', sectionIndex);

    Array.from(section.querySelectorAll(motionTargets)).forEach((element, itemIndex) => {
      element.classList.add('section-motion-child');
      element.style.setProperty('--section-motion-order', Math.min(itemIndex, 10));
      element.style.setProperty('--section-motion-delay', `${Math.min(itemIndex, 10) * 45}ms`);
    });
  });

  let activeSection = null;

  function playSection(section) {
    if (!section || activeSection === section) return;

    if (activeSection) {
      const previousSection = activeSection;
      previousSection.classList.remove('section-motion-current', 'section-motion-play');
      previousSection.classList.add('section-motion-leaving');
      window.setTimeout(() => {
        previousSection.classList.remove('section-motion-leaving');
      }, 420);
    }

    activeSection = section;
    section.classList.add('section-motion-entered');
    section.classList.remove('section-motion-play');

    const children = Array.from(section.querySelectorAll('.section-motion-child'));
    children.forEach(child => child.classList.remove('section-motion-child-play'));

    // Force one layout read so CSS animations restart cleanly for the new section.
    void section.offsetWidth;

    section.classList.add('section-motion-current', 'section-motion-play');
    children.forEach(child => child.classList.add('section-motion-child-play'));
  }

  const observer = new IntersectionObserver((entries) => {
    const activeEntry = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (activeEntry) {
      playSection(activeEntry.target);
    }
  }, {
    root: null,
    rootMargin: '-28% 0px -42% 0px',
    threshold: [0.28, 0.45, 0.62]
  });

  sections.forEach(section => observer.observe(section));

  const initialSection = sections.find(section => {
    const rect = section.getBoundingClientRect();
    return rect.top <= window.innerHeight * 0.48 && rect.bottom >= window.innerHeight * 0.34;
  }) || sections[0];

  window.requestAnimationFrame(() => playSection(initialSection));
});

export function initPendidikanAnimation(){
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  if (false) return;

  var eduSection = document.querySelector('#education');
  if (!eduSection) return;

  var badge = eduSection.querySelector('.section-badge');
  var title = eduSection.querySelector('.section-title');
  var subtitle = eduSection.querySelector('.section-subtitle');
  var timelineItems = gsap.utils.toArray('#education .timeline-item');

  gsap.set(badge, { opacity: 0, scale: 0, rotation: -180 });
  gsap.set(title, { opacity: 0, y: 60, filter: 'blur(10px)' });
  gsap.set(subtitle, { opacity: 0, y: 30 });

  timelineItems.forEach(function(item, i){
    var card = item.querySelector('.timeline-card');
    var dot = item.querySelector('.timeline-dot');
    var logo = item.querySelector('.edu-logo');
    var heading = item.querySelector('h3');
    var institution = item.querySelector('.institution');
    var desc = item.querySelector('p:not(.institution)');
    var year = item.querySelector('.timeline-year');

    gsap.set(item, { opacity: 1 });
    if (card) gsap.set(card, {
      opacity: 0, x: i % 2 === 0 ? -60 : 60, rotateY: i % 2 === 0 ? -15 : 15,
      transformPerspective: 1200
    });
    if (dot) gsap.set(dot, { scale: 0, opacity: 0 });
    if (logo) gsap.set(logo, { scale: 0, rotation: -90 });
    if (heading) gsap.set(heading, { opacity: 0, y: 15 });
    if (institution) gsap.set(institution, { opacity: 0, x: -15 });
    if (desc) gsap.set(desc, { opacity: 0, y: 10, filter: 'blur(6px)' });
    if (year) gsap.set(year, { opacity: 0, scale: 0.5 });
  });

  var masterTL = gsap.timeline({
    scrollTrigger: {
      trigger: '#education',
      start: 'top 75%',
      toggleActions: 'play none none none'
    }
  });

  masterTL
    .to(badge, { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
    .to(title, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' }, '-=0.3')
    .to(subtitle, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3');

  timelineItems.forEach(function(item, i){
    var card = item.querySelector('.timeline-card');
    var dot = item.querySelector('.timeline-dot');
    var logo = item.querySelector('.edu-logo');
    var heading = item.querySelector('h3');
    var institution = item.querySelector('.institution');
    var desc = item.querySelector('p:not(.institution)');
    var year = item.querySelector('.timeline-year');

    var pos = i === 0 ? '-=0.1' : '-=0.55';
    if (dot) masterTL.to(dot, { scale: 1, opacity: 1, duration: 0.5, ease: 'elastic.out(1, 0.5)' }, pos);
    if (card) masterTL.to(card, { opacity: 1, x: 0, rotateY: 0, duration: 0.7, ease: 'power4.out' }, '-=0.3');
    if (year) masterTL.to(year, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '-=0.5');
    if (logo) masterTL.to(logo, { scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(2.2)' }, '-=0.4');
    if (heading) masterTL.to(heading, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.4');
    if (institution) masterTL.to(institution, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, '-=0.3');
    if (desc) masterTL.to(desc, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power2.out' }, '-=0.25');
  });

  var timelineEl = eduSection.querySelector('.timeline');
  if (timelineEl) {
    gsap.set(timelineEl, { '--line-progress': '0%' });
    gsap.to(timelineEl, {
      '--line-progress': '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: timelineEl,
        start: 'top 80%',
        end: 'bottom 40%',
        scrub: 1.2
      }
    });
  }

  timelineItems.forEach(function(item){
    var card = item.querySelector('.timeline-card');
    var dot = item.querySelector('.timeline-dot');
    var logo = item.querySelector('.edu-logo');
    if (!card) return;

    card.addEventListener('mouseenter', function(){
      gsap.to(card, {
        y: -8, scale: 1.02,
        boxShadow: '0 20px 50px rgba(15, 94, 168, 0.15)',
        duration: 0.4, ease: 'power2.out'
      });
      if (dot) gsap.to(dot, { scale: 1.4, duration: 0.3, ease: 'back.out(2)' });
      if (logo) gsap.to(logo, { rotation: 10, scale: 1.1, duration: 0.4, ease: 'power2.out' });
    });

    card.addEventListener('mouseleave', function(){
      gsap.to(card, {
        y: 0, scale: 1,
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        duration: 0.5, ease: 'power2.out'
      });
      if (dot) gsap.to(dot, { scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
      if (logo) gsap.to(logo, { rotation: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
    });
  });

  var ppgDot = eduSection.querySelector('.ppg-era .timeline-dot');
  if (ppgDot) {
    gsap.to(ppgDot, {
      boxShadow: '0 0 30px rgba(46, 196, 182, 0.7), 0 0 50px rgba(15, 94, 168, 0.4)',
      duration: 1.8, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });
  }

  var badgeOngoing = eduSection.querySelector('.badge-ongoing');
  if (badgeOngoing) {
    gsap.to(badgeOngoing, {
      opacity: 0.5, scale: 0.95,
      duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });
  }
}

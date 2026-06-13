export function initKeahlianAnimation(){
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  if (false) return;

  var section = document.querySelector('#skills');
  if (!section) return;

  var badge = section.querySelector('.section-badge');
  var title = section.querySelector('.section-title');
  var subtitle = section.querySelector('.section-subtitle');
  var tabBtns = gsap.utils.toArray('#skills .skills-tab-btn');
  var activePanel = section.querySelector('.skills-panel.active');
  var activeCards = activePanel ? gsap.utils.toArray(activePanel.querySelectorAll('.skill-item-card')) : [];

  gsap.set(badge, { opacity: 0, scale: 0, rotation: -180 });
  gsap.set(title, { opacity: 0, y: 60, filter: 'blur(10px)' });
  gsap.set(subtitle, { opacity: 0, y: 30 });
  gsap.set(tabBtns, { opacity: 0, y: -20, scale: 0.8 });
  gsap.set(activeCards, { opacity: 0, y: 50, scale: 0.8, rotateX: 12, transformPerspective: 1000 });

  gsap.timeline({
    scrollTrigger: {
      trigger: '#skills',
      start: 'top 75%',
      toggleActions: 'play none none none'
    }
  })
  .to(badge, { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
  .to(title, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' }, '-=0.3')
  .to(subtitle, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
  .to(tabBtns, { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.08, ease: 'back.out(1.7)' }, '-=0.3')
  .to(activeCards, {
    opacity: 1, y: 0, scale: 1, rotateX: 0,
    duration: 0.6, stagger: 0.1, ease: 'back.out(1.4)'
  }, '-=0.3');

  function animateSkillCards(){
    var panel = section.querySelector('.skills-panel.active');
    if (!panel) return;
    var cards = panel.querySelectorAll('.skill-item-card');
    gsap.fromTo(cards,
      { opacity: 0, y: 40, scale: 0.85 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, stagger: 0.09, ease: 'back.out(1.4)', overwrite: 'auto' }
    );
  }

  section.querySelectorAll('.skills-tab-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      gsap.fromTo(btn, { scale: 1 }, { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' });
      setTimeout(animateSkillCards, 80);
    });
  });

  section.querySelectorAll('.skill-item-card').forEach(function(card){
    var icon = card.querySelector('.skill-item-icon');
    var badge = card.querySelector('.skill-item-badge');

    card.addEventListener('mouseenter', function(){
      gsap.to(card, {
        y: -8, scale: 1.05,
        boxShadow: '0 16px 40px rgba(15, 94, 168, 0.15)',
        duration: 0.4, ease: 'power2.out'
      });
      if (icon) gsap.to(icon, { scale: 1.2, rotation: 10, duration: 0.4, ease: 'back.out(2)' });
      if (badge) gsap.to(badge, { scale: 1.1, y: -2, duration: 0.3, ease: 'power2.out' });
    });

    card.addEventListener('mouseleave', function(){
      gsap.to(card, {
        y: 0, scale: 1,
        boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
        duration: 0.5, ease: 'power2.out'
      });
      if (icon) gsap.to(icon, { scale: 1, rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      if (badge) gsap.to(badge, { scale: 1, y: 0, duration: 0.3, ease: 'power2.out' });
    });
  });

  section.querySelectorAll('.skills-tab-btn').forEach(function(btn){
    btn.addEventListener('mouseenter', function(){
      gsap.to(btn, { y: -3, scale: 1.05, duration: 0.3, ease: 'back.out(2)' });
    });
    btn.addEventListener('mouseleave', function(){
      gsap.to(btn, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
    });
  });
}

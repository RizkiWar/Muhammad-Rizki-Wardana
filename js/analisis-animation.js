export function initAnalisisAnimation(){
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  var section = document.querySelector('#analisis');
  if (!section) return;

  var badge = section.querySelector('.section-badge');
  var title = section.querySelector('.section-title');
  var subtitle = section.querySelector('.section-subtitle');
  var cards = gsap.utils.toArray(section.querySelectorAll('.analisis-card'));

  if (badge) gsap.set(badge, { opacity: 0, scale: 0.6, rotation: -20 });
  if (title) gsap.set(title, { opacity: 0, y: 30, filter: 'blur(8px)' });
  if (subtitle) gsap.set(subtitle, { opacity: 0, y: 18 });

  cards.forEach(function(card){
    var icon = card.querySelector('.analisis-icon');
    var tag = card.querySelector('.analisis-tag');
    var heading = card.querySelector('h3');
    var paragraph = card.querySelector('p');

    gsap.set(card, { opacity: 0, y: 40, scale: 0.96 });
    if (icon) gsap.set(icon, { opacity: 0, scale: 0.4, rotation: -90 });
    if (tag) gsap.set(tag, { opacity: 0, x: -10 });
    if (heading) gsap.set(heading, { opacity: 0, y: 12 });
    if (paragraph) gsap.set(paragraph, { opacity: 0, y: 12 });
  });

  var headerTL = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: 'top 88%',
      toggleActions: 'play none none none'
    }
  });

  if (badge) headerTL.to(badge, { opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.7)' });
  if (title) headerTL.to(title, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' }, '-=0.25');
  if (subtitle) headerTL.to(subtitle, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.25');

  cards.forEach(function(card, index){
    var icon = card.querySelector('.analisis-icon');
    var tag = card.querySelector('.analisis-tag');
    var heading = card.querySelector('h3');
    var paragraph = card.querySelector('p');

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 90%',
        toggleActions: 'play none none none'
      }
    });

    tl.to(card, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'power3.out' });
    if (icon) tl.to(icon, { opacity: 1, scale: 1, rotation: 0, duration: 0.55, ease: 'back.out(1.8)' }, '-=0.35');
    if (tag) tl.to(tag, { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out' }, '-=0.35');
    if (heading) tl.to(heading, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, '-=0.3');
    if (paragraph) tl.to(paragraph, { opacity: 1, y: 0, duration: 0.45, ease: 'power2.out' }, '-=0.3');
  });

  cards.forEach(function(card){
    var icon = card.querySelector('.analisis-icon');
    card.addEventListener('mouseenter', function(){
      gsap.to(card, { y: -8, duration: 0.35, ease: 'power2.out' });
      if (icon) gsap.to(icon, { scale: 1.12, rotation: 6, duration: 0.4, ease: 'back.out(2)' });
    });
    card.addEventListener('mouseleave', function(){
      gsap.to(card, { y: 0, duration: 0.4, ease: 'power2.out' });
      if (icon) gsap.to(icon, { scale: 1, rotation: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

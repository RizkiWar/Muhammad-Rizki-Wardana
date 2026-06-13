export function initProfilAnimation(){
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  if (false) return;

  var aboutSection = document.querySelector('#about');
  if (!aboutSection) return;

  var badge = aboutSection.querySelector('.section-badge');
  var title = aboutSection.querySelector('.section-title');
  var subtitle = aboutSection.querySelector('.section-subtitle');
  var imageCard = document.querySelector('.about-image-card');
  var imageCardImg = imageCard ? imageCard.querySelector('img') : null;
  var stats = gsap.utils.toArray('.about-stat');
  var infoItems = gsap.utils.toArray('.about-info-item');
  var quote = document.querySelector('.profil-quote');
  var narasis = gsap.utils.toArray('.profil-narasi');

  gsap.set(badge, { opacity: 0, scale: 0, rotation: -180 });
  gsap.set(title, { opacity: 0, y: 60, filter: 'blur(10px)' });
  gsap.set(subtitle, { opacity: 0, y: 30 });
  gsap.set(imageCard, { opacity: 0, y: 40 });
  gsap.set(stats, { opacity: 0, y: 60, scale: 0.5 });
  gsap.set(infoItems, { opacity: 0, x: -40, scale: 0.9 });
  if (quote) gsap.set(quote, { opacity: 0, scale: 0.8, filter: 'blur(12px)' });
  narasis.forEach(function(n){ gsap.set(n, { opacity: 0, y: 60 }); });

  var masterTL = gsap.timeline({
    scrollTrigger: {
      trigger: '#about',
      start: 'top 75%',
      toggleActions: 'play none none none'
    }
  });

  masterTL
    .to(badge, { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
    .to(title, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' }, '-=0.3')
    .to(subtitle, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
    .to(imageCard, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.3')
    .to(stats, { opacity: 1, y: 0, scale: 1, duration: 0.7, stagger: 0.12, ease: 'elastic.out(1, 0.6)' }, '-=0.5')
    .to(infoItems, { opacity: 1, x: 0, scale: 1, duration: 0.6, stagger: 0.1, ease: 'power3.out' }, '-=0.4');

  if (quote) {
    masterTL.to(quote, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.8, ease: 'power4.out' }, '-=0.3');
  }

  if (narasis.length) {
    masterTL.to(narasis, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out' }, '-=0.3');
  }

  var lifeTimeline = document.querySelector('.life-timeline');
  if (lifeTimeline) {
    var lifeTitle = lifeTimeline.querySelector('.life-timeline-title');
    var lifeSteps = gsap.utils.toArray('.life-step');
    var lifeLines = gsap.utils.toArray('.life-step-line');

    if (lifeTitle) gsap.set(lifeTitle, { opacity: 0, y: 30 });
    gsap.set(lifeSteps, { opacity: 0, y: 40, scale: 0 });
    gsap.set(lifeLines, { scaleX: 0, transformOrigin: 'left center' });

    gsap.timeline({
      scrollTrigger: {
        trigger: '.life-timeline',
        start: 'top 80%',
        toggleActions: 'play none none none'
      }
    })
    .to(lifeTitle, { opacity: 1, y: 0, duration: 0.6, ease: 'back.out(1.5)' })
    .to(lifeSteps, { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15, ease: 'elastic.out(1, 0.6)' }, '-=0.2')
    .to(lifeLines, { scaleX: 1, duration: 0.4, stagger: 0.15, ease: 'power2.inOut' }, '-=0.6');
  }

  // Hover: simple scale on card, no 3D tilt
  if (imageCard && window.innerWidth > 768) {
    imageCard.addEventListener('mouseenter', function(){
      gsap.to(imageCard, { scale: 1.02, boxShadow: '0 20px 50px rgba(15, 94, 168, 0.2)', duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
      if (imageCardImg) gsap.to(imageCardImg, { scale: 1.05, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
    });
    imageCard.addEventListener('mouseleave', function(){
      gsap.to(imageCard, { scale: 1, boxShadow: '0 4px 20px rgba(0,0,0,0.06)', duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
      if (imageCardImg) gsap.to(imageCardImg, { scale: 1, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
    });
  }

  document.querySelectorAll('.about-stat').forEach(function(stat){
    var svg = stat.querySelector('svg');
    stat.addEventListener('mouseenter', function(){
      gsap.to(stat, { y: -4, scale: 1.05, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      if (svg) gsap.to(svg, { rotation: 10, scale: 1.1, duration: 0.3, overwrite: 'auto' });
    });
    stat.addEventListener('mouseleave', function(){
      gsap.to(stat, { y: 0, scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
      if (svg) gsap.to(svg, { rotation: 0, scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
    });
  });

  document.querySelectorAll('.about-info-item').forEach(function(item){
    var icon = item.querySelector('.info-icon');
    item.addEventListener('mouseenter', function(){
      gsap.to(item, { x: 10, duration: 0.35, ease: 'power3.out' });
      if (icon) gsap.to(icon, { rotation: 360, scale: 1.2, duration: 0.6, ease: 'back.out(2)' });
    });
    item.addEventListener('mouseleave', function(){
      gsap.to(item, { x: 0, duration: 0.35, ease: 'power3.out' });
      if (icon) gsap.to(icon, { rotation: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
    });
  });

  document.querySelectorAll('.life-step').forEach(function(step){
    var dot = step.querySelector('.life-step-dot');
    var label = step.querySelector('.life-step-label');
    if (!dot) return;
    step.addEventListener('mouseenter', function(){
      gsap.to(dot, { scale: 1.4, y: -6, duration: 0.4, ease: 'back.out(2)' });
      if (label) gsap.to(label, { y: -3, scale: 1.08, duration: 0.3, ease: 'power2.out' });
    });
    step.addEventListener('mouseleave', function(){
      gsap.to(dot, { scale: 1, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
      if (label) gsap.to(label, { y: 0, scale: 1, duration: 0.3, ease: 'power2.out' });
    });
  });

  gsap.utils.toArray('.life-step-dot').forEach(function(dot, i){
    gsap.to(dot, { scale: 1.06, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: i * 0.3 });
  });

  var activeDot = document.querySelector('.life-step.active .life-step-dot');
  if (activeDot) {
    gsap.to(activeDot, {
      boxShadow: '0 0 30px rgba(46, 196, 182, 0.8), 0 0 50px rgba(15, 94, 168, 0.4)',
      duration: 1.5, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });
  }
}

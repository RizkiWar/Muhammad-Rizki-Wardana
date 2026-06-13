export function initArtefakAnimation(){
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  if (false) return;

  var portfolioSection = document.querySelector('#portfolio');
  if (!portfolioSection) return;

  var badge = portfolioSection.querySelector('.section-badge');
  var title = portfolioSection.querySelector('.section-title');
  var subtitle = portfolioSection.querySelector('.section-subtitle');
  var tabBtns = gsap.utils.toArray('#portfolio .tab-btn');
  var filterBtns = gsap.utils.toArray('#portfolio .filter-btn');
  var allCards = gsap.utils.toArray('#portfolio .portfolio-card');

  gsap.set(badge, { opacity: 0, scale: 0, rotation: -180 });
  gsap.set(title, { opacity: 0, y: 60, filter: 'blur(10px)' });
  gsap.set(subtitle, { opacity: 0, y: 30 });
  gsap.set(tabBtns, { opacity: 0, y: -20, scale: 0.8 });
  gsap.set(filterBtns, { opacity: 0, y: 20, scale: 0.8 });
  gsap.set(allCards, { opacity: 0, y: 50, scale: 0.85, rotateX: 12, transformPerspective: 1000 });

  gsap.timeline({
    scrollTrigger: {
      trigger: '#portfolio',
      start: 'top 75%',
      toggleActions: 'play none none none'
    }
  })
  .to(badge, { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
  .to(title, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' }, '-=0.3')
  .to(subtitle, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
  .to(tabBtns, { opacity: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.07, ease: 'back.out(1.7)' }, '-=0.3')
  .to(filterBtns, { opacity: 1, y: 0, scale: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(1.7)' }, '-=0.3')
  .to(allCards, {
    opacity: 1, y: 0, scale: 1, rotateX: 0,
    duration: 0.7, stagger: { each: 0.07, from: 'start' }, ease: 'power3.out'
  }, '-=0.3');

  function reanimateVisibleCards(){
    var visible = portfolioSection.querySelectorAll('.portfolio-card:not([style*="display: none"])');
    if (!visible.length) return;
    gsap.fromTo(visible,
      { opacity: 0, scale: 0.85, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.55, stagger: 0.05, ease: 'back.out(1.4)', overwrite: 'auto' }
    );
  }

  tabBtns.concat(filterBtns).forEach(function(btn){
    btn.addEventListener('click', function(){
      gsap.fromTo(btn, { scale: 1 }, { scale: 1.08, duration: 0.15, yoyo: true, repeat: 1, ease: 'power2.out' });
      setTimeout(reanimateVisibleCards, 80);
    });
  });

  document.querySelectorAll('#portfolio .portfolio-card').forEach(function(card){
    var img = card.querySelector('.portfolio-card-img img');
    var tag = card.querySelector('.card-tag');

    card.addEventListener('mouseenter', function(){
      gsap.to(card, {
        y: -10, scale: 1.03,
        boxShadow: '0 25px 60px rgba(15, 94, 168, 0.18)',
        duration: 0.4, ease: 'power2.out'
      });
      if (img) gsap.to(img, { scale: 1.1, duration: 0.6, ease: 'power2.out' });
      if (tag) gsap.to(tag, { scale: 1.1, y: -2, duration: 0.3, ease: 'back.out(2)' });
    });

    card.addEventListener('mouseleave', function(){
      gsap.to(card, {
        y: 0, scale: 1,
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        duration: 0.5, ease: 'power2.out'
      });
      if (img) gsap.to(img, { scale: 1, duration: 0.6, ease: 'power2.out' });
      if (tag) gsap.to(tag, { scale: 1, y: 0, duration: 0.3, ease: 'power2.out' });
    });

    if (window.innerWidth > 768) {
      var rafId = null;
      var lastEvent = null;
      var rect = null;
      card.addEventListener('mouseenter', function(){
        rect = card.getBoundingClientRect();
      });
      card.addEventListener('mousemove', function(e){
        lastEvent = e;
        if (rafId) return;
        rafId = requestAnimationFrame(function(){
          if (!rect) rect = card.getBoundingClientRect();
          var x = (lastEvent.clientX - rect.left) / rect.width - 0.5;
          var y = (lastEvent.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, {
            rotateY: x * 8, rotateX: -y * 8,
            duration: 0.45, ease: 'power2.out',
            transformPerspective: 1000, overwrite: 'auto'
          });
          rafId = null;
        });
      });

      card.addEventListener('mouseleave', function(){
        rect = null;
        if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
      });
    }
  });

  document.querySelectorAll('#portfolio .tab-btn, #portfolio .filter-btn').forEach(function(btn){
    btn.addEventListener('mouseenter', function(){
      gsap.to(btn, { y: -3, scale: 1.05, duration: 0.3, ease: 'back.out(2)' });
    });
    btn.addEventListener('mouseleave', function(){
      gsap.to(btn, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
    });
  });

  document.querySelectorAll('#portfolio .portfolio-card-img').forEach(function(imgWrap){
    var overlay = imgWrap.querySelector('.card-img-overlay');
    if (!overlay) return;
    imgWrap.addEventListener('mouseenter', function(){
      gsap.fromTo(overlay,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' }
      );
    });
    imgWrap.addEventListener('mouseleave', function(){
      gsap.to(overlay, { y: 30, opacity: 0, duration: 0.3, ease: 'power2.in' });
    });
  });
}

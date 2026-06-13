export function initModelGuruAnimation(){
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  if (false) return;

  var section = document.querySelector('#model-guru');
  if (!section) return;

  var badge = section.querySelector('.section-badge');
  var title = section.querySelector('.section-title');
  var subtitle = section.querySelector('.section-subtitle');
  var quoteCard = section.querySelector('.philosophy-card');
  var quoteIcon = quoteCard ? quoteCard.querySelector('.quote-icon') : null;
  var blockquote = quoteCard ? quoteCard.querySelector('blockquote') : null;
  var author = quoteCard ? quoteCard.querySelector('.philosophy-author') : null;
  var pillars = gsap.utils.toArray('#model-guru .pillar-card');

  gsap.set(badge, { opacity: 0, scale: 0, rotation: -180 });
  gsap.set(title, { opacity: 0, y: 60, filter: 'blur(10px)' });
  gsap.set(subtitle, { opacity: 0, y: 30 });
  if (quoteCard) gsap.set(quoteCard, { opacity: 0, scale: 0.85, rotateX: 18, transformPerspective: 1000 });
  if (quoteIcon) gsap.set(quoteIcon, { opacity: 0, scale: 0, rotation: -90 });
  if (blockquote) gsap.set(blockquote, { opacity: 0, y: 20 });
  if (author) gsap.set(author, { opacity: 0, x: -20 });

  pillars.forEach(function(card, i){
    var icon = card.querySelector('.pillar-icon');
    var heading = card.querySelector('h4');
    var desc = card.querySelector('p');
    gsap.set(card, {
      opacity: 0, y: 60, scale: 0.85,
      rotateY: i % 2 === 0 ? -15 : 15, transformPerspective: 1200
    });
    if (icon) gsap.set(icon, { opacity: 0, scale: 0, rotation: -180 });
    if (heading) gsap.set(heading, { opacity: 0, y: 12 });
    if (desc) gsap.set(desc, { opacity: 0, y: 10, filter: 'blur(6px)' });
  });

  var masterTL = gsap.timeline({
    scrollTrigger: {
      trigger: '#model-guru',
      start: 'top 75%',
      toggleActions: 'play none none none'
    }
  });

  masterTL
    .to(badge, { opacity: 1, scale: 1, rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' })
    .to(title, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.5, ease: 'power3.out' }, '-=0.3')
    .to(subtitle, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.3');

  if (quoteCard) {
    masterTL.to(quoteCard, { opacity: 1, scale: 1, rotateX: 0, duration: 0.6, ease: 'power4.out' }, '-=0.2');
    if (quoteIcon) masterTL.to(quoteIcon, { opacity: 1, scale: 1, rotation: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' }, '-=0.4');
    if (blockquote) masterTL.to(blockquote, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' }, '-=0.3');
    if (author) masterTL.to(author, { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }, '-=0.2');
  }

  if (pillars.length) {
    masterTL.to(pillars, {
      opacity: 1, y: 0, scale: 1, rotateY: 0,
      duration: 0.5, stagger: 0.08, ease: 'power4.out'
    }, '-=0.2');
    masterTL.to('#model-guru .pillar-icon', {
      opacity: 1, scale: 1, rotation: 0,
      duration: 0.4, stagger: 0.08, ease: 'back.out(2.3)'
    }, '-=0.4');
    masterTL.to('#model-guru .pillar-card h4', {
      opacity: 1, y: 0, duration: 0.3, stagger: 0.06, ease: 'power2.out'
    }, '-=0.35');
    masterTL.to('#model-guru .pillar-card p', {
      opacity: 1, y: 0, filter: 'blur(0px)',
      duration: 0.35, stagger: 0.06, ease: 'power2.out'
    }, '-=0.3');
  }

  pillars.forEach(function(card){
    var icon = card.querySelector('.pillar-icon');

    card.addEventListener('mouseenter', function(){
      gsap.to(card, {
        y: -10, scale: 1.04,
        boxShadow: '0 20px 50px rgba(15, 94, 168, 0.18)',
        duration: 0.4, ease: 'power2.out'
      });
      if (icon) gsap.to(icon, { scale: 1.3, rotation: 10, duration: 0.4, ease: 'back.out(2)' });
    });

    card.addEventListener('mouseleave', function(){
      gsap.to(card, {
        y: 0, scale: 1,
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        duration: 0.5, ease: 'power2.out'
      });
      if (icon) gsap.to(icon, { scale: 1, rotation: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });

    if (window.innerWidth > 768) {
      var tiltRaf = null;
      var tiltLastEvent = null;
      var rect = null;
      card.addEventListener('mouseenter', function(){
        rect = card.getBoundingClientRect();
      });
      card.addEventListener('mousemove', function(e){
        tiltLastEvent = e;
        if (tiltRaf) return;
        tiltRaf = requestAnimationFrame(function(){
          if (!rect) rect = card.getBoundingClientRect();
          var x = (tiltLastEvent.clientX - rect.left) / rect.width - 0.5;
          var y = (tiltLastEvent.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, {
            rotateY: x * 10, rotateX: -y * 10,
            duration: 0.4, ease: 'power2.out',
            transformPerspective: 1000, overwrite: 'auto'
          });
          tiltRaf = null;
        });
      });
      card.addEventListener('mouseleave', function(){
        rect = null;
        if (tiltRaf) { cancelAnimationFrame(tiltRaf); tiltRaf = null; }
        gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' });
      });
    }
  });

  if (quoteCard) {
    quoteCard.addEventListener('mouseenter', function(){
      gsap.to(quoteCard, {
        y: -6, scale: 1.02,
        boxShadow: '0 20px 50px rgba(155, 114, 207, 0.15)',
        duration: 0.4, ease: 'power2.out'
      });
    });
    quoteCard.addEventListener('mouseleave', function(){
      gsap.to(quoteCard, {
        y: 0, scale: 1,
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
        duration: 0.5, ease: 'power2.out'
      });
    });
  }

  pillars.forEach(function(card, i){
    var icon = card.querySelector('.pillar-icon');
    if (!icon) return;
    var hasSvg = icon.querySelector('svg');
    if (!hasSvg && !icon.querySelector('.icon-inner')) {
      var inner = document.createElement('span');
      inner.className = 'icon-inner';
      inner.style.display = 'inline-block';
      inner.textContent = icon.textContent;
      icon.textContent = '';
      icon.appendChild(inner);
    }
    var inner = icon.querySelector('.icon-inner');
    if (!inner) return;

    if (i === 0) {
      gsap.to(inner, { y: -4, duration: 2.5, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    } else if (i === 1) {
      gsap.to(inner, { rotateZ: 360, duration: 8, repeat: -1, ease: 'none' });
    } else if (i === 2) {
      gsap.to(inner, { y: -3, duration: 2.2, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    } else if (i === 3) {
      gsap.to(inner, { rotateY: 360, duration: 4, repeat: -1, ease: 'none', transformOrigin: 'center center' });
    }
  });

  if (quoteCard) {
    gsap.to(quoteCard, {
      boxShadow: '0 8px 40px rgba(155, 114, 207, 0.18), 0 0 60px rgba(57, 189, 235, 0.08)',
      duration: 3.5, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });
  }

  var ppgActiveDot = section.querySelector('.active-dot, .ppg-active');
  if (ppgActiveDot) {
    gsap.to(ppgActiveDot, {
      boxShadow: '0 0 24px rgba(46, 196, 182, 0.7)',
      duration: 1.6, repeat: -1, yoyo: true, ease: 'sine.inOut'
    });
  }
}

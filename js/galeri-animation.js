export function initGaleriAnimation(){
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  if (false) return;

  var section = document.querySelector('#gallery');
  if (!section) return;

  var badge = section.querySelector('.section-badge');
  var title = section.querySelector('.section-title');
  var subtitle = section.querySelector('.section-subtitle');
  var items = gsap.utils.toArray('#gallery .gallery-item');

  gsap.set(badge, { opacity: 0, scale: 0, rotation: -180 });
  gsap.set(title, { opacity: 0, y: 60, filter: 'blur(10px)' });
  gsap.set(subtitle, { opacity: 0, y: 30 });
  gsap.set(items, { opacity: 0, scale: 0.85, y: 40 });

  gsap.timeline({
    scrollTrigger: {
      trigger: '#gallery',
      start: 'top 80%',
      toggleActions: 'play none none none'
    }
  })
  .to(badge, { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: 'elastic.out(1, 0.5)' })
  .to(title, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' }, '-=0.3')
  .to(subtitle, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
  .to(items, {
    opacity: 1, scale: 1, y: 0,
    duration: 0.7, stagger: 0.12, ease: 'back.out(1.4)'
  }, '-=0.3');

  items.forEach(function(item){
    var img = item.querySelector('img');
    var caption = item.querySelector('.gallery-caption');

    item.addEventListener('mouseenter', function(){
      gsap.to(item, {
        scale: 1.03, y: -6,
        boxShadow: '0 20px 50px rgba(15, 94, 168, 0.2)',
        duration: 0.4, ease: 'power2.out'
      });
      if (img) gsap.to(img, { scale: 1.1, duration: 0.6, ease: 'power2.out' });
      if (caption) gsap.to(caption, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out' });
    });

    item.addEventListener('mouseleave', function(){
      gsap.to(item, {
        scale: 1, y: 0,
        boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
        duration: 0.5, ease: 'power2.out'
      });
      if (img) gsap.to(img, { scale: 1, duration: 0.6, ease: 'power2.out' });
      if (caption) gsap.to(caption, { y: 20, opacity: 0.8, duration: 0.3, ease: 'power2.in' });
    });
  });

  var lightbox = document.getElementById('galleryLightbox');
  var lightboxContent = document.getElementById('lightboxContent');
  var lightboxCaption = document.getElementById('lightboxCaption');
  var closeBtn = lightbox ? lightbox.querySelector('.lightbox-close') : null;
  var prevBtn = lightbox ? lightbox.querySelector('.lightbox-prev') : null;
  var nextBtn = lightbox ? lightbox.querySelector('.lightbox-next') : null;
  var currentIndex = 0;

  // Move lightbox to body so position:fixed is relative to viewport,
  // not to any ancestor with transform/filter/isolation that creates
  // a containing block.
  if (lightbox && lightbox.parentNode !== document.body) {
    document.body.appendChild(lightbox);
  }

  function updateLightboxContent(){
    var item = items[currentIndex];
    if (!item) return;
    var type = item.getAttribute('data-type');
    var imgEl = item.querySelector('img');
    var src = (imgEl && imgEl.src) ? imgEl.src : item.getAttribute('data-src');
    var caption = item.querySelector('.gallery-caption');
    var titleText = caption ? (caption.querySelector('h3') ? caption.querySelector('h3').textContent : '') : '';
    var desc = caption ? (caption.querySelector('p') ? caption.querySelector('p').textContent : '') : '';

    if (type === 'video') {
      lightboxContent.innerHTML = '<iframe src="' + src + '" style="width:100%;height:70vh;border:none;border-radius:12px;" allowfullscreen></iframe>';
    } else {
      lightboxContent.innerHTML = '<img src="' + src + '" alt="' + titleText + '" style="max-width:100%;max-height:80vh;border-radius:12px;object-fit:contain;" />';
    }
    if (lightboxCaption) lightboxCaption.innerHTML = '<h3>' + titleText + '</h3><p>' + desc + '</p>';
  }

  var savedScrollY = 0;

  function lockScroll(){
    savedScrollY = window.scrollY || window.pageYOffset || 0;
    document.body.style.top = '-' + savedScrollY + 'px';
    document.body.classList.add('lightbox-open');
    document.documentElement.classList.add('lightbox-open');
  }

  function unlockScroll(){
    var html = document.documentElement;
    var prev = html.style.scrollBehavior;
    html.style.scrollBehavior = 'auto';
    document.body.classList.remove('lightbox-open');
    html.classList.remove('lightbox-open');
    document.body.style.top = '';
    window.scrollTo(0, savedScrollY);
    requestAnimationFrame(function(){
      html.style.scrollBehavior = prev;
    });
  }

  function openLightbox(index){
    if (!lightbox) return;
    currentIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    lockScroll();
    var navbar = document.getElementById('navbar');
    var scrollProg = document.getElementById('scrollProgress');
    var scrollRail = document.querySelector('.scroll-rail');
    if (navbar) navbar.style.display = 'none';
    if (scrollProg) scrollProg.style.display = 'none';
    if (scrollRail) scrollRail.style.display = 'none';

    gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
    gsap.fromTo(lightboxContent, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)', delay: 0.1 });
  }

  function closeLightbox(){
    if (!lightbox) return;
    gsap.to(lightbox, {
      opacity: 0, duration: 0.3, ease: 'power2.in',
      onComplete: function(){
        lightbox.classList.remove('active');
        lightbox.setAttribute('aria-hidden', 'true');
        unlockScroll();
        var navbar = document.getElementById('navbar');
        var scrollProg = document.getElementById('scrollProgress');
        var scrollRail = document.querySelector('.scroll-rail');
        if (navbar) navbar.style.display = '';
        if (scrollProg) scrollProg.style.display = '';
        if (scrollRail) scrollRail.style.display = '';
        lightboxContent.innerHTML = '';
      }
    });
  }

  function nextSlide(){
    currentIndex = (currentIndex + 1) % items.length;
    gsap.to(lightboxContent, {
      x: -30, opacity: 0, duration: 0.2,
      onComplete: function(){
        updateLightboxContent();
        gsap.fromTo(lightboxContent, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
      }
    });
  }

  function prevSlide(){
    currentIndex = (currentIndex - 1 + items.length) % items.length;
    gsap.to(lightboxContent, {
      x: 30, opacity: 0, duration: 0.2,
      onComplete: function(){
        updateLightboxContent();
        gsap.fromTo(lightboxContent, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
      }
    });
  }

  items.forEach(function(item, i){
    item.addEventListener('click', function(){ openLightbox(i); });
    item.style.cursor = 'pointer';
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  // Video hero (above accordion)
  var videoHero = document.querySelector('.gallery-video-hero');
  if (videoHero && lightbox && lightboxContent) {
    function openVideoHero(){
      var src = videoHero.getAttribute('data-src');
      var titleEl = videoHero.querySelector('.gallery-video-text h3');
      var descEl = videoHero.querySelector('.gallery-video-text p');
      var titleText = titleEl ? titleEl.textContent : '';
      var desc = descEl ? descEl.textContent : '';
      lightboxContent.innerHTML = '<iframe src="' + src + '" style="width:100%;height:70vh;border:none;border-radius:12px;" allowfullscreen></iframe>';
      if (lightboxCaption) lightboxCaption.innerHTML = '<h3>' + titleText + '</h3><p>' + desc + '</p>';
      lightbox.classList.add('active');
      lightbox.setAttribute('aria-hidden', 'false');
      lockScroll();
      var navbar = document.getElementById('navbar');
      var scrollProg = document.getElementById('scrollProgress');
      var scrollRail = document.querySelector('.scroll-rail');
      if (navbar) navbar.style.display = 'none';
      if (scrollProg) scrollProg.style.display = 'none';
      if (scrollRail) scrollRail.style.display = 'none';
      gsap.fromTo(lightbox, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      gsap.fromTo(lightboxContent, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.5)', delay: 0.1 });
    }
    videoHero.addEventListener('click', openVideoHero);
    videoHero.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openVideoHero(); }
    });
  }

  if (lightbox) {
    lightbox.addEventListener('click', function(e){
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', function(e){
    if (!lightbox || !lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') prevSlide();
  });
}

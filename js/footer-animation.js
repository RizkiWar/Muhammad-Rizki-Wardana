export function initFooterAnimation(){
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  if (false) return;

  var footer = document.querySelector('.footer');
  if (!footer) return;

  var logo = footer.querySelector('.footer-logo');
  var tagline = footer.querySelector('.footer-tagline');
  var socialLinks = gsap.utils.toArray(footer.querySelectorAll('.footer-social a'));
  var sitemap = footer.querySelector('.footer-sitemap');
  var sitemapLinks = gsap.utils.toArray(footer.querySelectorAll('.footer-sitemap a'));
  var bottomText = footer.querySelector('.footer-bottom p');

  if (logo) gsap.set(logo, { opacity: 0, y: 30 });
  if (tagline) gsap.set(tagline, { opacity: 0, y: 20 });
  gsap.set(socialLinks, { opacity: 0, scale: 0, rotation: -90 });
  if (sitemap) gsap.set(sitemap, { opacity: 0, x: 30 });
  if (bottomText) gsap.set(bottomText, { opacity: 0, y: 15 });

  function buildTimeline(){
    var tl = gsap.timeline();
    if (logo) tl.to(logo, { opacity: 1, y: 0, duration: 0.4, ease: 'power3.out' });
    if (tagline) tl.to(tagline, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.25');
    if (socialLinks.length) tl.to(socialLinks, { opacity: 1, scale: 1, rotation: 0, duration: 0.4, stagger: 0.05, ease: 'back.out(2)' }, '-=0.25');
    if (sitemap) tl.to(sitemap, { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' }, '-=0.3');
    if (bottomText) tl.to(bottomText, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '-=0.2');
    return tl;
  }

  function showInstant(){
    if (logo) gsap.set(logo, { opacity: 1, y: 0 });
    if (tagline) gsap.set(tagline, { opacity: 1, y: 0 });
    gsap.set(socialLinks, { opacity: 1, scale: 1, rotation: 0 });
    if (sitemap) gsap.set(sitemap, { opacity: 1, x: 0 });
    if (bottomText) gsap.set(bottomText, { opacity: 1, y: 0 });
  }

  var played = false;
  function play(){
    if (played) return;
    played = true;
    buildTimeline();
  }

  var rect = footer.getBoundingClientRect();
  var vh = window.innerHeight || document.documentElement.clientHeight;
  if (rect.top < vh) {
    showInstant();
    played = true;
  } else if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          play();
          io.disconnect();
        }
      });
    }, { threshold: 0, rootMargin: '0px 0px 10% 0px' });
    io.observe(footer);
  } else {
    showInstant();
  }

  setTimeout(function(){
    if (!played) {
      var r = footer.getBoundingClientRect();
      if (r.top < (window.innerHeight + 200)) showInstant();
    }
  }, 1500);

  sitemapLinks.forEach(function(link){
    link.addEventListener('mouseenter', function(){
      gsap.to(link, { x: 6, color: '#2EC4B6', duration: 0.3, ease: 'power2.out' });
    });
    link.addEventListener('mouseleave', function(){
      gsap.to(link, { x: 0, color: '', duration: 0.3, ease: 'power2.out' });
    });
  });

  socialLinks.forEach(function(link){
    link.addEventListener('mouseenter', function(){
      gsap.to(link, { y: -4, scale: 1.15, duration: 0.3, ease: 'back.out(2)' });
    });
    link.addEventListener('mouseleave', function(){
      gsap.to(link, { y: 0, scale: 1, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

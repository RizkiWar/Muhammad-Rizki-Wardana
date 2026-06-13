export function initKontakAnimation(){
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);
  if (false) return;

  var section = document.querySelector('#contact');
  if (!section) return;

  var badge = section.querySelector('.section-badge');
  var title = section.querySelector('.section-title');
  var subtitle = section.querySelector('.section-subtitle');
  var contactInfo = section.querySelector('.contact-info');
  var contactForm = section.querySelector('.contact-form');

  gsap.set(badge, { opacity: 0, scale: 0, rotation: -180 });
  gsap.set(title, { opacity: 0, y: 60, filter: 'blur(10px)' });
  gsap.set(subtitle, { opacity: 0, y: 30 });

  var infoHeading = contactInfo ? contactInfo.querySelector('h3') : null;
  var infoDesc = contactInfo ? contactInfo.querySelector('p') : null;
  var detailItems = contactInfo ? gsap.utils.toArray(contactInfo.querySelectorAll('.contact-detail-item')) : [];

  if (contactInfo) gsap.set(contactInfo, { opacity: 0, x: -50 });
  if (infoHeading) gsap.set(infoHeading, { opacity: 0, y: 15 });
  if (infoDesc) gsap.set(infoDesc, { opacity: 0, y: 12, filter: 'blur(6px)' });
  gsap.set(detailItems, { opacity: 0, x: -30, scale: 0.9 });

  var formGroups = contactForm ? gsap.utils.toArray(contactForm.querySelectorAll('.form-group')) : [];
  var submitBtn = contactForm ? contactForm.querySelector('.form-submit') : null;

  if (contactForm) gsap.set(contactForm, { opacity: 0, x: 50 });
  gsap.set(formGroups, { opacity: 0, y: 20 });
  if (submitBtn) gsap.set(submitBtn, { opacity: 0, scale: 0.8 });

  var masterTL = gsap.timeline({
    scrollTrigger: {
      trigger: '#contact',
      start: 'top 88%',
      toggleActions: 'play none none none'
    }
  });

  masterTL
    .to(badge, { opacity: 1, scale: 1, rotation: 0, duration: 0.45, ease: 'back.out(1.6)' })
    .to(title, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.45, ease: 'power3.out' }, '-=0.25')
    .to(subtitle, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }, '-=0.25');

  if (contactInfo) {
    masterTL.to(contactInfo, { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out' }, '-=0.25');
    if (infoHeading) masterTL.to(infoHeading, { opacity: 1, y: 0, duration: 0.3, ease: 'back.out(1.5)' }, '-=0.3');
    if (infoDesc) masterTL.to(infoDesc, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.35, ease: 'power2.out' }, '-=0.25');
    if (detailItems.length) masterTL.to(detailItems, { opacity: 1, x: 0, scale: 1, duration: 0.3, stagger: 0.05, ease: 'back.out(1.5)' }, '-=0.2');
  }

  if (contactForm) {
    masterTL.to(contactForm, { opacity: 1, x: 0, duration: 0.45, ease: 'power3.out' }, '-=0.45');
    if (formGroups.length) masterTL.to(formGroups, { opacity: 1, y: 0, duration: 0.3, stagger: 0.04, ease: 'power2.out' }, '-=0.3');
    if (submitBtn) masterTL.to(submitBtn, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }, '-=0.15');
  }

  section.querySelectorAll('.contact-detail-item').forEach(function(item){
    var icon = item.querySelector('.detail-icon');
    item.addEventListener('mouseenter', function(){
      gsap.to(item, { x: 8, y: -2, duration: 0.35, ease: 'power2.out' });
      if (icon) gsap.to(icon, { scale: 1.15, rotation: -5, duration: 0.35, ease: 'back.out(2)' });
    });
    item.addEventListener('mouseleave', function(){
      gsap.to(item, { x: 0, y: 0, duration: 0.4, ease: 'power2.out' });
      if (icon) gsap.to(icon, { scale: 1, rotation: 0, duration: 0.4, ease: 'elastic.out(1, 0.4)' });
    });
  });

  if (submitBtn) {
    submitBtn.addEventListener('mouseenter', function(){
      gsap.to(submitBtn, { y: -3, scale: 1.03, duration: 0.3, ease: 'back.out(2)' });
    });
    submitBtn.addEventListener('mouseleave', function(){
      gsap.to(submitBtn, { y: 0, scale: 1, duration: 0.4, ease: 'power2.out' });
    });
  }

  if (contactForm) {
    contactForm.querySelectorAll('input, textarea').forEach(function(input){
      input.addEventListener('focus', function(){
        gsap.to(input, { boxShadow: '0 0 0 3px rgba(46, 196, 182, 0.18)', duration: 0.3, ease: 'power2.out' });
      });
      input.addEventListener('blur', function(){
        gsap.to(input, { boxShadow: 'none', duration: 0.3, ease: 'power2.out' });
      });
    });
  }

  var emailChooser = section.querySelector('.email-chooser');
  var emailPopup = document.getElementById('emailPopup');
  if (emailChooser && emailPopup) {
    var popupBox = emailPopup.querySelector('.email-popup-box');
    var closePopupBtn = emailPopup.querySelector('.email-popup-close');

    function openPopup(){
      emailPopup.style.display = 'flex';
      gsap.fromTo(emailPopup, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power2.out' });
      gsap.fromTo(popupBox,
        { scale: 0.7, opacity: 0, y: 30 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: 'back.out(1.6)' }
      );
    }

    function closePopup(){
      gsap.to(popupBox, { scale: 0.8, opacity: 0, y: 20, duration: 0.2, ease: 'power2.in' });
      gsap.to(emailPopup, {
        opacity: 0, duration: 0.25, ease: 'power2.in',
        onComplete: function(){ emailPopup.style.display = 'none'; }
      });
    }

    emailChooser.addEventListener('click', openPopup);
    if (closePopupBtn) closePopupBtn.addEventListener('click', closePopup);
    emailPopup.addEventListener('click', function(e){
      if (e.target === emailPopup) closePopup();
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && emailPopup.style.display === 'flex') closePopup();
    });

    emailPopup.querySelectorAll('a').forEach(function(link){
      link.addEventListener('mouseenter', function(){
        gsap.to(link, { scale: 1.03, x: 4, duration: 0.25, ease: 'power2.out' });
      });
      link.addEventListener('mouseleave', function(){
        gsap.to(link, { scale: 1, x: 0, duration: 0.25, ease: 'power2.out' });
      });
      link.addEventListener('click', function(e){
        e.stopPropagation();
        setTimeout(closePopup, 500);
      });
    });
  }
}

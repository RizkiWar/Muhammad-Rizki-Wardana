/* ============================================
   PARTICLE ANIMATION SYSTEM
   Enhanced with mouse interaction & click effects
   ============================================ */
(function() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const isMobile = window.innerWidth < 768;
  const prefersReduced = false;
  const isPerfMode = document.documentElement.classList.contains('perf-mode');
  if (isMobile || prefersReduced || isPerfMode) {
    canvas.style.display = 'none';
    return;
  }

  const ctx = canvas.getContext('2d');
  let particles = [];
  let ripples = [];
  let burstParticles = [];
  let animationId;
  let width, height;
  let isScrolling = false;
  let scrollTimeout;
  let mouseX = -1000, mouseY = -1000;
  let contentRects = [];

  function updateContentRects() {
    const selectors = [
      '.hero-content', '.hero-image', '.section-header', '.about-grid',
      '.timeline', '.portfolio-grid', '.accordion', '.philosophy-card',
      '.philosophy-pillars', '.skills-tabs', '.skills-panel.active',
      '.cert-grid', '.gallery-grid', '.contact-grid', '.navbar',
      '.hero-badges', '.about-stats', '.footer'
    ];

    contentRects = [];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          contentRects.push({
            left: rect.left - 36,
            top: rect.top - 36,
            right: rect.right + 36,
            bottom: rect.bottom + 36,
            centerX: rect.left + rect.width / 2,
            centerY: rect.top + rect.height / 2,
          });
        }
      });
    });
  }

  function applyContentAvoidance(p) {
    let totalForceX = 0;
    let totalForceY = 0;
    let activeRects = 0;

    contentRects.forEach(rect => {
      const nearestX = Math.max(rect.left, Math.min(p.x, rect.right));
      const nearestY = Math.max(rect.top, Math.min(p.y, rect.bottom));
      const dx = p.x - nearestX;
      const dy = p.y - nearestY;
      const distSq = dx * dx + dy * dy;
      const avoidRadius = 80;

      if (distSq < avoidRadius * avoidRadius) {
        activeRects++;
        const dist = Math.sqrt(distSq) || 1;
        const force = (avoidRadius - dist) / avoidRadius;
        const angle = distSq === 0
          ? Math.atan2(p.y - rect.centerY, p.x - rect.centerX) || (Math.random() * Math.PI * 2)
          : Math.atan2(dy, dx);

        totalForceX += Math.cos(angle) * force;
        totalForceY += Math.sin(angle) * force;
      }
    });

    if (activeRects > 0) {
      // Apply combined force, with anti-stuck random kick if multiple rects
      const stuckKick = activeRects > 1 ? (Math.random() - 0.5) * 0.4 : 0;
      p.x += totalForceX * 2.2 + stuckKick;
      p.y += totalForceY * 2.2 + stuckKick;
      p.speedX += totalForceX * 0.05;
      p.speedY += totalForceY * 0.05;

      // Clamp speeds to prevent runaway acceleration
      const maxSpeed = 1.2;
      p.speedX = Math.max(-maxSpeed, Math.min(maxSpeed, p.speedX));
      p.speedY = Math.max(-maxSpeed, Math.min(maxSpeed, p.speedY));
    }
  }

  const colors = [
    { r: 15,  g: 94,  b: 168 },
    { r: 57,  g: 189, b: 235 },
    { r: 46,  g: 196, b: 182 },
    { r: 241, g: 192, b: 91  },
  ];

  const particleTypes = ['gear', 'hexBolt', 'cube', 'caliper', 'spark'];

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function getParticleCount() {
    if (width < 768) return 12;
    if (width < 1024) return 18;
    return 25;
  }

  function createParticle(x, y) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      x: x !== undefined ? x : Math.random() * width,
      y: y !== undefined ? y : Math.random() * height,
      size: Math.random() * 10 + 9,
      speedX: (Math.random() - 0.5) * 0.6,
      speedY: (Math.random() - 0.5) * 0.4 - 0.15,
      color: color,
      alpha: isDark ? (Math.random() * 0.35 + 0.4) : (Math.random() * 0.35 + 0.45),
      pulse: Math.random() * Math.PI * 2,
      pulseSpeed: Math.random() * 0.02 + 0.005,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.012,
      type: particleTypes[Math.floor(Math.random() * particleTypes.length)],
      origSpeedX: 0,
      origSpeedY: 0,
    };
  }

  function initParticles() {
    particles = [];
    const count = getParticleCount();
    for (let i = 0; i < count; i++) {
      const p = createParticle();
      p.origSpeedX = p.speedX;
      p.origSpeedY = p.speedY;
      particles.push(p);
    }
  }

  // --- Click Ripple Effect ---
  function createRipple(x, y) {
    const color = colors[Math.floor(Math.random() * colors.length)];
    ripples.push({ x, y, radius: 0, maxRadius: 150 + Math.random() * 80, alpha: 0.4, color });
    ripples.push({ x, y, radius: 0, maxRadius: 80 + Math.random() * 60, alpha: 0.25, color: colors[Math.floor(Math.random() * colors.length)] });

    // Burst mini particles
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 / 12) * i + Math.random() * 0.3;
      const speed = 2 + Math.random() * 3;
      const bColor = colors[Math.floor(Math.random() * colors.length)];
      burstParticles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 3 + 1.5,
        alpha: 0.8,
        color: bColor,
        life: 1,
        decay: 0.015 + Math.random() * 0.015,
      });
    }
  }

  function drawRipples() {
    for (let i = ripples.length - 1; i >= 0; i--) {
      const r = ripples[i];
      r.radius += 3;
      r.alpha -= 0.006;
      if (r.alpha <= 0 || r.radius >= r.maxRadius) {
        ripples.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(${r.color.r}, ${r.color.g}, ${r.color.b}, ${r.alpha})`;
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  function drawBurstParticles() {
    for (let i = burstParticles.length - 1; i >= 0; i--) {
      const b = burstParticles[i];
      b.x += b.vx;
      b.y += b.vy;
      b.vx *= 0.96;
      b.vy *= 0.96;
      b.life -= b.decay;
      b.alpha = b.life * 0.8;
      if (b.life <= 0) {
        burstParticles.splice(i, 1);
        continue;
      }
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.size * b.life, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${b.color.r}, ${b.color.g}, ${b.color.b}, ${b.alpha})`;
      ctx.fill();

      // Trailing glow
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.size * b.life * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${b.color.r}, ${b.color.g}, ${b.color.b}, ${b.alpha * 0.15})`;
      ctx.fill();
    }
  }

  function strokeParticlePath(p, alpha, drawFn) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
    ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha * 0.12})`;
    ctx.lineWidth = Math.max(1, p.size * 0.11);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    drawFn(p.size);
    ctx.restore();
  }

  function drawGear(size) {
    const teeth = 8;
    ctx.beginPath();
    for (let i = 0; i < teeth * 2; i++) {
      const radius = i % 2 === 0 ? size : size * 0.75;
      const angle = (Math.PI * 2 * i) / (teeth * 2);
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.34, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawHexBolt(size) {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = Math.PI / 6 + (Math.PI * 2 * i) / 6;
      const x = Math.cos(angle) * size;
      const y = Math.sin(angle) * size;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, size * 0.32, 0, Math.PI * 2);
    ctx.stroke();
  }

  function drawCube(size) {
    const half = size * 0.55;
    const offset = size * 0.32;
    ctx.strokeRect(-half, -half, size, size);
    ctx.strokeRect(-half + offset, -half - offset, size, size);
    ctx.beginPath();
    ctx.moveTo(-half, -half);
    ctx.lineTo(-half + offset, -half - offset);
    ctx.moveTo(half, -half);
    ctx.lineTo(half + offset, -half - offset);
    ctx.moveTo(-half, half);
    ctx.lineTo(-half + offset, half - offset);
    ctx.moveTo(half, half);
    ctx.lineTo(half + offset, half - offset);
    ctx.stroke();
  }

  function drawCaliper(size) {
    ctx.beginPath();
    ctx.moveTo(-size, -size * 0.5);
    ctx.lineTo(size, -size * 0.5);
    ctx.lineTo(size * 0.72, size * 0.18);
    ctx.moveTo(-size, -size * 0.5);
    ctx.lineTo(-size * 0.72, size * 0.18);
    ctx.moveTo(-size * 0.6, -size * 0.18);
    ctx.lineTo(size * 0.48, -size * 0.18);
    ctx.moveTo(-size * 0.2, -size * 0.5);
    ctx.lineTo(-size * 0.2, -size * 0.2);
    ctx.moveTo(size * 0.18, -size * 0.5);
    ctx.lineTo(size * 0.18, -size * 0.2);
    ctx.stroke();
  }

  function drawSpark(size) {
    ctx.beginPath();
    ctx.moveTo(-size, 0);
    ctx.lineTo(size, 0);
    ctx.moveTo(0, -size);
    ctx.lineTo(0, size);
    ctx.moveTo(-size * 0.62, -size * 0.62);
    ctx.lineTo(size * 0.62, size * 0.62);
    ctx.moveTo(size * 0.62, -size * 0.62);
    ctx.lineTo(-size * 0.62, size * 0.62);
    ctx.stroke();
  }

  // --- Draw main mechanical particles with mouse repulsion ---
  function drawParticle(p) {
    const pulseFactor = Math.sin(p.pulse) * 0.3 + 0.7;
    const alpha = p.alpha * pulseFactor;

    const drawers = {
      gear: drawGear,
      hexBolt: drawHexBolt,
      cube: drawCube,
      caliper: drawCaliper,
      spark: drawSpark,
    };

    strokeParticlePath(p, alpha, drawers[p.type] || drawHexBolt);
  }

  function drawConnections() {
    const connectionDistance = 120;
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const maxAlpha = isDark ? 0.04 : 0.06;

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < connectionDistance) {
          const alpha = (1 - dist / connectionDistance) * maxAlpha;
          const p = particles[i];
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    if (canvas.offsetWidth === 0) {
      animationId = setTimeout(animate, 250);
      return;
    }
    if (isScrolling) {
      animationId = setTimeout(animate, 100);
      return;
    }
    ctx.clearRect(0, 0, width, height);

    const mouseRadius = 120;

    particles.forEach(p => {
      // Mouse repulsion
      const dx = p.x - mouseX;
      const dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouseRadius && dist > 0) {
        const force = (mouseRadius - dist) / mouseRadius;
        const angle = Math.atan2(dy, dx);
        p.x += Math.cos(angle) * force * 2.5;
        p.y += Math.sin(angle) * force * 2.5;
      } else {
        // Gradually return to original speed
        p.speedX += (p.origSpeedX - p.speedX) * 0.01;
        p.speedY += (p.origSpeedY - p.speedY) * 0.01;
      }

      applyContentAvoidance(p);

      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += p.pulseSpeed;
      p.rotation += p.rotationSpeed;

      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      drawParticle(p);
    });

    drawConnections();
    drawRipples();
    drawBurstParticles();

    animationId = requestAnimationFrame(animate);
  }

  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  // Click ripple
  document.addEventListener('click', (e) => {
    createRipple(e.clientX, e.clientY);
  });

  // Initialize
  resize();
  initParticles();
  updateContentRects();
  animate();

  // Pause particles during scroll for performance
  window.addEventListener('scroll', () => {
    isScrolling = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => { isScrolling = false; }, 150);
  }, { passive: true });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      initParticles();
      updateContentRects();
    }, 200);
  });

  let scrollTimer;
  window.addEventListener('scroll', () => {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(updateContentRects, 150);
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
})();


/* ============================================
   STAGGERED SCROLL REVEAL
   Cards animate in one by one with delay
   ============================================ */
(function() {
  // Stagger children inside grids
  const grids = document.querySelectorAll('.portfolio-grid, .skills-grid, .cert-grid, .philosophy-pillars, .about-stats');

  grids.forEach(grid => {
    const cards = grid.querySelectorAll('.reveal');
    cards.forEach((card, idx) => {
      card.style.transitionDelay = `${idx * 0.1}s`;
    });
  });

  // Parallax-lite for floating shapes on scroll
  const shapes = document.querySelector('.floating-shapes');
  if (shapes) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      shapes.style.transform = `translateY(${scrollY * 0.08}px)`;
    }, { passive: true });
  }

  // Counter animation for stat numbers
  const statNumbers = document.querySelectorAll('.about-stat .number');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.animated) {
        entry.target.dataset.animated = 'true';
        animateCounter(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const text = el.textContent.trim();
    const match = text.match(/^(\d+)(\+?)$/);
    if (!match) return;
    const target = parseInt(match[1]);
    const suffix = match[2] || '';
    let current = 0;
    const duration = 1500;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      current = Math.floor(eased * target);
      el.textContent = current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Tilt effect on hover for cards
  const tiltCards = document.querySelectorAll('.portfolio-card, .pillar-card, .skill-card, .cert-card');
  tiltCards.forEach(card => {
    let rect = null;
    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
    });
    card.addEventListener('mousemove', (e) => {
      if (!rect) rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -4;
      const rotateY = (x - centerX) / centerX * 4;
      card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      rect = null;
      card.style.transform = '';
      card.style.transition = 'transform 0.4s ease';
      setTimeout(() => { card.style.transition = ''; }, 400);
    });
  });
})();

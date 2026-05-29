/* ============================================================
   SURAJ PORTFOLIO - MAIN SCRIPT
   Cinematic Spider-Man Inspired Interactive Experience
   ============================================================ */

'use strict';

// ============================================================
// LOADING SCREEN
// ============================================================
(function initLoader() {
  const loader = document.querySelector('.loading-screen');
  const bar = document.querySelector('.loading-bar');
  const percent = document.querySelector('.loading-percent');
  if (!loader) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        initAll();
      }, 400);
    }
    if (bar) bar.style.width = progress + '%';
    if (percent) percent.textContent = Math.floor(progress) + '%';
  }, 80);
})();

document.body.style.overflow = 'hidden';

// ============================================================
// INIT ALL MODULES
// ============================================================
function initAll() {
  initCursor();
  initNav();
  initHeroCanvas();
  initSmoothScroll();
  initRevealAnimations();
  initGSAPAnimations();
  initPortfolioFilter();
  initSkillBars();
  initTiltCards();
  initSwiper();
  initMagneticButtons();
  initParallax();
}

// ============================================================
// CUSTOM CURSOR
// ============================================================
function initCursor() {
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const hoverTargets = document.querySelectorAll('a, button, .portfolio-card, .skill-card');
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('active');
      follower.classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('active');
      follower.classList.remove('active');
    });
  });
}

// ============================================================
// NAVIGATION
// ============================================================
function initNav() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (nav) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    });
  }

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // Active link highlighting
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

// ============================================================
// THREE.JS HERO CANVAS
// ============================================================
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  // Fog
  scene.fog = new THREE.FogExp2(0x050505, 0.008);

  // Particles
  const particleCount = window.innerWidth < 768 ? 1000 : 2500;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 120;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

    // Mix of red and white particles
    const isRed = Math.random() > 0.7;
    colors[i * 3] = isRed ? 1 : 0.8 + Math.random() * 0.2;
    colors[i * 3 + 1] = isRed ? 0.1 * Math.random() : 0.8 + Math.random() * 0.2;
    colors[i * 3 + 2] = isRed ? 0.1 * Math.random() : 0.8 + Math.random() * 0.2;

    sizes[i] = Math.random() * 2.5 + 0.5;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  particleGeo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particleMat = new THREE.PointsMaterial({
    size: 0.15,
    vertexColors: true,
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Web Line Geometry
  function createWebLines() {
    const lineCount = 40;
    const group = new THREE.Group();

    for (let i = 0; i < lineCount; i++) {
      const points = [];
      const segments = Math.floor(Math.random() * 4) + 3;
      let x = (Math.random() - 0.5) * 80;
      let y = (Math.random() - 0.5) * 80;
      let z = (Math.random() - 0.5) * 30;

      for (let j = 0; j < segments; j++) {
        points.push(new THREE.Vector3(x, y, z));
        x += (Math.random() - 0.5) * 20;
        y += (Math.random() - 0.5) * 20;
        z += (Math.random() - 0.5) * 5;
      }

      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: Math.random() > 0.4 ? 0xff1e1e : 0xffffff,
        transparent: true,
        opacity: Math.random() * 0.12 + 0.03,
        blending: THREE.AdditiveBlending,
      });
      const line = new THREE.Line(geometry, material);
      group.add(line);
    }
    return group;
  }

  const webLines = createWebLines();
  scene.add(webLines);

  // Ambient glow sphere
  const glowGeo = new THREE.SphereGeometry(8, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0xd90429,
    transparent: true,
    opacity: 0.03,
    blending: THREE.AdditiveBlending,
  });
  const glowSphere = new THREE.Mesh(glowGeo, glowMat);
  glowSphere.position.set(15, 0, -10);
  scene.add(glowSphere);

  // Ring elements
  function createRing(radius, tube, color, opacity) {
    const geo = new THREE.TorusGeometry(radius, tube, 8, 100);
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity,
      blending: THREE.AdditiveBlending,
      wireframe: true,
    });
    return new THREE.Mesh(geo, mat);
  }

  const ring1 = createRing(12, 0.05, 0xff1e1e, 0.15);
  ring1.rotation.x = Math.PI / 4;
  scene.add(ring1);

  const ring2 = createRing(18, 0.03, 0x7f1d1d, 0.08);
  ring2.rotation.x = -Math.PI / 3;
  ring2.rotation.y = Math.PI / 6;
  scene.add(ring2);

  // Mouse interaction
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation
  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.005;

    // Particle drift
    particles.rotation.y += 0.0005;
    particles.rotation.x += 0.0002;

    // Web lines slow rotation
    webLines.rotation.z += 0.0008;
    webLines.rotation.y += 0.0003;

    // Rings
    ring1.rotation.z += 0.003;
    ring2.rotation.z -= 0.002;
    ring2.rotation.x += 0.001;

    // Glow pulse
    glowSphere.material.opacity = 0.02 + Math.sin(t * 2) * 0.015;
    glowSphere.scale.setScalar(1 + Math.sin(t) * 0.1);

    // Camera mouse reaction
    camera.position.x += (mouseX * 5 - camera.position.x) * 0.02;
    camera.position.y += (mouseY * 3 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  }
  animate();

  // Resize
  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });
}

// ============================================================
// LENIS SMOOTH SCROLL
// ============================================================
function initSmoothScroll() {
  if (typeof ScrollTrigger === 'undefined') return;
  
  // Just refresh ScrollTrigger, no external smooth scroll library
  ScrollTrigger.refresh();
  
  // Add smooth behavior to anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const target = document.querySelector(targetId);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }
    });
  });
}
// ============================================================
// REVEAL ANIMATIONS (INTERSECTION OBSERVER)
// ============================================================
function initRevealAnimations() {
  const elements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, entry.target.dataset.delay || 0);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  elements.forEach((el, i) => {
    el.dataset.delay = (i % 6) * 100;
    observer.observe(el);
  });
}

// ============================================================
// GSAP ANIMATIONS
// ============================================================
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  // Hero title stagger
  const heroTitle = document.querySelector('.hero-title .name');
  if (heroTitle) {
    gsap.fromTo(heroTitle,
      { opacity: 0, y: 60, skewX: -5 },
      { opacity: 1, y: 0, skewX: 0, duration: 1.4, ease: 'power4.out', delay: 0.3 }
    );
  }

  const heroBadge = document.querySelector('.hero-badge');
  if (heroBadge) {
    gsap.fromTo(heroBadge,
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, duration: 1, ease: 'power3.out', delay: 0.1 }
    );
  }

  const helloText = document.querySelector('.hero-title .hello');
  if (helloText) {
    gsap.fromTo(helloText,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
    );
  }

  const heroSubtitle = document.querySelector('.hero-subtitle');
  if (heroSubtitle) {
    gsap.fromTo(heroSubtitle,
      { opacity: 0 },
      { opacity: 1, duration: 1, ease: 'power2.out', delay: 0.8 }
    );
  }

  const heroDesc = document.querySelector('.hero-desc');
  if (heroDesc) {
    gsap.fromTo(heroDesc,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.0 }
    );
  }

  const heroButtons = document.querySelectorAll('.hero-buttons .btn-primary, .hero-buttons .btn-secondary');
  heroButtons.forEach((btn, i) => {
    gsap.fromTo(btn,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 1.2 + i * 0.15 }
    );
  });

  const heroStats = document.querySelectorAll('.hero-stat-item');
  heroStats.forEach((stat, i) => {
    gsap.fromTo(stat,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 1.4 + i * 0.1 }
    );
  });

  // Counter animation for stats
  document.querySelectorAll('.hero-stat-num, .about-stat-num').forEach(el => {
    const target = parseInt(el.textContent);
    if (isNaN(target)) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        let start = 0;
        const duration = 2000;
        const startTime = performance.now();
        const suffix = el.textContent.replace(/[0-9]/g, '');

        function update(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
  });

  // Section title animations with ScrollTrigger (if available)
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    document.querySelectorAll('.section-title').forEach(title => {
      gsap.fromTo(title,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: title, start: 'top 80%' }
        }
      );
    });
  }
}

// ============================================================
// PORTFOLIO FILTER
// ============================================================
//* ===== PORTFOLIO FILTER ===== */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card[data-cat]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      portfolioCards.forEach(card => {
        if (cat === 'all' || card.dataset.cat === cat) {
          card.style.display = 'block';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
// Make sure this is called in your initAll() or DOMContentLoaded
// ============================================================
// SKILL BARS ANIMATION
// ============================================================
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-bar-fill');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.dataset.width;
        setTimeout(() => {
          bar.style.transform = `scaleX(${targetWidth / 100})`;
          bar.classList.add('animated');
        }, 200);
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.3 });

  skillBars.forEach(bar => observer.observe(bar));
}

// ============================================================
// VANILLA TILT
// ============================================================
function initTiltCards() {
  if (typeof VanillaTilt === 'undefined') return;

  VanillaTilt.init(document.querySelectorAll('.skill-card, .timeline-card'), {
    max: 8,
    speed: 400,
    glare: true,
    'max-glare': 0.1,
    scale: 1.02,
  });

  VanillaTilt.init(document.querySelectorAll('.contact-form'), {
    max: 4,
    speed: 600,
    glare: true,
    'max-glare': 0.05,
  });
}

// ============================================================
// SWIPER TESTIMONIALS
// ============================================================
function initSwiper() {
  if (typeof Swiper === 'undefined') return;

  new Swiper('.testimonials-swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
      },
      1200: {
        slidesPerView: 3,
      },
    },
  });
}

// ============================================================
// MAGNETIC BUTTONS
// ============================================================
function initMagneticButtons() {
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .nav-cta');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';
    });
  });
}

// ============================================================
// PARALLAX EFFECT
// ============================================================
function initParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax]');

  if (!parallaxEls.length) return;

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    parallaxEls.forEach(el => {
      const speed = parseFloat(el.dataset.parallax) || 0.3;
      const rect = el.getBoundingClientRect();
      const offsetY = (scrollY - (scrollY + rect.top - window.innerHeight / 2)) * speed;
      el.style.transform = `translateY(${offsetY}px)`;
    });
  });
}

// ============================================================
// FORM HANDLING
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contact-form form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('.btn-submit');
      const originalText = btn.textContent;
      btn.textContent = 'SENDING...';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = '✓ MESSAGE SENT';
        btn.style.background = '#22c55e';
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
          btn.style.background = '';
          form.reset();
        }, 3000);
      }, 1500);
    });
  }
});

// ============================================================
// WEB SVG ANIMATION
// ============================================================
function animateWebSVG() {
  const svgs = document.querySelectorAll('.web-overlay path, .web-overlay line');
  svgs.forEach((path, i) => {
    const length = path.getTotalLength ? path.getTotalLength() : 200;
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;
    setTimeout(() => {
      path.style.transition = `stroke-dashoffset 3s ease ${i * 0.1}s`;
      path.style.strokeDashoffset = 0;
    }, 100);
  });
}

document.addEventListener('DOMContentLoaded', animateWebSVG);



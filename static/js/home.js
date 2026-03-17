/* ═══════════════════════════════════════
   SCROLL STUDIOS — home.js
   GSAP: Preloader + Animaciones + Cursor
═══════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────
   PRELOADER
───────────────────────────────────── */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const numEl     = document.getElementById('preloader-num');
  const barEl     = document.getElementById('preloader-bar');
  const counter   = document.querySelector('.preloader-counter');
  const lines     = document.querySelectorAll('.preloader-line span');
  const subWrap   = document.querySelector('.preloader-sub-wrap');
  const curtain   = document.querySelector('.preloader-curtain');

  if (!preloader) return;

  document.body.style.overflow = 'hidden';

  const tl = gsap.timeline();

  // 1. Contador aparece
  tl.to(counter, { opacity: 1, duration: 0.4, ease: 'power2.out' })

  // 2. Líneas caen una por una (stagger)
  .to(lines, {
    y: 0,
    duration: 1,
    ease: 'power4.out',
    stagger: 0.12,
  }, '-=0.1')

  // 3. Sub text aparece
  .to(subWrap, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.5')

  // 4. Contador 0→100 + barra
  .to({}, {
    duration: 2,
    ease: 'power1.inOut',
    onUpdate: function() {
      const val = Math.round(this.progress() * 100);
      numEl.textContent = val;
      barEl.style.width = val + '%';
    },
  }, '-=0.8')

  // 5. Pausa breve
  .to({}, { duration: 0.15 })

  // 6. Todo sale hacia arriba
  .to(lines, {
    y: '-110%',
    duration: 0.7,
    ease: 'power4.in',
    stagger: 0.06,
  })
  .to([counter, subWrap], { opacity: 0, duration: 0.3 }, '<')

  // 7. Cortina cyan sube
  .to(curtain, {
    scaleY: 1,
    duration: 0.55,
    ease: 'power3.inOut',
    transformOrigin: 'bottom',
  }, '-=0.15')

  // 8. Cortina baja y revela la web
  .to(curtain, {
    scaleY: 0,
    duration: 0.65,
    ease: 'power3.inOut',
    transformOrigin: 'top',
  })

  // 9. Fin
  .add(() => {
    preloader.classList.add('done');
    gsap.set(preloader, { display: 'none' });
    document.body.style.overflow = '';
    initHeroAnimations();
    initScrollAnimations();
  });
}


/* ─────────────────────────────────────
   HERO ANIMATIONS
───────────────────────────────────── */
function initHeroAnimations() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.fromTo('.hero-tag',     { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 })
    .fromTo('.hero-title',   { opacity: 0, y: 60 },
                             { opacity: 1, y: 0, duration: 0.9 }, '-=0.2')
    .fromTo('.hero-desc',    { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
    .fromTo('.hero-actions', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
    .fromTo('.hero-stats',   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, '-=0.2')
    .fromTo('.hero-visual',  { opacity: 0, x: 50  }, { opacity: 1, x: 0, duration: 1   }, '-=0.8');
}


/* ─────────────────────────────────────
   SCROLL ANIMATIONS
───────────────────────────────────── */
function initScrollAnimations() {

  gsap.fromTo('.service-card', { opacity: 0, y: 60 }, {
    opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.12,
    scrollTrigger: { trigger: '.servicios-grid', start: 'top 80%' }
  });

  gsap.fromTo('.section-header', { opacity: 0, y: 40 }, {
    opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '.section-header', start: 'top 85%' }
  });

  gsap.fromTo('.nosotros-content', { opacity: 0, x: -50 }, {
    opacity: 1, x: 0, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: '.nosotros', start: 'top 75%' }
  });

  gsap.fromTo('.nosotros-visual', { opacity: 0, x: 50 }, {
    opacity: 1, x: 0, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: '.nosotros', start: 'top 75%' }
  });

  gsap.fromTo('.nosotros-values li', { opacity: 0, x: -20 }, {
    opacity: 1, x: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1,
    scrollTrigger: { trigger: '.nosotros-values', start: 'top 80%' }
  });

  gsap.fromTo('.contacto-header', { opacity: 0, y: 40 }, {
    opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '.contacto-header', start: 'top 85%' }
  });

  gsap.fromTo('.contacto-info', { opacity: 0, x: -40 }, {
    opacity: 1, x: 0, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '.contacto-grid', start: 'top 80%' }
  });

  gsap.fromTo('.contacto-form', { opacity: 0, x: 40 }, {
    opacity: 1, x: 0, duration: 0.8, ease: 'power2.out',
    scrollTrigger: { trigger: '.contacto-grid', start: 'top 80%' }
  });

  gsap.fromTo('.diff-banner', { opacity: 0, y: 20 }, {
    opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
    scrollTrigger: { trigger: '.diff-banner', start: 'top 90%' }
  });

  // Parallax en el glow del hero
  gsap.to('.hero-glow', {
    y: -80, ease: 'none',
    scrollTrigger: {
      trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true,
    }
  });
}


/* ─────────────────────────────────────
   CURSOR MAGNÉTICO
───────────────────────────────────── */
function initMagneticCursor() {
  const magnetics = document.querySelectorAll('.btn-primary, .btn-outline, .service-link, .btn-wa-big');

  magnetics.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect    = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top  + rect.height / 2;
      gsap.to(el, {
        x: (e.clientX - centerX) * 0.3,
        y: (e.clientY - centerY) * 0.3,
        duration: 0.3, ease: 'power2.out',
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });
}


/* ─────────────────────────────────────
   CONTADORES
───────────────────────────────────── */
function initCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('[data-count]').forEach(el => {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        gsap.to({ val: 0 }, {
          val: target, duration: 1.5, ease: 'power2.out',
          onUpdate: function() {
            el.textContent = Math.floor(this.targets()[0].val) + suffix;
          }
        });
      });
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.hero-stats, .nosotros-stats').forEach(el => obs.observe(el));
}


/* ─────────────────────────────────────
   FORMULARIO → WhatsApp
───────────────────────────────────── */
function initForm() {
  const form      = document.getElementById('contact-form');
  const btnSubmit = form?.querySelector('.btn-submit');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre   = document.getElementById('nombre')?.value.trim();
    const telefono = document.getElementById('telefono')?.value.trim();
    const servicio = document.getElementById('servicio')?.value;
    const mensaje  = document.getElementById('mensaje')?.value.trim();
    if (!nombre || !servicio || !mensaje) return;

    const texto =
      `Hola Scroll Studios! 👋%0A%0A` +
      `*Nombre:* ${nombre}%0A` +
      `*Teléfono:* ${telefono || 'No indicado'}%0A` +
      `*Servicio:* ${servicio}%0A%0A` +
      `*Proyecto:*%0A${mensaje}`;

    window.open(`https://wa.me/51999999999?text=${texto}`, '_blank');

    if (btnSubmit) {
      const original = btnSubmit.textContent;
      btnSubmit.textContent = '✓ Enviado!';
      btnSubmit.style.background = '#28c840';
      setTimeout(() => {
        btnSubmit.textContent = original;
        btnSubmit.style.background = '';
        form.reset();
      }, 3000);
    }
  });
}


/* ─────────────────────────────────────
   INIT
───────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initMagneticCursor();
  initCounters();
  initForm();
});
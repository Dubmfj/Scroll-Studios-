/* ═══════════════════════════════════════
   SCROLL STUDIOS — home.js
   GSAP: Preloader 3D Transit + ScrollTrigger + 3D Canvas
   Estilo: Clay Global / Visual-First
═══════════════════════════════════════ */

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ─────────────────────────────────────
   SEAMLESS OBJECT-TRANSIT HERO PRELOADER
   (Escultura 3D viaja del centro a su posición en el Hero)
───────────────────────────────────── */
function initPreloader() {
  const curtain    = document.getElementById('introCurtain');
  const heroVisual = document.querySelector('.hero-visual');

  // Iniciar siempre el render continuo de la escultura 3D a 60 FPS
  init3DHeroCanvas();

  // Si el usuario llega con un hash directo (ej: #precios, #servicios, #avior):
  if (window.location.hash) {
    if (curtain) { curtain.style.display = 'none'; curtain.style.opacity = '0'; }
    document.documentElement.classList.remove('preloader-active');
    document.body.classList.remove('preloader-active');
    document.body.style.overflow = '';
    if (heroVisual) {
      heroVisual.style.opacity = '1'; heroVisual.style.visibility = 'visible'; heroVisual.style.transform = 'none'; gsap.set(heroVisual, { opacity: 1, x: 0, y: 0, scale: 1, zIndex: 1 });
    }
    gsap.set(['header', '.hero-badge-wrap', '.hero-title', '.hero-desc', '.hero-actions'], {
      opacity: 1, y: 0
    });
    initScrollAnimations();
    scrollToHashTarget();
    window.dispatchEvent(new Event('ss:preloader-complete'));
    return;
  }

  if (!heroVisual || !curtain || typeof gsap === 'undefined') {
    if (curtain) curtain.style.display = 'none';
    document.documentElement.classList.remove('preloader-active');
    document.body.classList.remove('preloader-active');
    document.body.style.overflow = '';
    window.scrollTo(0, 0);
    initScrollAnimations();
    window.dispatchEvent(new Event('ss:preloader-complete'));
    return;
  }

  // Prevenir desajuste de scroll al refrescar
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
  document.documentElement.classList.remove('preloader-active');
  document.body.classList.remove('preloader-active');
  document.body.style.overflow = '';
  window.scrollTo(0, 0);
  document.documentElement.classList.add('preloader-active');
  document.body.classList.add('preloader-active');
  document.body.style.overflow = 'hidden';

  // 1. Cálculo matemático de coordenadas hacia el centro de la pantalla
  const rect = heroVisual.getBoundingClientRect();
  const viewportCenterX = window.innerWidth / 2;
  const viewportCenterY = window.innerHeight / 2;
  const visualCenterX   = rect.left + rect.width / 2;
  const visualCenterY   = rect.top + rect.height / 2;

  const deltaX = viewportCenterX - visualCenterX;
  const deltaY = viewportCenterY - visualCenterY;

  const isMobile = window.innerWidth <= 768;
  const introScale = isMobile ? 0.88 : 0.92;

  // 2. Estado inicial: Escultura 3D en el centro sobre fondo blanco puro
  gsap.set(heroVisual, {
    x: deltaX,
    y: deltaY,
    scale: introScale,
    zIndex: 1000,
    position: 'relative',
    opacity: 0,
    transformOrigin: 'center center'
  });

  // Ocultar elementos circundantes para sincronizar la entrada
  gsap.set('header',            { y: -25, opacity: 0 });
  gsap.set('.hero-badge-wrap',  { y: 20, opacity: 0 });
  gsap.set('.hero-title',       { y: 35, opacity: 0 });
  gsap.set('.hero-desc',        { y: 20, opacity: 0 });
  gsap.set('.hero-actions',     { y: 15, opacity: 0 });
  gsap.set('.hero-trust-bar',   { y: 15, opacity: 0 });

  // 3. Orquestación del Timeline fluido
  const tl = gsap.timeline({
    delay: 0.15,
    onComplete: () => {
      document.documentElement.classList.remove('preloader-active');
      document.body.classList.remove('preloader-active');
      document.body.style.overflow = '';
      gsap.set(heroVisual, { zIndex: 1, clearProps: 'zIndex' });
      if (curtain) curtain.style.display = 'none';
      initScrollAnimations();
      // Si la URL tiene hash (ej: /#precios), hacer scroll a esa sección
      scrollToHashTarget();
      window.dispatchEvent(new Event('ss:preloader-complete'));
    }
  });

  // Paso 1: Aparición suave de la escultura en el centro (desvanecido limpio)
  tl.to(heroVisual, {
    opacity: 1,
    duration: 0.65,
    ease: 'power2.out'
  })

  // Paso 2: Pausa de apreciación visual
  .to({}, { duration: 1.4 })

  // Paso 3: VUELO FLUIDO — La escultura viaja del centro a su posición en el Hero
  .to(heroVisual, {
    x: 0,
    y: 0,
    scale: 1,
    duration: 1.35,
    ease: 'power2.inOut'
  })

  // Paso 4: El fondo blanco se disuelve en paralelo revelando el Hero
  .to(curtain, {
    opacity: 0,
    duration: 0.95,
    ease: 'power2.out',
    onComplete: () => {
      curtain.style.display = 'none';
    }
  }, '-=1.2')

  // Paso 5: El Header desciende desde arriba
  .to('header', {
    y: 0,
    opacity: 1,
    duration: 0.85,
    ease: 'power3.out'
  }, '-=0.95')

  // Paso 6: El contenido del Hero entra en cascada armónica
  .to('.hero-badge-wrap', { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.85')
  .to('.hero-title',      { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' }, '-=0.75')
  .to('.hero-desc',       { y: 0, opacity: 1, duration: 0.65, ease: 'power3.out' }, '-=0.65')
  .to('.hero-actions',    { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.6')
  .to('.hero-trust-bar',  { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.55');

  // Fallback de seguridad infalible (4.8 segundos)
  setTimeout(() => {
    if (curtain && getComputedStyle(curtain).display !== 'none') {
      curtain.style.display = 'none';
      document.documentElement.classList.remove('preloader-active');
      document.body.classList.remove('preloader-active');
      document.body.style.overflow = '';
      if (heroVisual) {
        gsap.set(heroVisual, { opacity: 1, x: 0, y: 0, scale: 1, zIndex: 1 });
      }
      gsap.set(['header', '.hero-badge-wrap', '.hero-title', '.hero-desc', '.hero-actions'], {
        opacity: 1, y: 0
      });
      initScrollAnimations();
      scrollToHashTarget();
    }
  }, 4800);
}

/* ─────────────────────────────────────
   SCROLL A SECCIÓN POR HASH EN URL
   (Respeta navegación desde otras páginas como /contacto → /#precios)
───────────────────────────────────── */
function scrollToHashTarget() {
  const hash = window.location.hash;
  if (!hash) return;
  const target = document.querySelector(hash);
  if (!target) return;
  // Pequeño delay para que ScrollTrigger recalcule posiciones
  setTimeout(() => {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 120);
}
/* -------------------------------------
   SCROLL ANIMATIONS (GSAP ScrollTrigger Staggers)
───────────────────────────────────── */
function initScrollAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Refrescar ScrollTrigger para recalcular posiciones
  ScrollTrigger.refresh();

  // Encabezados de sección
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.fromTo(header, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: header, start: 'top 88%' }
    });
  });

  // Tarjetas Avior
  gsap.fromTo('.avior-feat-card', { opacity: 0, y: 35 }, {
    opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', stagger: 0.12,
    scrollTrigger: { trigger: '.avior-features-grid', start: 'top 85%' }
  });

  // Tarjetas de Servicios
  gsap.fromTo('.service-row-card', { opacity: 0, y: 25 }, {
    opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1,
    scrollTrigger: { trigger: '.services-list-grid', start: 'top 85%' }
  });

  // Tarjetas de Precios
  gsap.fromTo('.pricing-card', { opacity: 0, y: 35 }, {
    opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', stagger: 0.1,
    scrollTrigger: { trigger: '.pricing-grid', start: 'top 85%' }
  });

  // Muestras de diseño
  gsap.fromTo('.sample-card', { opacity: 0, y: 35 }, {
    opacity: 1, y: 0, duration: 0.65, ease: 'power2.out', stagger: 0.12,
    scrollTrigger: { trigger: '.samples-grid', start: 'top 85%' }
  });

  // Pasos de proceso
  gsap.fromTo('.step-card', { opacity: 0, y: 30 }, {
    opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1,
    scrollTrigger: { trigger: '.process-steps-grid', start: 'top 85%' }
  });

  // Dos caminos
  gsap.fromTo('.path-card', { opacity: 0, y: 35 }, {
    opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.15,
    scrollTrigger: { trigger: '.paths-grid', start: 'top 85%' }
  });

  // FAQ items
  gsap.fromTo('.faq-item', { opacity: 0, y: 20 }, {
    opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.08,
    scrollTrigger: { trigger: '.faq-accordion-container', start: 'top 88%' }
  });

  // Cierre de conversión
  gsap.fromTo('.conv-cta-block', { opacity: 0, y: 35, scale: 0.98 }, {
    opacity: 1, y: 0, scale: 1, duration: 0.75, ease: 'power2.out',
    scrollTrigger: { trigger: '.conversion-footer', start: 'top 85%' }
  });
}

/* ─────────────────────────────────────
   ESCULTURA 3D HERO CANVAS
───────────────────────────────────── */
function init3DHeroCanvas() {
  const canvas = document.getElementById('hero3DCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = canvas.width;
  let height = canvas.height;
  let centerX = width / 2;
  let centerY = height / 2;

  // Interpolación del cursor (Lerp)
  let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
  let isHovered = false;

  const stage = document.getElementById('heroStage') || canvas;

  // Seguimiento suave del mouse
  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    const stageCenterX = rect.left + rect.width / 2;
    const stageCenterY = rect.top + rect.height / 2;

    const dx = (e.clientX - stageCenterX) / (window.innerWidth * 0.5);
    const dy = (e.clientY - stageCenterY) / (window.innerHeight * 0.5);

    mouse.targetX = Math.max(-1.5, Math.min(1.5, dx));
    mouse.targetY = Math.max(-1.5, Math.min(1.5, dy));
  });

  // Touch / Mobile drag
  canvas.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      const dx = (touch.clientX - (rect.left + rect.width / 2)) / (rect.width * 0.5);
      const dy = (touch.clientY - (rect.top + rect.height / 2)) / (rect.height * 0.5);
      mouse.targetX = dx;
      mouse.targetY = dy;
    }
  }, { passive: true });

  // Nodos orbitales y geometría 3D
  const radius = 135;
  let baseRotation = 0;

  // Puntos de la escultura geométrica (Icosaedro / Gyro Rings)
  const rings = [
    { radius: 155, tiltX: 0.6, tiltY: 0.2, speed: 0.013, color: 'rgba(34, 211, 238, 0.65)', lineWidth: 1.5 },
    { radius: 125, tiltX: -0.5, tiltY: 0.8, speed: -0.017, color: 'rgba(255, 255, 255, 0.45)', lineWidth: 1.2 },
    { radius: 95,  tiltX: 0.9, tiltY: -0.4, speed: 0.022, color: 'rgba(255, 255, 255, 0.25)', lineWidth: 1.0 }
  ];

  // Nodos satelitales
  const satellites = [
    { angle: 0, distance: 155, ringIndex: 0, size: 4, pulse: 0 },
    { angle: 2.1, distance: 125, ringIndex: 1, size: 3.5, pulse: 1 },
    { angle: 4.2, distance: 95, ringIndex: 2, size: 3, pulse: 2 }
  ];

  function project3D(x, y, z, rotX, rotY) {
    // Rotación eje Y
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);
    const x1 = x * cosY - z * sinY;
    const z1 = z * cosY + x * sinY;

    // Rotación eje X
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const y1 = y * cosX - z1 * sinX;
    const z2 = z1 * cosX + y * sinX;

    // Proyección con perspectiva
    const fov = 400;
    const scale = fov / (fov + z2 + 80);

    return {
      x: centerX + x1 * scale,
      y: centerY + y1 * scale,
      scale: scale,
      z: z2
    };
  }

  function render() {
    // Lerp suave del cursor
    mouse.x += (mouse.targetX - mouse.x) * 0.06;
    mouse.y += (mouse.targetY - mouse.y) * 0.06;

    baseRotation += 0.011;

    ctx.clearRect(0, 0, width, height);

    const rotX = mouse.y * 0.75 + Math.sin(baseRotation * 0.5) * 0.15;
    const rotY = baseRotation + mouse.x * 0.9;

    // 1. Núcleo central resplandeciente
    ctx.save();
    const coreGrad = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 65);
    coreGrad.addColorStop(0, 'rgba(34, 211, 238, 0.28)');
    coreGrad.addColorStop(0.5, 'rgba(16, 185, 129, 0.08)');
    coreGrad.addColorStop(1, 'rgba(9, 9, 11, 0)');
    ctx.fillStyle = coreGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, 65, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Anillos Orbitales con perspectiva
    rings.forEach((ring, idx) => {
      ctx.beginPath();
      const points = 64;
      for (let i = 0; i <= points; i++) {
        const theta = (i / points) * Math.PI * 2;
        const rawX = Math.cos(theta) * ring.radius;
        const rawY = Math.sin(theta) * ring.radius * Math.cos(ring.tiltX);
        const rawZ = Math.sin(theta) * ring.radius * Math.sin(ring.tiltY);

        const p = project3D(rawX, rawY, rawZ, rotX, rotY);
        if (i === 0) {
          ctx.moveTo(p.x, p.y);
        } else {
          ctx.lineTo(p.x, p.y);
        }
      }
      ctx.strokeStyle = ring.color;
      ctx.lineWidth = ring.lineWidth;
      ctx.stroke();
    });

    // 3. Conexiones poligonales del núcleo (Geodesic Wireframe)
    const polyVerts = [];
    const numVerts = 8;
    for (let i = 0; i < numVerts; i++) {
      const phi = (i / numVerts) * Math.PI * 2;
      const vx = Math.cos(phi + baseRotation * 0.8) * 45;
      const vy = Math.sin(phi * 2) * 28;
      const vz = Math.sin(phi + baseRotation * 0.8) * 45;
      polyVerts.push(project3D(vx, vy, vz, rotX, rotY));
    }

    ctx.beginPath();
    for (let i = 0; i < polyVerts.length; i++) {
      for (let j = i + 1; j < polyVerts.length; j++) {
        if (Math.hypot(polyVerts[i].x - polyVerts[j].x, polyVerts[i].y - polyVerts[j].y) < 70) {
          ctx.moveTo(polyVerts[i].x, polyVerts[i].y);
          ctx.lineTo(polyVerts[j].x, polyVerts[j].y);
        }
      }
    }
    ctx.strokeStyle = 'rgba(34, 211, 238, 0.22)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Nodos en los vértices centrales
    polyVerts.forEach((v) => {
      ctx.beginPath();
      ctx.arc(v.x, v.y, 2.5 * v.scale, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    });

    // 4. Satélites en órbita activa
    satellites.forEach((sat, idx) => {
      sat.angle += rings[sat.ringIndex].speed * 2.2;
      const ring = rings[sat.ringIndex];
      const rawX = Math.cos(sat.angle) * sat.distance;
      const rawY = Math.sin(sat.angle) * sat.distance * Math.cos(ring.tiltX);
      const rawZ = Math.sin(sat.angle) * sat.distance * Math.sin(ring.tiltY);

      const p = project3D(rawX, rawY, rawZ, rotX, rotY);

      // Nodo satelital
      ctx.beginPath();
      ctx.arc(p.x, p.y, sat.size * p.scale, 0, Math.PI * 2);
      ctx.fillStyle = idx === 0 ? '#22D3EE' : '#FFFFFF';
      ctx.fill();

      // Halo pulsante
      if (idx === 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, (sat.size + 4) * p.scale, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    });

    requestAnimationFrame(render);
  }

  render();
}

/* ─────────────────────────────────────
   CURSOR MAGNÉTICO
───────────────────────────────────── */
function initMagneticCursor() {
  if (typeof gsap === 'undefined') return;
  const magnetics = document.querySelectorAll('.btn-clay, .btn-outline, .project-card');

  magnetics.forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect    = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top  + rect.height / 2;
      const maxMove = el.classList.contains('project-card') ? 6 : 14;
      gsap.to(el, {
        x: Math.max(-maxMove, Math.min(maxMove, (e.clientX - centerX) * 0.15)),
        y: Math.max(-maxMove, Math.min(maxMove, (e.clientY - centerY) * 0.15)),
        duration: 0.3, ease: 'power2.out',
      });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ─────────────────────────────────────
   INIT HOMEPAGE
───────────────────────────────────── */
window.addEventListener('hashchange', () => {
  scrollToHashTarget();
});

const initHomePage = () => {
  initPreloader();
  initMagneticCursor();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHomePage, { once: true });
} else {
  initHomePage();
}

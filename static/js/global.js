/* ═══════════════════════════════════════
   SCROLL STUDIOS — global.js
   Lógica compartida por todas las páginas
═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

/* ─────────────────────────────────────
   CURSOR PERSONALIZADO (Solo Desktop)
───────────────────────────────────── */
const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches;
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
const isTouchDevice = hasCoarsePointer && !hasFinePointer;

if (!isTouchDevice) {
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.classList.add('cursor-dot');
  ring.classList.add('cursor-ring');
  document.body.appendChild(dot);
  document.body.appendChild(ring);
  document.body.classList.add('custom-cursor-active');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Ring sigue con lag suave
  const animateRing = () => {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  };
  animateRing();

  // Hover en links y botones agranda el ring
  const updateHoverTargets = () => {
    document.querySelectorAll('a, button, .service-card, .btn-primary, .btn-outline, .proj-item, .ch-submit').forEach(el => {
      if (el.dataset.cursorBound) return;
      el.dataset.cursorBound = "true";
      el.addEventListener('mouseenter', () => ring.classList.add('hover'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
  };
  updateHoverTargets();
  
  // Observar cambios en el DOM para nuevos elementos
  const observer = new MutationObserver(updateHoverTargets);
  observer.observe(document.body, { childList: true, subtree: true });

  // Ocultar cursor al salir de la ventana
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}


/* ─────────────────────────────────────
   HEADER — SCROLL + HIDE/SHOW
───────────────────────────────────── */
const header = document.querySelector('header');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentY = window.scrollY;

  // Agregar clase scrolled para el fondo
  currentY > 20
    ? header.classList.add('scrolled')
    : header.classList.remove('scrolled');

  // Ocultar al bajar, mostrar al subir
  if (currentY > lastScrollY && currentY > 80) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }

  lastScrollY = currentY <= 0 ? 0 : currentY;
});


/* ─────────────────────────────────────
   HAMBURGER MENU
───────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburger && mobileMenu) {
  // Crear overlay
  const overlay = document.createElement('div');
  overlay.classList.add('mobile-overlay');
  document.body.appendChild(overlay);

  const openMenu = () => {
    mobileMenu.style.display = 'flex';
    overlay.style.display    = 'block';
    mobileMenu.getBoundingClientRect();
    overlay.getBoundingClientRect();
    hamburger.classList.add('open');
    mobileMenu.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // Animar los links de forma fluida escalonada
    if (typeof gsap === 'undefined') return;
    gsap.fromTo('.mobile-menu a', 
      { opacity: 0, x: 60 }, 
      { opacity: 1, x: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out', delay: 0.15 }
    );
  };

  const closeMenu = () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';

    // Salida suave antes de ocultar
    if (typeof gsap !== 'undefined') {
      gsap.to('.mobile-menu a', { opacity: 0, x: 40, duration: 0.35, ease: 'power2.in' });
    }

    setTimeout(() => {
      if (!mobileMenu.classList.contains('open')) {
        mobileMenu.style.display = 'none';
        overlay.style.display    = 'none';
      }
    }, 500);
  };

  hamburger.addEventListener('click', () => {
    hamburger.classList.contains('open') ? closeMenu() : openMenu();
  });

  overlay.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(l => l.addEventListener('click', closeMenu));
}


/* ─────────────────────────────────────
   SCROLL REVEAL
───────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const delay = parseInt(entry.target.dataset.delay || '0', 10);
    setTimeout(() => entry.target.classList.add('visible'), delay);
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ─────────────────────────────────────
   EXPERIENCIA PREMIUM — SCROLLTRIGGER
───────────────────────────────────── */
function initPremiumScroll() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  const motion = gsap.matchMedia();

  motion.add('(prefers-reduced-motion: no-preference)', () => {
    const heroLayers = document.querySelectorAll(
      '.hero-bg, .nos-hero-deco, .proj-hero-deco'
    );

    heroLayers.forEach(layer => {
      gsap.to(layer, {
        yPercent: layer.classList.contains('hero-bg') ? 14 : -18,
        ease: 'none',
        scrollTrigger: {
          trigger: layer.closest('section') || layer,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });
    });

    const nosotrosHero = document.querySelector('.nos-hero-content');
    if (nosotrosHero) {
      gsap.fromTo(nosotrosHero, {
        opacity: 0,
        y: 36,
      }, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.nos-hero',
          start: 'top 82%',
          once: true,
        },
      });
    }

    const contactHero = document.querySelector('.contacto-hero');
    if (contactHero) {
      gsap.to('.ch-left', {
        yPercent: -4,
        ease: 'none',
        scrollTrigger: {
          trigger: contactHero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.1,
        },
      });

      gsap.to('.ch-right', {
        yPercent: 4,
        ease: 'none',
        scrollTrigger: {
          trigger: contactHero,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.1,
        },
      });

      gsap.fromTo('.ch-divider', {
        scaleY: 0,
        transformOrigin: 'top center',
      }, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: contactHero,
          start: 'top 70%',
          end: 'top 20%',
          scrub: 0.8,
        },
      });
    }

    document.querySelectorAll('section').forEach(section => {
      const tag = section.querySelector('.section-tag');
      if (!tag || tag.classList.contains('nos-tag')) return;

      gsap.fromTo(tag, {
        opacity: 0,
        x: -18,
      }, {
        opacity: 1,
        x: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          once: true,
        },
      });
    });

    document.querySelectorAll('.service-card, .valor-card, .proj-item').forEach(item => {
      gsap.to(item, {
        y: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: item,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.6,
        },
      });
    });

    gsap.utils.toArray('.diff-banner, .nos-numbers, .proj-coming').forEach(element => {
      gsap.fromTo(element, {
        clipPath: 'inset(0 0 100% 0)',
      }, {
        clipPath: 'inset(0 0 0% 0)',
        duration: 1.1,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: element,
          start: 'top 85%',
          once: true,
        },
      });
    });
  });
}

initPremiumScroll();


/* ─────────────────────────────────────
   ACTIVE NAV LINK según página actual
───────────────────────────────────── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.header-nav a, .mobile-menu a').forEach(link => {
  const href = link.getAttribute('href');
  if (href === currentPage || (currentPage === '' && href === 'index.html')) {
    link.classList.add('active');
  }
});

}); // fin DOMContentLoaded
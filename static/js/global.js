/* ═══════════════════════════════════════
   SCROLL STUDIOS — global.js
   Lógica compartida por todas las páginas
═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

/* ─────────────────────────────────────
   CURSOR PERSONALIZADO
───────────────────────────────────── */
const dot  = document.createElement('div');
const ring = document.createElement('div');
dot.classList.add('cursor-dot');
ring.classList.add('cursor-ring');
document.body.appendChild(dot);
document.body.appendChild(ring);

let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + 'px';
  dot.style.top  = mouseY + 'px';
});

// Ring sigue con lag suave
function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  ring.style.left = ringX + 'px';
  ring.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
}
animateRing();

// Hover en links y botones agranda el ring
document.querySelectorAll('a, button, .service-card, .btn-primary, .btn-outline').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

// Ocultar cursor al salir de la ventana
document.addEventListener('mouseleave', () => {
  dot.style.opacity  = '0';
  ring.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  dot.style.opacity  = '1';
  ring.style.opacity = '1';
});


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
  };

  const closeMenu = () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(() => {
      if (!mobileMenu.classList.contains('open')) {
        mobileMenu.style.display = 'none';
        overlay.style.display    = 'none';
      }
    }, 380);
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
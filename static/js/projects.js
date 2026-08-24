/* ═══════════════════════════════════════
   SCROLL STUDIOS — projects.js
   Imagen que sigue el cursor + GSAP
═══════════════════════════════════════ */

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ── Preloader ── */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const numEl     = document.getElementById('preloader-num');
  const barEl     = document.getElementById('preloader-bar');
  const counter   = document.querySelector('.preloader-counter');
  const lines     = document.querySelectorAll('.preloader-line span');
  const subWrap   = document.querySelector('.preloader-sub-wrap');
  const curtain   = document.querySelector('.preloader-curtain');

  if (!preloader) return;

  if (typeof gsap === 'undefined') {
    preloader.classList.add('done');
    preloader.style.display = 'none';
    document.body.style.overflow = '';
    return;
  }

  document.body.style.overflow = 'hidden';

  const tl = gsap.timeline();
  tl.to(counter, { opacity: 1, duration: 0.4, ease: 'power2.out' })
    .to(lines, { y: 0, duration: 1, ease: 'power4.out', stagger: 0.12 }, '-=0.1')
    .to(subWrap, { opacity: 1, duration: 0.5 }, '-=0.5')
    .to({}, {
      duration: 2, ease: 'power1.inOut',
      onUpdate: function() {
        const val = Math.round(this.progress() * 100);
        numEl.textContent = val;
        barEl.style.width = val + '%';
      }
    }, '-=0.8')
    .to({}, { duration: 0.15 })
    .to(lines, { y: '-110%', duration: 0.7, ease: 'power4.in', stagger: 0.06 })
    .to([counter, subWrap], { opacity: 0, duration: 0.3 }, '<')
    .to(curtain, { scaleY: 1, duration: 0.55, ease: 'power3.inOut', transformOrigin: 'bottom' }, '-=0.15')
    .to(curtain, { scaleY: 0, duration: 0.65, ease: 'power3.inOut', transformOrigin: 'top' })
    .add(() => {
      preloader.classList.add('done');
      gsap.set(preloader, { display: 'none' });
      document.body.style.overflow = '';
      initPageAnimations();
      initHoverImage();
    });
}


/* ── Animaciones de entrada ── */
function initPageAnimations() {
  // Hero título — línea por línea
  const titleLines = document.querySelectorAll('.proj-title-line');
  gsap.from(titleLines, {
    y: '110%',
    duration: 0.9,
    ease: 'power4.out',
    stagger: 0.1,
    delay: 0.1,
  });

  gsap.from('.proj-hero-top, .proj-hero-sub', {
    opacity: 0, y: 20, duration: 0.7, ease: 'power2.out', stagger: 0.1, delay: 0.4,
  });

  // Items de la lista
  gsap.from('.proj-item', {
    opacity: 0, y: 40, duration: 0.7, ease: 'power2.out', stagger: 0.1,
    scrollTrigger: { trigger: '.proj-list', start: 'top 80%' }
  });

  // CTA
  gsap.from('.proj-cta-big span', {
    opacity: 0, y: 50, duration: 0.8, ease: 'power3.out', stagger: 0.08,
    scrollTrigger: { trigger: '.proj-cta', start: 'top 75%' }
  });
}


/* ── IMAGEN FLOTANTE QUE SIGUE EL CURSOR ── */
function initHoverImage() {
  if (typeof gsap === 'undefined') return;
  const cursorImg   = document.getElementById('proj-cursor-img');
  const cursorImgEl = document.getElementById('proj-cursor-img-el');
  const items       = document.querySelectorAll('.proj-item');

  let mouseX = 0, mouseY = 0;
  let currentImg = '';
  let isVisible  = false;

  // Seguir el cursor con GSAP (suave y con lag)
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (isVisible) {
      gsap.to(cursorImg, {
        x: mouseX,
        y: mouseY,
        duration: 0.6,
        ease: 'power2.out',
      });
    }
  });

  items.forEach(item => {
    const imgSrc = item.dataset.img;

    item.addEventListener('mouseenter', () => {
      if (!imgSrc) return;

      // Cambiar imagen si es diferente
      if (currentImg !== imgSrc) {
        cursorImgEl.src = imgSrc;
        currentImg = imgSrc;
      }

      isVisible = true;
      cursorImg.classList.add('visible');

      // Posición inicial
      gsap.set(cursorImg, { x: mouseX, y: mouseY });

      // Animación de aparición
      gsap.to(cursorImg, {
        opacity: 1,
        scale: 1,
        rotate: -2,
        duration: 0.4,
        ease: 'power3.out',
      });
    });

    item.addEventListener('mouseleave', () => {
      isVisible = false;
      cursorImg.classList.remove('visible');

      gsap.to(cursorImg, {
        opacity: 0,
        scale: 0.88,
        rotate: -4,
        duration: 0.3,
        ease: 'power2.in',
      });
    });

    // Efecto parallax de la imagen dentro del item
    item.addEventListener('mousemove', (e) => {
      const rect   = item.getBoundingClientRect();
      const relX   = (e.clientX - rect.left) / rect.width  - 0.5;
      const relY   = (e.clientY - rect.top)  / rect.height - 0.5;

      gsap.to(cursorImg, {
        rotate: relX * 6,
        duration: 0.4,
        ease: 'power1.out',
      });
    });
  });
}


/* ── Cursor magnético en CTA ── */
function initMagnetic() {
  if (typeof gsap === 'undefined') return;
  document.querySelectorAll('.proj-cta-link, .btn-primary').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - rect.left - rect.width  / 2) * 0.25,
        y: (e.clientY - rect.top  - rect.height / 2) * 0.25,
        duration: 0.3, ease: 'power2.out',
      });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });
}


/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initMagnetic();
});
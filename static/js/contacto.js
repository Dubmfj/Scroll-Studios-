/* ═══════════════════════════════════════
   SCROLL STUDIOS — contacto.js
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
    .to(subWrap, { opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.5')
    .to({}, {
      duration: 2, ease: 'power1.inOut',
      onUpdate: function() {
        const val = Math.round(this.progress() * 100);
        numEl.textContent = val;
        barEl.style.width = val + '%';
      },
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
    });
}

/* ── Animaciones de entrada ── */
function initPageAnimations() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  // Líneas del título
  tl.to('.ch-line', {
    opacity: 1, y: 0, duration: 0.9, stagger: 0.12,
  })
  .to('.ch-contact-btn', { opacity: 1, duration: 0.6 }, '-=0.3')
  .to('.ch-sidebar', { opacity: 1, duration: 0.6 }, '-=0.2')
  .to('.ch-right', { opacity: 1, duration: 0.7 }, '-=0.4');
}

/* ── Formulario → WhatsApp ── */
function initForm() {
  const form      = document.getElementById('contact-form');
  const btnSubmit = form?.querySelector('.ch-submit');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre   = document.getElementById('nombre')?.value.trim();
    const contacto = document.getElementById('contacto-input')?.value.trim();
    const servicio = document.getElementById('servicio')?.value;
    const mensaje  = document.getElementById('mensaje')?.value.trim();

    if (!nombre || !servicio || !mensaje) return;

    const texto =
      `Hola Scroll Studios! 👋%0A%0A` +
      `*Nombre:* ${nombre}%0A` +
      `*Contacto:* ${contacto || 'No indicado'}%0A` +
      `*Servicio:* ${servicio}%0A%0A` +
      `*Proyecto:*%0A${mensaje}`;

    window.open(`https://wa.me/51987355501?text=${texto}`, '_blank');

    const btnText = btnSubmit?.querySelector('.ch-submit-text');
    if (btnText) {
      const original = btnText.textContent;
      btnText.textContent = '✓ Enviado!';
      btnSubmit.style.borderColor = '#28c840';
      setTimeout(() => {
        btnText.textContent = original;
        btnSubmit.style.borderColor = '';
        form.reset();
      }, 3000);
    }
  });
}

/* ── Cursor magnético ── */
function initMagneticCursor() {
  if (typeof gsap === 'undefined') return;
  document.querySelectorAll('.ch-submit, .ch-contact-btn, .btn-primary, .btn-outline').forEach(el => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - rect.left - rect.width  / 2) * 0.3,
        y: (e.clientY - rect.top  - rect.height / 2) * 0.3,
        duration: 0.3, ease: 'power2.out',
      });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ── INIT ── */
const initContactoPage = () => {
  initPreloader();
  initForm();
  initMagneticCursor();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactoPage, { once: true });
} else {
  initContactoPage();
}
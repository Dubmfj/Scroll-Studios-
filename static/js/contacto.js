/* ═══════════════════════════════════════
   SCROLL STUDIOS — contacto.js
═══════════════════════════════════════ */

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
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
  initPageAnimations();
  initForm();
  initMagneticCursor();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initContactoPage, { once: true });
} else {
  initContactoPage();
}
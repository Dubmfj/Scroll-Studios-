/* ═══════════════════════════════════════
   SCROLL STUDIOS — nosotros.js
═══════════════════════════════════════ */

if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/* ── Animaciones de scroll ── */
function initAnimations() {

  gsap.fromTo('.nos-historia-left', { opacity: 0, x: -40 }, {
    opacity: 1, x: 0, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: '.nos-historia', start: 'top 75%' }
  });

  gsap.fromTo('.nos-historia-right', { opacity: 0, x: 40 }, {
    opacity: 1, x: 0, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: '.nos-historia', start: 'top 75%' }
  });

  gsap.fromTo('.valor-card', { opacity: 0, y: 50 }, {
    opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1,
    scrollTrigger: { trigger: '.nos-valores-grid', start: 'top 80%' }
  });

  gsap.fromTo('.nos-stack-left', { opacity: 0, x: -40 }, {
    opacity: 1, x: 0, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: '.nos-stack', start: 'top 75%' }
  });

  gsap.fromTo('.nos-stack-right', { opacity: 0, x: 40 }, {
    opacity: 1, x: 0, duration: 0.9, ease: 'power2.out',
    scrollTrigger: { trigger: '.nos-stack', start: 'top 75%' }
  });

  gsap.fromTo('.nos-number', { opacity: 0, y: 30 }, {
    opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', stagger: 0.1,
    scrollTrigger: { trigger: '.nos-numbers', start: 'top 80%' }
  });

  gsap.fromTo('.cta-title, .cta-sub, .cta-btn', { opacity: 0, y: 30 }, {
    opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', stagger: 0.12,
    scrollTrigger: { trigger: '.cta-final', start: 'top 80%' }
  });
}

/* ── Contadores ── */
function initCounters() {
  if (typeof gsap === 'undefined') return;
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

  document.querySelectorAll('.nos-numbers').forEach(el => obs.observe(el));
}

/* ── Cursor magnético ── */
function initMagneticCursor() {
  if (typeof gsap === 'undefined') return;
  document.querySelectorAll('.cta-btn, .btn-primary, .btn-outline').forEach(el => {
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
const initNosotrosPage = () => {
  initAnimations();
  initCounters();
  initMagneticCursor();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNosotrosPage, { once: true });
} else {
  initNosotrosPage();
}
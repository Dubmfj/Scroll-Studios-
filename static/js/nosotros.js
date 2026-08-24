/* ═══════════════════════════════════════
   SCROLL STUDIOS — nosotros.js
═══════════════════════════════════════ */

gsap.registerPlugin(ScrollTrigger);

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
      initAnimations();
    });
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
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCounters();
  initMagneticCursor();
});
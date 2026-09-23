/* ============================================================
   AI Buildathon — Hero interactions
   Terminal typing / GSAP entrance timeline
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  typeTerminalLine();
  runHeroTimeline();
  setupNavToggle();
});

/* ---------------- Terminal typing effect ---------------- */

function typeTerminalLine() {
  const el = document.getElementById('terminalText');
  if (!el) return;

  const message = 'initializing_buildathon.sh --mode=build --team=you';
  let i = 0;

  function type() {
    if (i <= message.length) {
      el.textContent = message.slice(0, i);
      i++;
      setTimeout(type, 28);
    }
  }

  type();
}

/* ---------------- GSAP entrance timeline ---------------- */

function runHeroTimeline() {
  if (typeof gsap === 'undefined') return;

  gsap.set('.hero-lockup, .hero-subtitle, .reg-period, .hero-cta', { y: 16 });
  gsap.set('.ribbon-banner', { scale: 0.6, rotate: -14 });

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('.hero-lockup', { opacity: 1, y: 0, duration: 0.55 }, 0.3)
    .to('.hero-title .line', {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.12,
    }, 0.5)
    .to('.ribbon-banner', {
      opacity: 1,
      scale: 1,
      rotate: -4,
      duration: 0.6,
      ease: 'back.out(1.7)',
    }, '-=0.35')
    .to('.hero-subtitle', { opacity: 1, y: 0, duration: 0.7 }, '-=0.3')
    .to('.reg-period', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
    .to('.hero-cta', { opacity: 1, y: 0, duration: 0.7 }, '-=0.4');
}

/* ---------------- Mobile nav toggle ---------------- */

function setupNavToggle() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('open', isOpen);
    toggle.setAttribute('aria-expanded', String(isOpen));
  });

  links.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
}

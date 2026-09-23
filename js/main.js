/* ============================================================
   AI Buildathon — Hero interactions
   Terminal typing / GSAP entrance timeline / countdown
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  typeTerminalLine();
  runHeroTimeline();
  startCountdown();
  setupNavToggle();
  setupHeroFrames();
});

/* ---------------- Hero background frame sequence: scroll-scrub ---------------- */

function setupHeroFrames() {
  const canvas = document.getElementById('heroCanvas');
  const hero = document.getElementById('hero');
  if (!canvas || !hero) return;

  const FRAME_COUNT = 240;
  const FRAME_PATH = (i) => `assets/frames/frame_${String(i).padStart(3, '0')}.jpg`;

  const ctx = canvas.getContext('2d');
  const images = new Array(FRAME_COUNT);
  let currentIndex = 0;
  let dpr = Math.min(window.devicePixelRatio || 1, 2);

  function resizeCanvas() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = hero.offsetWidth * dpr;
    canvas.height = hero.offsetHeight * dpr;
    drawFrame(currentIndex);
  }

  function drawFrame(index) {
    const img = images[index];
    if (!img || !img.complete || !img.naturalWidth) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  function loadFrame(i) {
    if (images[i]) return images[i];
    const img = new Image();
    img.src = FRAME_PATH(i + 1);
    images[i] = img;
    return img;
  }

  const firstImg = loadFrame(0);
  firstImg.onload = () => {
    resizeCanvas();
  };

  // Preload the rest in the background after the first frame is visible.
  for (let i = 1; i < FRAME_COUNT; i++) {
    const img = loadFrame(i);
    if (i === FRAME_COUNT - 1) {
      img.onload = bindScrubWhenReady;
    }
  }

  window.addEventListener('resize', resizeCanvas);

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  let scrubBound = false;
  function bindScrubWhenReady() {
    if (scrubBound) return;
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    scrubBound = true;
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: '+=150%',
      pin: true,
      pinSpacing: true,
      scrub: 0.6,
      onUpdate: (self) => {
        const index = Math.min(FRAME_COUNT - 1, Math.round(self.progress * (FRAME_COUNT - 1)));
        if (index !== currentIndex) {
          currentIndex = index;
          drawFrame(currentIndex);
        }
      },
    });
  }
}

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

  gsap.set('.hero-lockup, .hero-subtitle, .reg-period, .hero-cta, .countdown', { y: 16 });
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
    .to('.hero-cta', { opacity: 1, y: 0, duration: 0.7 }, '-=0.4')
    .to('.countdown', { opacity: 1, y: 0, duration: 0.7 }, '-=0.45');
}

/* ---------------- Countdown timer ---------------- */

function startCountdown() {
  const dEl = document.getElementById('cdDays');
  const hEl = document.getElementById('cdHours');
  const mEl = document.getElementById('cdMins');
  const sEl = document.getElementById('cdSecs');
  if (!dEl || !hEl || !mEl || !sEl) return;

  // TODO: update to the confirmed event date/time.
  const target = new Date('2026-11-15T09:00:00+05:30').getTime();

  function pad(n) {
    return String(n).padStart(2, '0');
  }

  function tick() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      [dEl, hEl, mEl, sEl].forEach((el) => (el.textContent = '00'));
      clearInterval(timer);
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins = Math.floor((diff / (1000 * 60)) % 60);
    const secs = Math.floor((diff / 1000) % 60);

    dEl.textContent = pad(days);
    hEl.textContent = pad(hours);
    mEl.textContent = pad(mins);
    sEl.textContent = pad(secs);
  }

  tick();
  const timer = setInterval(tick, 1000);
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

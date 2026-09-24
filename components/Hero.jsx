'use client';

import { useEffect, useRef } from 'react';

const FRAME_COUNT = 60;
const frameSrc = (i) => `/assets/hero-frames/frame_${String(i).padStart(3, '0')}.jpg`;

export default function Hero() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const rafRef = useRef(null);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const currentFrameIndex = useRef(-1);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const content = contentRef.current;
    const ctx = canvas.getContext('2d');

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      // The canvas fills the pinned viewport (window size), not the tall
      // scroll-distance wrapper around it.
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    // Load the sequence with bounded concurrency instead of firing all
    // requests at once — that blast was saturating the browser's per-origin
    // connection pool and stalling every other asset on the page (fonts,
    // other sections' images, etc.), which is what made everything feel
    // slow to load. The first handful of frames get priority so the hero
    // paints and is scrubbable immediately; the rest stream in afterward.
    //
    // `frames` is only ever read via this closure, never through a ref —
    // React 18 Strict Mode runs this effect twice on mount, and an earlier
    // version stashed the array in a ref (`framesRef.current`). The second
    // run's assignment clobbered the first run's array, so that first run's
    // in-flight `onload` callbacks ended up drawing against the second
    // run's (still-loading) images and nothing ever painted.
    const frames = Array.from({ length: FRAME_COUNT }, () => new Image());

    const EAGER_COUNT = 12;
    const CONCURRENCY = 4;
    let nextToQueue = 0;
    let inFlight = 0;
    let cancelled = false;

    const loadOne = (i) => {
      inFlight++;
      const img = frames[i];
      img.onload = img.onerror = () => {
        inFlight--;
        if (!cancelled && currentFrameIndex.current === i) drawFrame(i, true);
        pump();
      };
      img.src = frameSrc(i + 1);
    };

    const pump = () => {
      if (cancelled) return;
      while (inFlight < CONCURRENCY && nextToQueue < FRAME_COUNT) {
        loadOne(nextToQueue);
        nextToQueue++;
      }
    };

    for (let i = 0; i < Math.min(EAGER_COUNT, FRAME_COUNT); i++) {
      loadOne(i);
      nextToQueue = i + 1;
    }
    pump();

    // object-fit: cover, done manually since it's a canvas draw, not an <img>.
    const drawCover = (img) => {
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      if (!iw || !ih) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      const dx = (cw - dw) / 2;
      const dy = (ch - dh) / 2;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, dx, dy, dw, dh);
    };

    const drawFrame = (index, force) => {
      if (!force && index === currentFrameIndex.current) return;
      currentFrameIndex.current = index;
      const img = frames[index];
      if (img && img.complete && img.naturalWidth) {
        drawCover(img);
      }
    };

    // Background parallax removed in favor of the frame sequence itself
    // carrying the motion; content still fades/lifts/blurs away on scroll.
    const applyProgress = (progress) => {
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.round(progress * (FRAME_COUNT - 1)))
      );
      drawFrame(frameIndex);

      const fade = Math.min(progress / 0.85, 1);
      content.style.opacity = String(1 - fade);
      content.style.transform = `translateY(${-fade * 90}px)`;
      content.style.filter = `blur(${fade * 4}px)`;
    };

    const measureTarget = () => {
      const rect = section.getBoundingClientRect();
      const scrollDistance = section.offsetHeight - window.innerHeight;
      targetProgress.current =
        scrollDistance > 0 ? Math.min(Math.max(-rect.top / scrollDistance, 0), 1) : 0;
    };

    const tick = () => {
      const diff = targetProgress.current - currentProgress.current;
      if (Math.abs(diff) > 0.0006) {
        currentProgress.current += diff * 0.12;
      } else {
        currentProgress.current = targetProgress.current;
      }
      applyProgress(currentProgress.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    const onScroll = () => measureTarget();
    const onResize = () => {
      resize();
      drawFrame(currentFrameIndex.current, true);
    };

    resize();
    measureTarget();
    currentProgress.current = targetProgress.current;
    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      cancelled = true;
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[350vh] max-[860px]:h-auto bg-[#010101]">
      <div className="sticky top-0 h-screen max-[860px]:h-auto max-[860px]:pb-16 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.15)] via-[rgba(0,0,0,0.35)] to-[rgba(0,0,0,0.6)]" />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center gap-6 max-w-[735px] mx-auto px-6 text-center"
        style={{ willChange: 'transform, opacity, filter' }}
      >
        <div className="bg-[rgba(6,229,229,0.06)] border border-[rgba(6,229,229,0.25)] flex items-center gap-2 px-4 py-2">
          <span className="font-mono font-semibold text-[13.6px] text-violet-soft">{'➜'}</span>
          <span className="font-mono text-[13.6px] text-cyan">initializing_buildathon.sh --mode=build --team=you</span>
          <span className="font-mono text-[13.6px] text-cyan animate-blink">▌</span>
        </div>

        <div className="flex items-center gap-3.5">
          <div className="bg-white px-3 py-1.5 flex items-center">
            <img src="/assets/iaib-logo.png" alt="IAIB" className="h-[18px] w-auto object-contain" />
          </div>
          <div className="w-px h-4 bg-border" />
          <span className="font-mono text-[10.88px] tracking-[2.6px] text-text-dimmer">PRESENTS</span>
        </div>

        <div className="relative flex flex-col items-center">
          <h1 className="font-poster text-[128px] max-[860px]:text-[15vw] leading-[0.94] uppercase text-white text-center tracking-[0.64px]">
            {`BUILD WHAT'S`}
          </h1>
          <h1
            className="font-poster text-[128px] max-[860px]:text-[15vw] leading-[0.94] uppercase text-center tracking-[0.64px] bg-clip-text text-transparent bg-gradient-text animate-gradient-shift"
            style={{ backgroundSize: '300% 100%' }}
          >
            NEXT WITH AI
          </h1>
        </div>

        <p className="font-body text-[19.2px] leading-[1.6] text-text-dim">
          Ship an idea from zero to demo in 48 hours. Team up with builders, get mentored by engineers from top AI labs, and compete for{' '}
          <span className="font-bold text-text">₹10,00,000</span> in prizes.
        </p>

        <div className="flex flex-col items-center gap-1.5">
          <span className="font-mono text-[11.2px] tracking-[2px] uppercase text-text-dimmer">Registration Period</span>
          <span className="font-display font-bold text-[18.4px] text-text">23 Sep – 15 Nov 2026</span>
        </div>

        <div className="flex items-center gap-5 max-[700px]:flex-col">
          <a
            href="#"
            className="bg-red flex items-center gap-2 pl-3.5 pr-3 py-3 text-white font-body font-semibold text-[13.3px] hover:bg-[#ff1a28] transition-colors"
          >
            Register for Free
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M6 14L14 6M14 6H7M14 6V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#" className="px-5 py-3 text-white font-body font-semibold text-[13.3px] hover:opacity-80 transition-opacity">
            Explore the Olympiad
          </a>
        </div>
      </div>
      </div>
    </section>
  );
}

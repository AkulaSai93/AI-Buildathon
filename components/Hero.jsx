'use client';

import { useEffect, useRef } from 'react';

const FRAME_COUNT = 60;
const frameSrc = (i) => `/assets/hero-frames/frame_${String(i).padStart(3, '0')}.jpg`;

// Three states share one pinned viewport. The windows overlap so each frame
// starts arriving while the previous is still leaving — that read as one
// camera move rather than three stacked sections.
const HERO_OUT = [0.28, 0.4];
const GOK_IN = [0.3, 0.44];
const GOK_OUT = [0.6, 0.72];
const UNI_IN = [0.62, 0.76];
// The frame sequence finishes inside frame 01 so the hero has completed its
// own animation by the time it hands off.
const SEQUENCE_END = 0.38;

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const phase = (p, [start, end]) => clamp01((p - start) / (end - start));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

export default function Hero() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const contentRef = useRef(null);
  const gokRef = useRef(null);
  const uniRef = useRef(null);
  const rafRef = useRef(null);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);
  const currentFrameIndex = useRef(-1);

  useEffect(() => {
    const section = sectionRef.current;
    const canvas = canvasRef.current;
    const content = contentRef.current;
    const gok = gokRef.current;
    const uni = uniRef.current;
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

    // One pinned viewport, three states. The shared frame-sequence backdrop
    // stays put while the foreground blocks hand off to each other.
    const applyProgress = (progress) => {
      const frameIndex = Math.min(
        FRAME_COUNT - 1,
        Math.max(0, Math.round(clamp01(progress / SEQUENCE_END) * (FRAME_COUNT - 1)))
      );
      drawFrame(frameIndex);

      // Frame 01 — existing hero, unchanged apart from how it leaves.
      const heroOut = easeOut(phase(progress, HERO_OUT));
      content.style.opacity = String(1 - heroOut);
      content.style.transform = `translate3d(0, ${-heroOut * 90}px, 0) scale(${1 + heroOut * 0.06})`;
      content.style.filter = `blur(${heroOut * 4}px)`;
      content.style.pointerEvents = heroOut > 0.5 ? 'none' : 'auto';

      // Frames 02 and 03 — each rises in from slightly back and below, then
      // lifts away as the next takes over.
      const settle = (el, inWindow, outWindow) => {
        if (!el) return;
        const enter = easeOut(phase(progress, inWindow));
        const exit = outWindow ? easeOut(phase(progress, outWindow)) : 0;
        const y = 48 * (1 - enter) - 60 * exit;
        const scale = 0.94 + enter * 0.06 + exit * 0.05;
        el.style.opacity = String(clamp01(enter - exit));
        el.style.transform = `translate3d(0, ${y}px, 0) scale(${scale})`;
      };

      settle(gok, GOK_IN, GOK_OUT);
      settle(uni, UNI_IN, null);
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
    <section id="home" ref={sectionRef} className="relative h-[600vh] max-[860px]:h-auto bg-[#010101]">
      <div className="sticky top-0 h-screen max-[860px]:h-auto max-[860px]:pb-16 overflow-hidden flex items-center justify-center">
      <div className="absolute inset-0">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(0,0,0,0.15)] via-[rgba(0,0,0,0.35)] to-[rgba(0,0,0,0.6)]" />
      </div>

      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center gap-[24px] w-[837px] max-w-[calc(100%-48px)] mx-auto text-center"
        style={{ willChange: 'transform, opacity, filter' }}
      >
        <div className="bg-[rgba(6,229,229,0.06)] border border-[rgba(6,229,229,0.25)] flex items-center gap-[8px] min-h-[20px] px-[16px] py-[8px] max-[720px]:px-3 max-[720px]:py-2">
          <span className="font-mono font-semibold text-[13.6px] max-[720px]:text-[10px] text-violet-soft">{'➜'}</span>
          <span className="font-mono text-[13.6px] max-[720px]:text-[10px] text-cyan">
            India&rsquo;s Largest AI Talent Discovery and Development Platform
          </span>
          <span className="font-mono text-[13.6px] max-[720px]:text-[10px] text-cyan animate-blink">▌</span>
        </div>

        <div className="flex flex-col gap-[16px] items-center w-full">
          <div className="flex flex-col gap-[14px] items-center w-[695px] max-w-full">
            <h1 className="font-poster text-[128px] max-[900px]:text-[13.5vw] leading-[120.32px] max-[900px]:leading-[1.05] tracking-[0.64px] uppercase text-white w-full whitespace-nowrap">
              I<span className="text-red">AI</span>B Ignite
            </h1>
            <h1
              className="font-poster text-[128px] max-[900px]:text-[13.5vw] leading-[120.32px] max-[900px]:leading-[1.05] tracking-[0.64px] uppercase w-full whitespace-nowrap bg-clip-text text-transparent bg-gradient-text animate-gradient-shift"
              style={{ backgroundSize: '300% 100%' }}
            >
              AI Buildathon
            </h1>
          </div>
          <p className="font-body text-[20px] max-[720px]:text-[15px] leading-normal text-text-dim w-full">
            IAIB stands to identify, nurture, and facilitate school students from classes 9th till 12th in learning about AI. They will get to learn AI, test their knowledge, and build solutions.
          </p>
        </div>

        <div className="flex flex-col gap-[6px] items-center">
          <span className="font-mono font-medium text-[14px] tracking-[2.016px] uppercase text-text-dimmer">Starts</span>
          <span className="font-display font-bold text-[18.4px] text-text px-[12px] py-[6px]">
            October 10th, 2026 | Bengaluru
          </span>
        </div>

        <div className="flex items-center gap-[20px] max-[560px]:flex-col max-[560px]:gap-3">
          <a
            href="#"
            className="bg-red flex items-center justify-center gap-[8px] pl-[14px] pr-[12px] py-[12px] text-white font-body font-semibold text-[13.333px] leading-[19.048px] hover:bg-[#ff1a28] transition-colors"
          >
            Register Now
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
              <path d="M6 14L14 6M14 6H7M14 6V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#"
            className="px-[20px] py-[12px] text-white font-body font-semibold text-[13.333px] leading-[19.048px] hover:opacity-80 transition-opacity"
          >
            Explore Buildathon
          </a>
        </div>
      </div>

      {/* Frame 02 — Supported by Government of Karnataka */}
      <div
        ref={gokRef}
        className="absolute inset-0 z-10 flex items-center justify-center px-6 opacity-0 pointer-events-none"
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="flex flex-col gap-[24px] items-center w-[424.6px] max-w-full text-center">
          <p className="font-display font-normal text-[24px] max-[640px]:text-[18px] leading-normal uppercase text-text w-full">
            Support By
          </p>
          <div className="flex flex-col gap-[28.6px] items-center w-full">
            <img
              src="/assets/partners-frames/gok.png"
              alt="Government of Karnataka"
              className="w-[200px] h-[200px] max-[640px]:w-[150px] max-[640px]:h-[150px] object-cover"
            />
            <p className="font-display font-bold text-[30.8px] max-[640px]:text-[22px] leading-normal text-text w-full">
              Government of Karnataka
            </p>
          </div>
        </div>
      </div>

      {/* Frame 03 — University partner */}
      <div
        ref={uniRef}
        className="absolute inset-0 z-10 flex items-center justify-center px-6 opacity-0 pointer-events-none"
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="flex flex-col gap-[24px] items-center w-[424.6px] max-w-full text-center">
          <p className="font-display font-normal text-[24px] max-[640px]:text-[18px] leading-normal uppercase text-text w-full">
            In partnership with
          </p>
          <div className="flex flex-col gap-[28.6px] items-center w-full">
            <img
              src="/assets/partners-frames/ssahe.png"
              alt="Sri Siddhartha Academy of Higher Education"
              className="w-[200px] h-[200px] max-[640px]:w-[150px] max-[640px]:h-[150px] object-cover"
            />
            <p className="font-display font-bold text-[30.8px] max-[640px]:text-[22px] leading-normal uppercase text-text w-full">
              Sri Siddhartha Academy of Higher Education
            </p>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}

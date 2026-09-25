'use client';

import { useEffect, useRef } from 'react';

const STEPS = [
  { image: '/assets/journey-cards/step-01-learn.webp', alt: '01 — Learning: 30 Days of Learning', label: 'Learning' },
  { image: '/assets/journey-cards/step-02-screen.webp', alt: '02 — Screening: Test + Build', label: 'Screening' },
  { image: '/assets/journey-cards/step-03-offline-buildathon.webp', alt: '03 — Offline Buildathon', label: 'Offline Buildathon' },
];

// Distance (in normalized scroll units) between each shard's foreground peak.
const STEP_WINDOW = 1 / (STEPS.length - 1);

export default function HowItWorks() {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const textRef = useRef(null);
  const sceneRef = useRef(null);
  const shardRefs = useRef([]);
  const arrowRefs = useRef([]);
  const rafRef = useRef(null);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Autoplay can get silently interrupted depending on load/hydration
    // timing, so keep nudging it to play whenever it stops unexpectedly.
    const ensurePlaying = () => {
      if (video.paused) {
        video.play().catch(() => {});
      }
    };

    ensurePlaying();
    video.addEventListener('pause', ensurePlaying);
    video.addEventListener('canplay', ensurePlaying);
    video.addEventListener('loadeddata', ensurePlaying);

    return () => {
      video.removeEventListener('pause', ensurePlaying);
      video.removeEventListener('canplay', ensurePlaying);
      video.removeEventListener('loadeddata', ensurePlaying);
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    const scene = sceneRef.current;

    // Every value below is a pure, continuous function of `progress` — no
    // thresholds, no setTimeout, no discrete "switch to next card" step.
    // Scrubbing back and forth (or stopping mid-scroll) lands exactly where
    // the math says it should, since nothing is time-based.
    const applyProgress = (progress) => {
      // Heading/description fade out early so the shards own the whole frame.
      const textFade = Math.min(progress / 0.1, 1);
      const textOpacity = 1 - textFade;
      if (text) {
        text.style.opacity = String(textOpacity);
        text.style.transform = `translateY(${-textFade * 30}px)`;
        text.style.pointerEvents = textOpacity < 0.1 ? 'none' : 'auto';
      }

      // Subtle camera orbit — a gentle, controlled drift, never a full spin.
      if (scene) {
        const camY = (progress - 0.5) * 10; // total swing: -5deg .. +5deg
        const camX = Math.sin(progress * Math.PI) * 2.5;
        scene.style.transform = `rotateY(${camY}deg) rotateX(${camX}deg)`;
      }

      shardRefs.current.forEach((el, i) => {
        if (!el) return;

        const center = i * STEP_WINDOW; // this shard's foreground peak, in scroll-space
        const delta = progress - center; // signed distance from its own peak
        const nd = delta / STEP_WINDOW; // normalized: -1 at previous peak, 0 at peak, +1 at next peak
        const absNd = Math.min(Math.abs(nd), 2.2);

        const opacity = Math.max(0, 1 - absNd * 0.8);
        const scale = Math.max(0.32, 1 - absNd * 0.42);
        const translateZ = -absNd * 460; // recedes into depth on both sides of its peak
        // Motion is dominantly vertical: rises in from below (positive Y),
        // settles at its peak (Y=0), then continues rising and out the top
        // as the next shard takes over — a bottom-to-top conveyor, not an
        // orbit/arc.
        const translateY = -nd * 640; // travels well past the viewport edge, so it genuinely enters from below
        const translateX = nd * 8; // near-zero lateral drift — motion reads as vertical, not diagonal
        const rotateX = nd * 12; // tumbles forward/back as it rises/recedes
        const rotateY = nd * -10;
        const rotateZ = nd * -3;
        const blurPx = Math.min(absNd * 5.5, 11);
        const zIndex = Math.round((1 - Math.min(absNd, 1)) * 100);

        el.style.opacity = String(opacity);
        el.style.zIndex = String(zIndex);
        el.style.filter = `blur(${blurPx}px)`;
        el.style.transform =
          `translate3d(${translateX}px, ${translateY}px, ${translateZ}px) ` +
          `rotateY(${rotateY}deg) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg) scale(${scale})`;
        el.style.pointerEvents = absNd < 0.35 ? 'auto' : 'none';

        // The callout only belongs to the shard sitting at its peak, so it
        // fades out as soon as that shard starts moving off centre.
        const arrow = arrowRefs.current[i];
        if (arrow) {
          const focus = Math.max(0, 1 - absNd / 0.3);
          arrow.style.opacity = String(focus);
          // -158px lines the path's starting corner up with the shard's centre.
          arrow.style.transform = `translateY(-158px) translateX(${(1 - focus) * -24}px)`;
        }
      });
    };

    const measureTarget = () => {
      const rect = section.getBoundingClientRect();
      const scrollDistance = section.offsetHeight - window.innerHeight;
      targetProgress.current =
        scrollDistance > 0 ? Math.min(Math.max(-rect.top / scrollDistance, 0), 1) : 0;
    };

    // The scroll position IS the timeline — this loop only smooths how fast
    // the rendered state chases that timeline, it never advances on its own.
    const tick = () => {
      const diff = targetProgress.current - currentProgress.current;
      if (Math.abs(diff) > 0.0004) {
        currentProgress.current += diff * 0.1;
      } else {
        currentProgress.current = targetProgress.current;
      }
      applyProgress(currentProgress.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    const onScroll = () => measureTarget();

    measureTarget();
    currentProgress.current = targetProgress.current;
    rafRef.current = requestAnimationFrame(tick);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', measureTarget);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', measureTarget);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[500vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
        {/* Continuously looping background video — a stable backdrop, not the
            thing driving the scroll animation. */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/assets/videos/how-it-works-bg.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        />

        {/* Darken slightly for text/shard readability */}
        <div className="absolute inset-0 bg-black/35 pointer-events-none z-10" />

        <div ref={textRef} className="relative z-10 flex flex-col items-center gap-[16px] text-center pt-[64px] px-6">
          <h2 className="font-display text-[40px] max-[640px]:text-[28px] font-bold uppercase leading-none text-white">
            How Does It Work?
          </h2>
          <p className="text-[16px] max-[640px]:text-[14px] leading-normal text-[rgba(255,255,255,0.85)] max-w-[640px]">
            Just a quick 3-step process and you&rsquo;re in!
          </p>
        </div>

        {/* The 3D gallery: a real perspective camera, with a scene that all
            shards share `transform-style: preserve-3d` inside, so their Z
            depths genuinely occlude/overlap each other like physical objects. */}
        <div
          className="absolute inset-0 flex items-center justify-center px-6"
          style={{ perspective: '1400px', perspectiveOrigin: '50% 50%' }}
        >
          <div
            ref={sceneRef}
            className="relative w-full h-full flex items-center justify-center"
            style={{ transformStyle: 'preserve-3d', transition: 'transform 0.3s ease-out' }}
          >
            {STEPS.map((step, i) => (
              <div
                key={i}
                ref={(el) => (shardRefs.current[i] = el)}
                className="absolute max-w-[620px] max-[640px]:max-w-[380px] w-full opacity-0 flex items-center justify-center"
                style={{ transformStyle: 'preserve-3d', willChange: 'transform, opacity, filter' }}
              >
                <img
                  src={step.image}
                  alt={step.alt}
                  className="w-full h-auto object-contain drop-shadow-[0_35px_90px_rgba(0,0,0,0.65)]"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Dashed callout pointing out of the shard that's currently in focus.
            Lives outside the preserve-3d scene so the camera tilt doesn't skew
            it, and is hidden on narrow screens where there's no room beside
            the shard. */}
        <div className="absolute inset-0 z-[15] pointer-events-none max-[1100px]:hidden">
          {STEPS.map((step, i) => (
            <div
              key={i}
              ref={(el) => (arrowRefs.current[i] = el)}
              className="absolute top-1/2 left-1/2 ml-[300px] opacity-0"
            >
              <svg width="290" height="170" viewBox="0 0 290 170" fill="none">
                {/* Steps right, turns up, then right again into the head. */}
                <path
                  d="M2 158 H112 A16 16 0 0 0 128 142 V28 A16 16 0 0 1 144 12 H258"
                  stroke="white"
                  strokeWidth="2"
                  strokeDasharray="10 9"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M252 5 L268 12 L252 19"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
              </svg>
            </div>
          ))}
        </div>

        {/* Feather the video into the black sections above and below, so the
            section boundaries don't read as hard horizontal seams. Sits above
            the shards so the fade covers everything in the frame. */}
        <div className="absolute inset-x-0 top-0 h-[200px] bg-gradient-to-b from-black to-transparent pointer-events-none z-20" />
        <div className="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
      </div>
    </section>
  );
}

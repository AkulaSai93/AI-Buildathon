'use client';

import { useEffect, useRef } from 'react';

const SRC = '/assets/videos/singularity.mp4';
// Length of the crossfade at the loop point, in seconds.
const FADE = 1.1;

export default function Singularity() {
  const aRef = useRef(null);
  const bRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const a = aRef.current;
    const b = bRef.current;
    if (!a || !b) return;

    // The clip's first and last frames don't match, so a plain `loop` shows
    // a visible jump. Instead two copies are stacked and the outgoing one is
    // crossfaded into the incoming one, which hides the seam entirely.
    let active = a;
    let idle = b;
    let fading = false;

    const play = (v) => {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    };

    a.style.opacity = '1';
    b.style.opacity = '0';
    play(a);

    const tick = () => {
      const duration = active.duration;
      if (duration && !Number.isNaN(duration)) {
        const remaining = duration - active.currentTime;

        if (!fading && remaining <= FADE) {
          fading = true;
          idle.currentTime = 0;
          play(idle);
        }

        if (fading) {
          const t = Math.min(1, Math.max(0, (FADE - remaining) / FADE));
          idle.style.opacity = String(t);
          active.style.opacity = String(1 - t);

          if (remaining <= 0.02 || active.ended) {
            // Swap roles and park the finished copy back at the start.
            active.pause();
            active.currentTime = 0;
            active.style.opacity = '0';
            idle.style.opacity = '1';
            const prev = active;
            active = idle;
            idle = prev;
            fading = false;
          }
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    // Autoplay can get interrupted during hydration; nudge it back.
    const ensure = () => {
      if (active.paused) play(active);
    };
    a.addEventListener('canplay', ensure);
    b.addEventListener('canplay', ensure);

    return () => {
      a.removeEventListener('canplay', ensure);
      b.removeEventListener('canplay', ensure);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section className="relative bg-black overflow-hidden min-h-[760px] max-[860px]:min-h-0 flex items-center max-[860px]:flex-col">
      <div className="relative z-10 w-1/2 max-[860px]:w-full px-[80px] max-[860px]:px-5 py-[100px] max-[860px]:py-16 flex flex-col gap-6">
        <h2 className="font-display text-[63px] max-[860px]:text-[2.4rem] font-bold uppercase leading-none text-white">
          Every Line of Code <span className="block text-red">Bends Toward One Idea</span>
        </h2>
        <p className="text-[18.9px] max-[860px]:text-[16px] leading-normal text-white/70 max-w-[520px]">
          Thousands of builders, one gravitational pull. Ship something that pulls the future a little closer — 48 hours, infinite possibility.
        </p>
      </div>

      <div className="absolute inset-y-0 right-0 w-1/2 max-[860px]:relative max-[860px]:inset-y-auto max-[860px]:w-full max-[860px]:h-[420px] overflow-hidden">
        <video
          ref={aRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={SRC}
          muted
          playsInline
          preload="auto"
        />
        <video
          ref={bRef}
          className="absolute inset-0 w-full h-full object-cover"
          src={SRC}
          muted
          playsInline
          preload="auto"
        />
        {/* Feather the inner edge so the visual melts into the copy side
            instead of cutting on a hard vertical seam. */}
        <div className="absolute inset-y-0 left-0 w-[220px] bg-gradient-to-r from-black to-transparent pointer-events-none" />
      </div>
    </section>
  );
}

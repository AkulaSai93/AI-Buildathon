'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      // A pure exponential-smoothing (lerp) setup, matching how premium
      // sites (e.g. GSAP ScrollSmoother) drive their scroll — every frame
      // eases toward the real scroll target instead of tweening each wheel
      // tick on its own fixed duration, which is what caused the slightly
      // "floaty"/laggy feel before. Mixing `duration`/`easing` with `lerp`
      // was also redundant — lerp alone gives the more premium, responsive
      // glide.
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    window.lenis = lenis;

    let rafId;
    const raf = (time) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}

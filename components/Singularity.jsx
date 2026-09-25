'use client';

import { useEffect, useRef } from 'react';

export default function Singularity() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const rafRef = useRef(null);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;

    const applyProgress = (progress) => {
      // Slow drift/zoom as the section passes, so the singularity feels
      // like it's pulling rather than sitting still.
      const centered = progress - 0.5;
      image.style.transform = `scale(${1.08 + progress * 0.06}) translateY(${centered * -40}px)`;
    };

    const measureTarget = () => {
      const rect = section.getBoundingClientRect();
      const distance = rect.height + window.innerHeight;
      const travelled = window.innerHeight - rect.top;
      targetProgress.current = Math.min(Math.max(travelled / distance, 0), 1);
    };

    const tick = () => {
      const diff = targetProgress.current - currentProgress.current;
      if (Math.abs(diff) > 0.0006) {
        currentProgress.current += diff * 0.08;
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
    <section
      ref={sectionRef}
      className="relative bg-black overflow-hidden min-h-[760px] max-[860px]:min-h-0 flex items-center max-[860px]:flex-col"
    >
      {/* Left: copy */}
      <div className="relative z-10 w-1/2 max-[860px]:w-full px-[80px] max-[860px]:px-5 py-[100px] max-[860px]:py-16 flex flex-col gap-6">
        <h2 className="font-display text-[63px] max-[860px]:text-[2.4rem] font-bold uppercase leading-none text-white">
          Every Line of Code <span className="block text-red">Bends Toward One Idea</span>
        </h2>
        <p className="text-[18.9px] max-[860px]:text-[16px] leading-normal text-white/70 max-w-[520px]">
          Thousands of builders, one gravitational pull. Ship something that pulls the future a little closer — 48 hours, infinite possibility.
        </p>
      </div>

      {/* Right: full-bleed singularity visual */}
      <div className="absolute inset-y-0 right-0 w-1/2 max-[860px]:static max-[860px]:w-full max-[860px]:h-[420px] overflow-hidden">
        <img
          ref={imageRef}
          src="/assets/singularity.webp"
          alt=""
          className="w-full h-full object-cover object-left"
          style={{ willChange: 'transform' }}
        />
        {/* Feather the inner edge so the visual melts into the copy side
            instead of cutting on a hard vertical seam. */}
        <div className="absolute inset-y-0 left-0 w-[220px] bg-gradient-to-r from-black to-transparent pointer-events-none" />
      </div>
    </section>
  );
}

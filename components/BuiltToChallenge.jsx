'use client';

import { useEffect, useRef } from 'react';

export default function BuiltToChallenge() {
  const sectionRef = useRef(null);
  const cardRef = useRef(null);
  const textRef = useRef(null);
  const rafRef = useRef(null);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    const text = textRef.current;

    const applyProgress = (progress) => {
      // Phase 1 (0 -> 0.5): card glides from the left toward the center, same size.
      // Phase 2 (0.5 -> 1): card, now centered, grows to fill the frame.
      const moveProgress = Math.min(progress / 0.5, 1);
      const growProgress = Math.max((progress - 0.5) / 0.5, 0);

      const cardWidthPct = 42;
      const startTranslateXPct = -55; // off to the left of center
      const translateXPct = startTranslateXPct * (1 - moveProgress);

      const startWidthPct = cardWidthPct;
      const endWidthPct = 100;
      const widthPct = startWidthPct + (endWidthPct - startWidthPct) * growProgress;

      // Lock to a true 16:9 frame (the video's native ratio) instead of an
      // arbitrary height, so the video always fills the card with no letterboxing.
      card.style.width = `${widthPct}%`;
      card.style.transform = `translateX(${translateXPct}%)`;

      // Heading/description fade out as the card starts growing (phase 2),
      // so there's no overlap once the video takes over the frame.
      const fadeProgress = Math.min(growProgress / 0.6, 1);
      const textOpacity = 1 - fadeProgress;
      text.style.opacity = String(textOpacity);
      text.style.transform = `translateY(${-fadeProgress * 24}px)`;
      text.style.pointerEvents = textOpacity < 0.1 ? 'none' : 'auto';
    };

    const measureTarget = () => {
      const rect = section.getBoundingClientRect();
      const scrollDistance = section.offsetHeight - window.innerHeight;
      targetProgress.current =
        scrollDistance > 0 ? Math.min(Math.max(-rect.top / scrollDistance, 0), 1) : 0;
    };

    // Continuously lerp the current progress toward the scroll-driven target,
    // instead of snapping directly to it, for a smooth, decelerating motion.
    const tick = () => {
      const diff = targetProgress.current - currentProgress.current;
      if (Math.abs(diff) > 0.0005) {
        currentProgress.current += diff * 0.07;
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
    <section ref={sectionRef} className="relative bg-[#fafafa] h-[250vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <div
          ref={textRef}
          className="absolute top-0 left-0 right-0 z-10 px-[80px] max-[860px]:px-5 py-[68px] flex items-start justify-between gap-8 max-[860px]:flex-col"
        >
          <h2 className="font-display text-[56px] max-[860px]:text-[2.2rem] font-semibold uppercase leading-[1.1] text-[#111]">
            Built to <span className="text-red">Challenge.</span>
            <br />
            Made to <span className="text-red">Inspire.</span>
          </h2>
          <p className="text-[20px] max-[860px]:text-[16px] leading-normal uppercase text-[#111]/60 max-w-[561px] pt-2">
            Step inside the AI Olympiad and experience the people, ideas, challenges, and moments that bring innovation to life.
          </p>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <div
            ref={cardRef}
            className="relative bg-black rounded-[8px] overflow-hidden"
            style={{ width: '42%', aspectRatio: '16 / 9' }}
          >
            <iframe
              className="absolute inset-0 w-full h-full"
              src="https://www.youtube.com/embed/Zmz5gE9nJqY?autoplay=1&mute=1&loop=1&playlist=Zmz5gE9nJqY&controls=1&modestbranding=1&rel=0"
              title="AI Buildathon"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Soft fade into the section below so the transition isn't a hard cut */}
        <div className="absolute bottom-0 left-0 right-0 h-[220px] bg-gradient-to-b from-transparent to-black pointer-events-none z-20" />
      </div>
    </section>
  );
}

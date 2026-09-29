'use client';

import { useEffect, useRef } from 'react';

const CARDS = [
  {
    title: 'Build Solutions',
    copy: 'Ship something real against a live problem statement, not a toy exercise.',
    // Where each card drifts in from, relative to its final slot. Cards start
    // pulled toward the centre so the set opens outward as one movement.
    from: { x: 70, y: 46 },
    area: 'col-start-1 row-start-1',
  },
  {
    title: '25 Lakh Prize Pool',
    copy: 'A national pool that rewards the teams who actually build.',
    from: { x: 70, y: -46 },
    area: 'col-start-1 row-start-2',
  },
  {
    title: 'Pitch to VC',
    copy: 'Put your work in front of investors who fund early ideas.',
    from: { x: -8, y: 54 },
    area: 'col-start-2 row-start-1 row-span-2',
  },
  {
    title: '2 Crore Scholarship',
    copy: 'Carry the momentum into a campus programme built for builders.',
    from: { x: -80, y: 30 },
    area: 'col-start-3 row-start-1 row-span-2',
  },
];

const clamp01 = (v) => Math.min(1, Math.max(0, v));
// Maps an absolute progress window onto 0..1 so each stage of the timeline can
// be expressed in the same units the spec uses.
const phase = (p, start, end) => clamp01((p - start) / (end - start));
const easeOut = (t) => 1 - Math.pow(1 - t, 3);

export default function Highlights() {
  const sectionRef = useRef(null);
  const textRef = useRef(null);
  const cardRefs = useRef([]);
  const rafRef = useRef(null);
  const targetProgress = useRef(0);
  const currentProgress = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    const text = textRef.current;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Reduced motion: present the finished composition and skip the camera move.
    if (reduced) {
      if (text) text.style.display = 'none';
      cardRefs.current.forEach((el) => {
        if (!el) return;
        el.style.opacity = '1';
        el.style.transform = 'none';
      });
      return;
    }

    const applyProgress = (p) => {
      // 0.20 -> 0.50: the camera pushes through the headline. It scales past
      // the viewer and lifts away rather than dissolving in place; the fade
      // only runs at the very end of that travel so it never reads as a
      // cross-fade between two layouts.
      const travel = easeOut(phase(p, 0.2, 0.5));
      if (text) {
        const scale = 1 + travel * 2.6;
        const lift = -travel * 300;
        const z = travel * 620;
        text.style.transform = `translate3d(0, ${lift}px, ${z}px) scale(${scale})`;
        text.style.opacity = String(1 - clamp01((travel - 0.72) / 0.28));
      }

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const card = CARDS[i];
        // Staggered, overlapping windows keep it reading as one continuous
        // movement instead of four separate entrances.
        const stagger = i * 0.045;
        const t = easeOut(phase(p, 0.35 + stagger, 0.88 + stagger * 0.4));
        const appear = phase(p, 0.35 + stagger, 0.58 + stagger);

        const scale = 0.84 + t * 0.16;
        const x = card.from.x * (1 - t);
        const y = card.from.y * (1 - t);
        const z = -180 * (1 - t);

        el.style.opacity = String(appear);
        el.style.transform = `translate3d(${x}px, ${y}px, ${z}px) scale(${scale})`;
      });
    };

    const measureTarget = () => {
      const rect = section.getBoundingClientRect();
      const scrollDistance = section.offsetHeight - window.innerHeight;
      targetProgress.current =
        scrollDistance > 0 ? clamp01(-rect.top / scrollDistance) : 0;
    };

    // Scroll position is the timeline; this loop only smooths how quickly the
    // rendered state chases it.
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
    <section ref={sectionRef} className="relative bg-[#fafafa] h-[400vh]">
      <div
        className="sticky top-0 h-screen overflow-hidden flex flex-col items-center justify-center gap-[28px] px-[80px] max-[1100px]:px-10 max-[860px]:px-5"
        style={{ perspective: '1200px' }}
      >
        {/* Cards sit behind the headline and open outward from it. */}
        <div className="w-full max-w-[1352px]">
          {/* Asymmetric editorial masonry: a wide left column stacked over two
              rows, with two tall columns spanning both. Collapses to a single
              vertical sequence on mobile rather than squeezing the grid. */}
          <div className="grid gap-[24px] grid-cols-[1.8fr_1fr_1fr] grid-rows-[288px_236px] max-[1100px]:grid-rows-[224px_184px] max-[860px]:grid-cols-1 max-[860px]:grid-rows-none max-[860px]:gap-3">
            {CARDS.map((card, i) => (
              <article
                key={card.title}
                ref={(el) => (cardRefs.current[i] = el)}
                className={`${card.area} max-[860px]:col-auto max-[860px]:row-auto max-[860px]:row-span-1 flex flex-col justify-between gap-4 rounded-[20px] bg-white border border-[#ececec] shadow-[0_18px_44px_rgba(17,17,17,0.07)] p-[32px] max-[1100px]:p-6 max-[860px]:p-5 max-[860px]:min-h-[104px] opacity-0`}
                style={{ willChange: 'transform, opacity' }}
              >
                <span className="font-mono text-[12px] tracking-[2px] text-text-dimmer">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex flex-col gap-[10px]">
                  <h3 className="font-body font-semibold uppercase leading-[1.05] text-[#111] text-[40px] max-[1280px]:text-[32px] max-[860px]:text-[22px]">
                    {card.title}
                  </h3>
                  {/* Dropped on mobile: four stacked cards plus copy overflows
                      the pinned viewport on shorter phones, and the headings
                      carry the message on their own. */}
                  <p className="font-body text-[15px] leading-normal text-[#111]/60 max-w-[34ch] max-[860px]:hidden">
                    {card.copy}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <p className="font-body font-light italic text-[18px] max-[860px]:text-[13px] leading-normal text-[#111]/70 text-center">
          *Terms and conditions apply
        </p>

        {/* Headline layer — above the cards, and the thing the camera moves
            through. pointer-events-none so it never blocks the cards once it
            has scaled past the viewer. */}
        <div
          ref={textRef}
          className="absolute inset-0 z-10 flex items-center justify-center px-6 pointer-events-none"
          style={{ willChange: 'transform, opacity', transformStyle: 'preserve-3d' }}
        >
          <div className="flex max-[860px]:flex-col items-center justify-center gap-[70px] max-[1280px]:gap-10 max-[860px]:gap-3">
            {CARDS.map((card) => (
              <p
                key={card.title}
                className="font-body font-semibold uppercase whitespace-nowrap text-red leading-none text-[40px] max-[1280px]:text-[30px] max-[860px]:text-[24px]"
              >
                {card.title}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

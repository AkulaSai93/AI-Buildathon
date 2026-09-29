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
      // 0.20 -> 0.50: the panel settles back into depth rather than expanding
      // past the viewer, so the cards read as coming forward out of the space
      // it leaves. The fade only runs at the tail of that travel so it never
      // reads as a cross-fade between two layouts.
      const travel = easeOut(phase(p, 0.16, 0.58));
      if (text) {
        const scale = 1 - travel * 0.38;
        const lift = -travel * 60;
        const z = -travel * 520;
        text.style.transform = `translate3d(0, ${lift}px, ${z}px) scale(${scale})`;
        text.style.opacity = String(1 - clamp01((travel - 0.6) / 0.4));
      }

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const card = CARDS[i];
        // Staggered, overlapping windows keep it reading as one continuous
        // movement instead of four separate entrances.
        const stagger = i * 0.035;
        const t = easeOut(phase(p, 0.3 + stagger, 0.92 + stagger * 0.3));
        // Eased rather than linear so cards don't pop in at the window edge.
        const appear = easeOut(phase(p, 0.3 + stagger, 0.66 + stagger));

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
        // Gentler chase than the other sections: this one moves a full-bleed
        // panel, so a snappier factor reads as a jolt.
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

        {/* Opening plate — a full-bleed red panel that the camera pushes
            through. It's the layer above the cards, so at rest it's all the
            viewer sees; as it scales past and clears, the cards behind are
            revealed. pointer-events-none so it never blocks them afterwards. */}
        <div
          ref={textRef}
          className="absolute inset-0 z-10 bg-red flex items-center pointer-events-none"
          style={{ willChange: 'transform, opacity', transformStyle: 'preserve-3d' }}
        >
          <div className="w-full max-w-[1352px] mx-auto px-[80px] max-[1100px]:px-10 max-[860px]:px-5 flex items-center gap-[64px] max-[1100px]:gap-10 max-[860px]:flex-col max-[860px]:items-start max-[860px]:gap-5">
            {/* Fixed column so the rule lands at ~42% of the frame and the
                copy runs out to ~89%, matching the design's proportions
                rather than hugging the heading text. */}
            <h2 className="w-[420px] max-[1280px]:w-[340px] max-[860px]:w-auto shrink-0 font-body font-semibold uppercase text-white leading-[1.15] text-[56px] max-[1280px]:text-[44px] max-[860px]:text-[32px]">
              Turn Ideas
              <br />
              Into Impact
            </h2>

            <div className="w-px h-[200px] max-[1280px]:h-[160px] bg-white/45 shrink-0 max-[860px]:hidden" />

            <p className="font-body text-[18px] max-[1280px]:text-[16px] max-[860px]:text-[14px] leading-[1.5] text-white/90 max-w-[640px]">
              Take a real problem, develop a meaningful solution, and turn your idea into something that can go further.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

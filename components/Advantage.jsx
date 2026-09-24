'use client';

import { useEffect, useRef } from 'react';

const CARD_IMAGE = '/assets/advantage-card.jpg';

const CARDS = [
  { tag: '01', title: '₹20 Lakh in Prizes', description: 'Compete across tracks for a national prize pool built to reward real builders.' },
  { tag: '02', title: 'Exclusive Rewards', description: 'Unlock perks, credits, and swag from the AI platforms powering the Buildathon.' },
  { tag: '03', title: 'Career Opportunities', description: 'Get noticed by mentors and partner companies scouting for talent.' },
  { tag: '04', title: 'Take Your Ideas Further', description: 'Turn a weekend project into something you keep building after the finale.' },
];

const SPREAD_X = [-503, -168, 168, 503];

export default function Advantage() {
  const sectionRef = useRef(null);
  const cardRefs = useRef([]);
  const rafRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;

    const updateScroll = () => {
      const rect = section.getBoundingClientRect();
      const scrollDistance = section.offsetHeight - window.innerHeight;
      const progress = scrollDistance > 0 ? Math.min(Math.max(-rect.top / scrollDistance, 0), 1) : 0;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;

        // Phase 1 (0 - 0.5): cards separate from a stacked deck into a spread row
        // Phase 2 (0.5 - 1): cards flip in place, slightly staggered per card
        const separateT = Math.min(Math.max(progress / 0.5, 0), 1);
        const eased = 1 - Math.pow(1 - separateT, 3);

        const stackOffsetX = i * 6;
        const stackOffsetY = i * 6;
        const stackRotate = (i - 1.5) * 6;

        const translateX = stackOffsetX + (SPREAD_X[i] - stackOffsetX) * eased;
        const translateY = stackOffsetY * (1 - eased);
        const rotateZ = stackRotate * (1 - eased);

        const flipSegment = 0.5 / CARDS.length;
        const flipStart = 0.5 + i * flipSegment;
        const flipEnd = flipStart + flipSegment;
        let flipT = 0;
        if (progress >= flipStart) {
          flipT = Math.min(Math.max((progress - flipStart) / (flipEnd - flipStart), 0), 1);
        }
        const rotateY = flipT * 180;

        el.style.transform = `translateX(${translateX}px) translateY(${translateY}px) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg)`;
        el.style.zIndex = String(10 + i);
      });
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        updateScroll();
        rafRef.current = null;
      });
    };

    updateScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative bg-[#fafafa] h-[300vh]">
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden px-[80px] max-[860px]:px-5">
        <div className="mx-auto max-w-[1352px] w-full pt-20 flex items-start justify-between gap-8 max-[560px]:flex-col max-[560px]:gap-6">
          <h2 className="font-display text-[100px] max-[860px]:text-[2.4rem] font-semibold uppercase leading-none text-[#111] flex-shrink-0">
            The IAIB <span className="block text-red">Advantage</span>
          </h2>
          <p className="text-[18.9px] leading-normal text-[#111]/80 w-[480px] max-w-full pt-2">
            Build. Learn. Get recognised. From ₹20 lakh in prizes to exclusive rewards, career opportunities, and the chance to take your ideas further.
          </p>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-[285.6px] h-[375.9px]" style={{ perspective: '1600px' }}>
            {CARDS.map((card, i) => (
              <div
                key={i}
                ref={(el) => (cardRefs.current[i] = el)}
                className="absolute inset-0 rounded-[12.6px]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front face */}
                <div
                  className="absolute inset-0 rounded-[12.6px] overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    backgroundImage: 'linear-gradient(127deg, rgb(231,0,11) 0%, rgb(193,0,7) 50%, rgb(159,7,18) 100%)',
                  }}
                >
                  <img src={CARD_IMAGE} alt="" className="w-full h-full object-cover" />
                </div>

                {/* Back face */}
                <div
                  className="absolute inset-0 rounded-[12.6px] bg-red flex flex-col justify-between p-7"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <span className="font-mono text-[13px] tracking-[2px] text-white/80">{card.tag}</span>
                  <div className="flex flex-col gap-3">
                    <h3 className="font-display text-[26px] font-bold leading-tight text-white">{card.title}</h3>
                    <p className="text-[14px] leading-normal text-white/80">{card.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

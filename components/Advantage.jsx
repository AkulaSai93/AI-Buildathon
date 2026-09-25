'use client';

import { useEffect, useRef } from 'react';

const CARD_IMAGE = '/assets/advantage-card.jpg';

const CARDS = [
  { tag: '01', title: 'Letter of recommendation' },
  { tag: '02', title: 'Prizes worth 25 lakh' },
  { tag: '03', title: 'Certificates & Goodies' },
  { tag: '04', title: 'Scholarship worth 2 crore*' },
  { tag: '05', title: 'Pitch to VCs' },
];

const CARD_W = 250;
const CARD_GAP = 27;

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

      // Spread step is derived from the space actually available so the
      // outermost cards never run past the viewport on narrower screens.
      const available = section.clientWidth - 40;
      const step = Math.min(CARD_W + CARD_GAP, Math.max(0, (available - CARD_W) / (CARDS.length - 1)));
      const mid = (CARDS.length - 1) / 2;

      cardRefs.current.forEach((el, i) => {
        if (!el) return;

        // Phase 1 (0 - 0.5): cards separate from a stacked deck into a spread row
        // Phase 2 (0.5 - 1): cards flip in place, slightly staggered per card
        const separateT = Math.min(Math.max(progress / 0.5, 0), 1);
        const eased = 1 - Math.pow(1 - separateT, 3);

        const stackOffsetX = i * 6;
        const stackOffsetY = i * 6;
        const stackRotate = (i - mid) * 6;
        const spreadX = (i - mid) * step;

        const translateX = stackOffsetX + (spreadX - stackOffsetX) * eased;
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
    <section id="why-iaib" ref={sectionRef} className="relative bg-[#fafafa] h-[300vh]">
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden px-[80px] max-[860px]:px-5">
        <div className="mx-auto w-[1003px] max-w-full pt-[60px] flex flex-col gap-[20px] items-center text-center text-[#111]">
          <h2 className="font-body text-[56px] max-[860px]:text-[2.2rem] font-semibold uppercase leading-normal">
            Why <span className="text-red">IAIB?</span>
          </h2>
          <div className="flex flex-col gap-[14px] text-[18.9px] max-[860px]:text-[16px] leading-normal w-full">
            <p>
              AI is no longer the future. It is the present. Recruiters are increasingly looking for AI-literate candidates; jobs are listing AI as a must-have skill; and prompting is now &lsquo;prompt engineering&rsquo;. Just knowing AI is not enough today and definitely not for tomorrow.
            </p>
            <p>
              IAIB&rsquo;s vision is to make AI-literacy a norm starting from class 9th students to 12th students. They get taught, practice hands-on, build solutions to real-world problems, and get a chance to pitch to and network with VCs.
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="relative w-[250px] h-[328px]" style={{ perspective: '1600px' }}>
            {CARDS.map((card, i) => (
              <div
                key={i}
                ref={(el) => (cardRefs.current[i] = el)}
                className="absolute inset-0 rounded-[12px]"
                style={{ transformStyle: 'preserve-3d' }}
              >
                {/* Front face */}
                <div
                  className="absolute inset-0 rounded-[12px] overflow-hidden"
                  style={{
                    backfaceVisibility: 'hidden',
                    backgroundImage: 'linear-gradient(127deg, rgb(231,0,11) 0%, rgb(193,0,7) 50%, rgb(159,7,18) 100%)',
                  }}
                >
                  <img src={CARD_IMAGE} alt="" className="w-full h-full object-cover" />
                </div>

                {/* Back face */}
                <div
                  className="absolute inset-0 rounded-[12px] bg-red flex flex-col justify-between p-6"
                  style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                >
                  <span className="font-mono text-[13px] tracking-[2px] text-white/80">{card.tag}</span>
                  <h3 className="font-display text-[24px] font-bold leading-tight text-white">{card.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

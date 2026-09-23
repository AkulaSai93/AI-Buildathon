'use client';

import { useEffect, useRef } from 'react';

const FRAME_COUNT = 300;
const getFrameSrc = (index) => `/assets/tesseract-frames/frame_${String(index + 1).padStart(3, '0')}.jpg`;

const STEPS = [
  {
    tag: '01 — LEARN',
    title: '30 Days of Learning',
    description: 'Get access to free learning sessions designed to build your AI, coding, and problem-solving foundation.',
  },
  {
    tag: '02 — SCREEN',
    title: 'Test + Build',
    description: 'Take a 30–45 minute screening test and put your skills into action with a project submission.',
  },
  {
    tag: '03 — SELECTED',
    title: '300 Students Move Forward',
    description: 'The top 300 participants will be selected for the offline Grand Finale.',
  },
  {
    tag: '04 — HACKATHON',
    title: 'Build Together. Create Something Real.',
    description: 'Join your assigned team, collaborate, and turn your idea into a working AI solution at the Grand Finale.',
  },
];

export default function TesseractScroll() {
  const sectionRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const frameRef = useRef({ current: 0, target: 0 });
  const rafRef = useRef(null);
  const cardRefs = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const images = new Array(FRAME_COUNT);
    imagesRef.current = images;

    const drawFrame = (index) => {
      const img = images[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const canvasW = canvas.width;
      const canvasH = canvas.height;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      const canvasRatio = canvasW / canvasH;

      let drawW, drawH, offsetX, offsetY;
      if (imgRatio > canvasRatio) {
        drawH = canvasH;
        drawW = drawH * imgRatio;
        offsetX = (canvasW - drawW) / 2;
        offsetY = 0;
      } else {
        drawW = canvasW;
        drawH = drawW / imgRatio;
        offsetX = 0;
        offsetY = (canvasH - drawH) / 2;
      }

      ctx.clearRect(0, 0, canvasW, canvasH);
      ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
    };

    const loadImage = (index) => {
      if (images[index]) return images[index];
      const img = new Image();
      img.src = getFrameSrc(index);
      img.onload = () => {
        if (frameRef.current.current === index) drawFrame(index);
      };
      images[index] = img;
      return img;
    };

    // Preload first frame immediately, rest progressively
    loadImage(0);
    let preloadIdx = 1;
    const preloadStep = () => {
      if (preloadIdx < FRAME_COUNT) {
        loadImage(preloadIdx);
        preloadIdx += 1;
        requestAnimationFrame(preloadStep);
      }
    };
    requestAnimationFrame(preloadStep);

    const resizeCanvas = () => {
      const section = sectionRef.current;
      if (!section) return;
      canvas.width = section.clientWidth;
      canvas.height = window.innerHeight;
      drawFrame(frameRef.current.current);
    };

    const updateCards = (progress) => {
      const segment = 1 / STEPS.length;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const start = i * segment;
        const end = start + segment;
        const fadeZone = segment * 0.25;

        let opacity = 0;
        if (progress >= start && progress <= end) {
          if (progress < start + fadeZone) {
            opacity = (progress - start) / fadeZone;
          } else if (progress > end - fadeZone) {
            opacity = (end - progress) / fadeZone;
          } else {
            opacity = 1;
          }
        }
        opacity = Math.min(Math.max(opacity, 0), 1);

        el.style.opacity = String(opacity);
        el.style.transform = `translateY(${(1 - opacity) * 16}px)`;
        el.style.pointerEvents = opacity > 0.5 ? 'auto' : 'none';
      });
    };

    const updateScroll = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const scrollDistance = section.offsetHeight - window.innerHeight;
      const progress = scrollDistance > 0 ? Math.min(Math.max(-rect.top / scrollDistance, 0), 1) : 0;

      const targetIndex = Math.min(FRAME_COUNT - 1, Math.round(progress * (FRAME_COUNT - 1)));
      frameRef.current.target = targetIndex;

      if (frameRef.current.current !== targetIndex) {
        frameRef.current.current = targetIndex;
        loadImage(targetIndex);
        drawFrame(targetIndex);
      }

      updateCards(progress);
    };

    const onScroll = () => {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        updateScroll();
        rafRef.current = null;
      });
    };

    resizeCanvas();
    updateScroll();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', resizeCanvas);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative h-[400vh] bg-black">
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* Journey Step Cards */}
        <div className="absolute inset-0 flex items-center justify-center px-6 pointer-events-none">
          {STEPS.map((step, i) => (
            <div
              key={i}
              ref={(el) => (cardRefs.current[i] = el)}
              className="absolute max-w-[560px] w-full text-center opacity-0 transition-none"
            >
              <div className="mx-auto flex flex-col items-center gap-[16px] rounded-[16px] border border-white/15 bg-black/50 backdrop-blur-md px-[32px] py-[36px] max-[640px]:px-[20px] max-[640px]:py-[24px]">
                <span className="font-display text-[14px] font-semibold tracking-[0.15em] text-red uppercase">
                  {step.tag}
                </span>
                <h3 className="font-display text-[32px] max-[640px]:text-[24px] font-bold text-white leading-tight">
                  {step.title}
                </h3>
                <p className="text-[16px] max-[640px]:text-[14px] leading-normal text-[rgba(255,255,255,0.85)]">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

const PARTNERS = ['OpenAI', 'Anthropic', 'Gemini', 'Replit', 'Lovable', 'Emergent'];

export default function Partners() {
  return (
    <section className="relative z-10 bg-[#010101] pt-7 pb-8 overflow-hidden no-scrollbar">
      <p className="text-center font-mono text-[11.2px] tracking-[2.5px] uppercase text-text-dimmer mb-5">
        Built with the best in AI
      </p>
      <div className="flex gap-16 w-fit animate-partners-scroll">
        {[...Array(2)].map((_, dupIdx) => (
          <div key={dupIdx} className="flex gap-16 items-center flex-shrink-0">
            {PARTNERS.map((name) => (
              <span
                key={name}
                className="font-display font-semibold text-[18.4px] tracking-[-0.18px] text-text-dim opacity-85 whitespace-nowrap"
              >
                {name}
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

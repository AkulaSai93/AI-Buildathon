'use client';

const PARTNERS = [
  { name: 'OpenAI', logo: '/assets/partner-logos/openai.svg' },
  { name: 'Anthropic', logo: '/assets/partner-logos/anthropic.svg' },
  { name: 'Gemini', logo: '/assets/partner-logos/gemini.svg' },
  { name: 'Replit', logo: '/assets/partner-logos/replit.svg' },
  { name: 'Lovable', logo: '/assets/partner-logos/lovable.svg' },
  { name: 'Emergent', logo: '/assets/partner-logos/emergent.svg' },
];

export default function Partners() {
  return (
    <section className="relative z-10 bg-[#010101] py-[60px] max-[860px]:py-10 overflow-hidden no-scrollbar">
      <div className="flex flex-col gap-[24px] items-center">
        <p className="font-mono font-medium text-[20px] max-[860px]:text-[14px] leading-normal uppercase text-text-dimmer text-center px-6">
          Built with the best in AI
        </p>

        <div className="flex w-fit animate-partners-scroll">
          {/* Two identical runs so the -50% translate loops seamlessly. */}
          {[0, 1].map((run) => (
            <div key={run} className="flex items-center flex-shrink-0">
              {PARTNERS.map((partner) => (
                <div key={partner.name} className="flex items-center">
                  <div className="flex gap-[12px] items-center opacity-85 px-[28px]">
                    <img src={partner.logo} alt="" className="w-[24px] h-[24px] shrink-0" />
                    <span className="font-display font-semibold text-[18.4px] tracking-[-0.184px] text-text-dim whitespace-nowrap">
                      {partner.name}
                    </span>
                  </div>
                  <span className="font-body text-[11.2px] text-text-dimmer leading-normal">✦</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

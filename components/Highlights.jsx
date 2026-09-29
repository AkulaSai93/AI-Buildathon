'use client';

const CARDS = [
  {
    title: 'Build Solutions',
    copy: 'Ship something real against a live problem statement, not a toy exercise.',
  },
  {
    title: '25 Lakh Prize Pool',
    copy: 'A national pool that rewards the teams who actually build.',
  },
  {
    title: 'Pitch to VC',
    copy: 'Put your work in front of investors who fund early ideas.',
  },
  {
    title: '2 Crore Scholarship',
    copy: 'Carry the momentum into a campus programme built for builders.',
  },
];

// Enough runs that half the track still covers the widest screen at peak
// shift — the animation translates by -50%, so the track must be at least
// twice the viewport. An even count keeps the loop landing on an identical run.
const RUNS = 4;

export default function Highlights() {
  return (
    <section className="relative bg-red overflow-hidden py-[96px] max-[860px]:py-14">
      <div className="w-full max-w-[1352px] mx-auto px-[80px] max-[1100px]:px-10 max-[860px]:px-5 flex items-center gap-[64px] max-[1100px]:gap-10 max-[860px]:flex-col max-[860px]:items-start max-[860px]:gap-5">
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

      {/* Continuously sliding card rail. The full-width wrapper anchors the
          track at x=0 — inside a centred parent the -50% shift would strand
          its right edge at half the viewport and open a gap. */}
      <div className="w-full overflow-hidden mt-[72px] max-[860px]:mt-10">
        <div className="flex w-max animate-cards-slide">
          {Array.from({ length: RUNS }, (_, run) => (
            <div key={run} className="flex shrink-0">
              {CARDS.map((card, i) => {
                const dark = i % 2 === 1;
                return (
                  <article
                    key={card.title}
                    className={`mr-[24px] max-[860px]:mr-4 flex flex-col justify-between rounded-[20px] p-[32px] max-[860px]:p-6 w-[380px] h-[300px] max-[860px]:w-[280px] max-[860px]:h-[230px] shrink-0 ${
                      dark ? 'bg-[#141414] text-white' : 'bg-white text-[#111]'
                    }`}
                  >
                    <span
                      className={`font-mono text-[12px] tracking-[2px] ${
                        dark ? 'text-white/45' : 'text-[#111]/40'
                      }`}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="flex flex-col gap-[10px]">
                      <h3 className="font-body font-semibold uppercase leading-[1.05] text-[34px] max-[860px]:text-[24px]">
                        {card.title}
                      </h3>
                      <p
                        className={`font-body text-[15px] max-[860px]:text-[13px] leading-normal ${
                          dark ? 'text-white/60' : 'text-[#111]/60'
                        }`}
                      >
                        {card.copy}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <p className="font-body font-light italic text-[16px] max-[860px]:text-[13px] leading-normal text-white/70 text-center mt-[40px] max-[860px]:mt-7 px-6">
        *Terms and conditions apply
      </p>
    </section>
  );
}

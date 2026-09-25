'use client';

const PHRASES = ['Build Solutions', '25 Lakh Prize Pool', 'Pitch to VC', '2 Crore Scholarship'];

export default function Highlights() {
  return (
    <section className="relative bg-[#fafafa] py-[80px] max-[860px]:py-12 overflow-hidden">
      <div className="flex flex-col gap-[24px] items-center">
        <div className="flex w-fit animate-headline-marquee">
          {/* Two runs is enough here: one run is far wider than any viewport,
              so half the track still covers the screen at peak shift. */}
          {[0, 1].map((run) => (
            <div key={run} className="flex gap-[70px] max-[860px]:gap-8 pr-[70px] max-[860px]:pr-8 items-center shrink-0">
              {PHRASES.map((phrase) => (
                <p
                  key={phrase}
                  className="font-body font-semibold text-[80px] max-[860px]:text-[40px] leading-normal uppercase text-red whitespace-nowrap"
                >
                  {phrase}
                </p>
              ))}
            </div>
          ))}
        </div>

        <p className="font-body font-light text-[24px] max-[860px]:text-[16px] leading-normal text-[#111] text-center px-6">
          *Terms and conditions apply
        </p>
      </div>
    </section>
  );
}

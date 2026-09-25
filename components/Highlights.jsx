'use client';

const PHRASES = ['Build Solutions', '25 Lakh Prize Pool', 'Pitch to VC', '2 Crore Scholarship'];

export default function Highlights() {
  return (
    <section className="relative bg-[#fafafa] pt-[80px] pb-[40px] max-[860px]:pt-12 max-[860px]:pb-6 overflow-hidden">
      <div className="flex flex-col gap-[24px] items-center">
        {/* Full-width wrapper: without it the centred parent would offset the
            track, and since the animation shifts by -50% the right edge would
            always land at half the viewport, leaving a gap no number of runs
            could fill. Starting at x=0 means half the track always covers the
            screen. */}
        <div className="w-full overflow-hidden">
          <div className="flex w-max animate-headline-marquee">
            {[0, 1].map((run) => (
              <div
                key={run}
                className="flex gap-[70px] max-[860px]:gap-8 pr-[70px] max-[860px]:pr-8 items-center shrink-0"
              >
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
        </div>

        <p className="font-body font-light italic text-[24px] max-[860px]:text-[16px] leading-normal text-[#111] text-center px-6">
          *Terms and conditions apply
        </p>
      </div>
    </section>
  );
}

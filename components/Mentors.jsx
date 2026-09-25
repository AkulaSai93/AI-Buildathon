'use client';

const imgJuror = '/assets/juror.jpg';

const JURY = [
  { name: 'Vishwa Mohan', title: 'Founder & CEO, upGrad School of Technology', bg: '#cbd5d4', tall: true },
  { name: 'Vishwa Mohan', title: 'Founder & CEO, upGrad School of Technology', bg: '#fbf5eb', tall: false },
  { name: 'Vishwa Mohan', title: 'Founder & CEO, upGrad School of Technology', bg: '#f9ab15', tall: true },
  { name: 'Vishwa Mohan', title: 'Founder & CEO, upGrad School of Technology', bg: '#f5f6f8', tall: false },
];

export default function Mentors() {
  return (
    <section id="jury" className="relative bg-[#fafafa] pt-20">
      <div className="flex flex-col gap-[60px] items-center w-full">
        <div className="flex flex-col gap-[21px] items-center text-center w-full px-6 max-[860px]:px-5">
          <h2 className="font-display text-[63px] font-bold uppercase leading-none text-[#111]">
            Meet the <span className="text-red">Jury</span>
          </h2>
          <p className="text-[18.9px] leading-normal text-[#111]/80 max-w-[704px]">
            Industry leaders and experts evaluating ideas, creativity, execution, and impact.
          </p>
        </div>

        <div className="flex items-end w-full max-[860px]:flex-wrap max-[860px]:gap-4 max-[860px]:px-5">
          {JURY.map((juror, i) => (
            <div
              key={i}
              className={`relative overflow-hidden rounded-t-[1041px] flex-1 min-w-0 max-[860px]:flex-none max-[860px]:w-full max-[860px]:max-w-[378px] ${
                juror.tall ? 'h-[698px] max-[860px]:h-[520px]' : 'h-[510px] max-[860px]:h-[420px]'
              }`}
              style={{ backgroundColor: juror.bg }}
            >
              <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-[39px] pt-[110px] px-[17px]">
                <div className="flex flex-col gap-[6px] items-center text-center text-[#0a0a0b] w-[180px]">
                  <p className="font-display font-semibold text-[27px] whitespace-nowrap">{juror.name}</p>
                  <p className="font-body text-[13px] leading-tight">{juror.title}</p>
                </div>
                <img src={imgJuror} alt={juror.name} className="w-full h-[480px] object-cover object-top" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

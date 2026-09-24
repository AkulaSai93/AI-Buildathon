'use client';

const imgImage2256 = '/assets/iaib-logo.png';
const imgIaib = '/assets/iaib-logo.png';

export default function Footer() {
  const navLinks = ['Home', 'About IAIB', 'How It Works', 'Prizes', 'Mentors', 'Jury', 'FAQ'];

  return (
    <footer className="relative bg-[#fcfcfa]">
      <div className="relative w-full h-[720px]">
        {/* Top Navigation Links */}
        <div className="absolute left-[80px] top-[64px] flex gap-[24px] items-center whitespace-nowrap">
          {navLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="font-display font-normal text-[14px] text-[#202020] leading-normal hover:text-red transition-colors"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Logo Image - Top Right */}
        <div className="absolute right-[30px] top-[20px] w-[340px] h-[130px]">
          <img
            alt="IAIB Logo"
            className="w-full h-full object-contain"
            src={imgImage2256}
          />
        </div>

        {/* GET IN TOUCH - Left Side */}
        <div className="absolute left-[80px] top-[170px]">
          <p className="font-display font-semibold text-[18px] text-[#202020] leading-normal mb-[8px]">
            GET IN TOUCH
          </p>
          <p className="font-display font-normal text-[14px] text-[#202020] leading-normal">
            hello@iaib.com
          </p>
        </div>

        {/* Social Links - Right Side */}
        <div className="absolute right-[80px] top-[185px] flex flex-col gap-[8px]">
          <a
            href="#"
            className="bg-[#f1f1f1] border border-[#ddd] text-[#444] font-display font-bold text-[14px] px-[12px] py-[4px] rounded-[42px] text-center hover:bg-[#e8e8e8] transition-colors whitespace-nowrap"
          >
            Instagram
          </a>
          <a
            href="#"
            className="bg-[#f1f1f1] border border-[#ddd] text-[#444] font-display font-bold text-[14px] px-[12px] py-[4px] rounded-[42px] text-center hover:bg-[#e8e8e8] transition-colors whitespace-nowrap"
          >
            LinkedIn
          </a>
        </div>

        {/* Center Section with Large IAIB */}
        <div className="absolute left-1/2 -translate-x-1/2 top-[280px] flex flex-col items-center gap-[24px] w-full">
          {/* Large IAIB SVG Graphic */}
          <div className="w-[891px] h-[291px]">
            <img
              alt="IAIB"
              className="w-full h-full object-contain"
              src={imgIaib}
            />
          </div>

          {/* IGNITE AI BUILDATHON and Footer Links */}
          <div className="flex flex-col items-center gap-[16px]">
            <p className="font-display font-medium text-[20px] text-[#202020] text-center">
              IGNITE AI BUILDATHON
            </p>
            <div className="flex items-center gap-[12px] justify-center">
              <a
                href="#"
                className="font-display font-normal text-[14px] text-[#202020] leading-normal hover:underline"
              >
                Privacy Policy
              </a>
              <div className="w-[1px] h-[18px] bg-[#202020]"></div>
              <a
                href="#"
                className="font-display font-normal text-[14px] text-[#202020] leading-normal hover:underline"
              >
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

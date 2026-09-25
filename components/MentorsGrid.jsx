'use client';

const MENTORS = [
  {
    name: 'Vishwa Mohan',
    title: 'Founder & CEO · uGSOT',
    image: '/assets/mentors-grid/vishwa.jpg',
    icons: [
      { src: '/assets/mentor-icons/vishwa-1.png', w: 12 },
      { src: '/assets/mentor-icons/vishwa-2.png', w: 27 },
      { src: '/assets/mentor-icons/vishwa-3.png', w: 14 },
    ],
  },
  {
    name: 'Divyansh Dubey',
    title: 'Gen AI · Google',
    image: '/assets/mentors-grid/divyansh.jpg',
    icons: [{ src: '/assets/mentor-icons/divyansh-1.png', w: 35 }],
  },
  {
    name: 'Sourov Roy',
    title: 'Software Engineer II · Deliveroo',
    image: '/assets/mentors-grid/sourov.jpg',
    icons: [
      { src: '/assets/mentor-icons/sourov-1.png', w: 40 },
      { src: '/assets/mentor-icons/sourov-2.png', w: 12 },
      { src: '/assets/mentor-icons/sourov-3.png', w: 12 },
    ],
  },
  {
    name: 'Gladden Rumao',
    title: 'Ex-Barclays · Newton School',
    image: '/assets/mentors-grid/gladden.jpg',
    icons: [
      { src: '/assets/mentor-icons/gladden-1.png', w: 12 },
      { src: '/assets/mentor-icons/gladden-2.png', w: 12 },
    ],
  },
  {
    name: 'Richa Arora',
    title: 'Full Stack Trainer · MERN',
    image: '/assets/mentors-grid/richa.jpg',
    icons: [],
  },
  {
    name: 'Vivek Kumar Astikar',
    title: 'Data/AI Engineer · Google & Microsoft Certified',
    image: '/assets/mentors-grid/vivek.jpg',
    icons: [],
  },
  {
    name: 'Shubham Lal',
    title: 'Software Developer · Microsoft',
    image: '/assets/mentors-grid/shubham.jpg',
    icons: [{ src: '/assets/mentor-icons/shubham-1.png', w: 40 }],
  },
  {
    name: 'Ganesh Balakrishnan',
    title: 'Fractional CMO · Shark Tank',
    image: '/assets/mentors-grid/ganesh.jpg',
    icons: [
      { src: '/assets/mentor-icons/ganesh-1.png', w: 30 },
      { src: '/assets/mentor-icons/ganesh-2.png', w: 27 },
      { src: '/assets/mentor-icons/ganesh-3.png', w: 22 },
    ],
  },
];

export default function MentorsGrid() {
  return (
    <section id="mentors" className="relative bg-[#010101] px-6 max-[860px]:px-5 py-20">
      <div className="mx-auto flex flex-col gap-[60px] items-center max-w-[1352px]">
        <div className="flex flex-col gap-[21px] items-center text-center w-full">
          <h2 className="font-display text-[63px] font-bold uppercase leading-none text-text">
            Meet Our <span className="text-red">Mentors</span>
          </h2>
          <p className="text-[18.9px] leading-normal text-[rgba(255,255,255,0.8)] max-w-[704px]">
            Learn from industry experts, creators, and innovators who bring real-world experience, practical insights, and guidance to help you learn, build, and grow.
          </p>
        </div>

        {/* Scrolling Cards */}
        <div className="relative w-full overflow-hidden">
          {/* Edge fade overlays */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-[80px] max-[860px]:w-[40px] z-10 bg-gradient-to-r from-[#010101] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-[80px] max-[860px]:w-[40px] z-10 bg-gradient-to-l from-[#010101] to-transparent" />

          <div className="flex gap-[24px] w-fit animate-mentors-grid-scroll">
            {[...MENTORS, ...MENTORS].map((mentor, idx) => (
              <div
                key={idx}
                className="bg-[#08090b] h-[414px] w-[320px] flex-shrink-0 rounded-[16px] overflow-hidden relative group"
              >
                {/* Full Image Background */}
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* Content Overlay at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent pt-[80px] p-[24px]">
                  <div className="flex flex-col gap-[14px]">
                    <div className="flex flex-col gap-[12px]">
                      <div className="flex flex-col gap-[8px]">
                        <p className="font-semibold text-[24px] leading-[28.8px] text-white font-['Montserrat']">
                          {mentor.name}
                        </p>
                        <p className="font-normal text-[14px] leading-[16.8px] text-white font-['Montserrat']">
                          {mentor.title}
                        </p>
                      </div>

                      {mentor.icons.length > 0 && (
                        <div className="flex gap-[6px] items-center h-[24px]">
                          {mentor.icons.map((icon, iconIdx) => (
                            <div
                              key={iconIdx}
                              className="bg-white flex items-center justify-center px-[6px] h-[24px] rounded-[2px] flex-shrink-0"
                            >
                              <img
                                src={icon.src}
                                alt=""
                                className="h-[12px] object-contain"
                                style={{ width: `${icon.w}px` }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <a
                      href="#"
                      className="border border-white rounded-[100px] py-[6px] px-[10px] flex items-center justify-center gap-[8px] text-white text-[14px] font-semibold font-['Montserrat'] hover:bg-white hover:text-black transition-colors"
                    >
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0">
                        <path d="M18 0H2C0.9 0 0 0.9 0 2v16c0 1.1 0.9 2 2 2h16c1.1 0 2-0.9 2-2V2c0-1.1-0.9-2-2-2zM8 16H5v-9h3v9zm-1.5-10.3c-0.966 0-1.75-0.783-1.75-1.75s0.784-1.75 1.75-1.75 1.75 0.783 1.75 1.75-0.784 1.75-1.75 1.75zM17 16h-3v-4.385c0-1.045-0.379-1.755-1.319-1.755-0.72 0-1.15 0.484-1.34 0.953-0.069 0.167-0.086 0.402-0.086 0.637v4.55h-3v-9h3v1.232c0.385-0.591 1.073-1.432 2.609-1.432 1.905 0 3.334 1.244 3.334 3.919v5.281z" />
                      </svg>
                      Linkedin Profile
                    </a>
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

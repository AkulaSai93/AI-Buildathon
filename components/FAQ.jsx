'use client';

import { useState } from 'react';

const FAQ_ITEMS = [
  {
    question: 'Who can participate in the AI Genius Olympiad?',
    answer: 'The Olympiad is open to students studying in Class 11 and Class 12.',
    isExpanded: true,
  },
  {
    question: 'Is the Olympiad free to enter?',
    answer: 'Yes, participation in the AI Genius Olympiad is completely free. There are no registration fees or entry costs.',
    isExpanded: false,
  },
  {
    question: 'How does the competition work?',
    answer: 'The competition consists of multiple rounds where students solve AI-related challenges and problems designed to test their creativity and problem-solving skills.',
    isExpanded: false,
  },
  {
    question: 'What will I be tested on?',
    answer: 'You will be tested on AI fundamentals, logical reasoning, coding skills, and your ability to apply AI concepts to real-world problems.',
    isExpanded: false,
  },
  {
    question: 'Is the exam online?',
    answer: 'Yes, the examination is conducted entirely online, making it accessible to students from anywhere.',
    isExpanded: false,
  },
  {
    question: 'What happens after Round 1?',
    answer: 'Top performers from Round 1 advance to Round 2, where they face more challenging problems and compete for prizes and recognition.',
    isExpanded: false,
  },
];

export default function FAQ() {
  const [items, setItems] = useState(FAQ_ITEMS);

  const toggleItem = (index) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, isExpanded: !item.isExpanded } : { ...item, isExpanded: false }
      )
    );
  };

  return (
    <section className="relative bg-[#fafafa] px-6 max-[860px]:px-5 py-20 overflow-hidden">
      {/* Moving Marquee Stripe */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 flex gap-[70px] items-center whitespace-nowrap overflow-hidden w-full h-[200px] z-0 pointer-events-none">
        <div className="flex gap-[70px] animate-faq-marquee" style={{ width: 'fit-content' }}>
          {['#0085C7', '#F4C300', '#009F3D', '#DF0024'].map((color, i) => (
            <p
              key={i}
              className="font-display font-bold text-[120px] leading-none tracking-[-0.095em] flex-shrink-0"
              style={{ color }}
            >
              Ignite AI Buildathon
            </p>
          ))}
        </div>
      </div>

      <div className="mx-auto flex flex-col items-center gap-[54px] max-w-[964px] relative z-10 pt-[160px]">
        {/* Heading and Subtitle */}
        <div className="flex flex-col gap-[20px] items-center text-center w-full">
          <h2 className="font-display text-[40px] font-semibold leading-normal text-[#111]">
            Frequently asked <span className="text-red">questions</span>
          </h2>
          <p className="text-[18px] leading-normal text-[#111]/80 max-w-[557px]">
            Everything you need to know before you register, prepare, and take on the challenge.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="flex flex-col gap-[24px] w-full">
          {items.map((item, index) => (
            <div
              key={index}
              className={`flex items-start px-[32px] py-[24px] w-full cursor-pointer transition-colors ${
                item.isExpanded
                  ? 'bg-red'
                  : 'bg-white'
              }`}
              onClick={() => toggleItem(index)}
            >
              <div className="flex flex-1 items-start justify-between min-w-0">
                <div className="flex flex-col gap-[12px] items-start leading-normal flex-1 pr-4">
                  <p
                    className={`font-display font-medium text-[24px] leading-normal ${
                      item.isExpanded ? 'text-white' : 'text-[#0a0a0b]'
                    }`}
                  >
                    {item.question}
                  </p>
                  {item.isExpanded && (
                    <p
                      className={`font-display font-normal text-[20px] leading-normal ${
                        item.isExpanded ? 'text-[rgba(255,255,255,0.8)]' : ''
                      }`}
                    >
                      {item.answer}
                    </p>
                  )}
                </div>

                {/* Chevron Icon */}
                <div
                  className={`flex-shrink-0 flex items-center justify-center w-[32px] h-[32px] border-[0.615px] rounded ${
                    item.isExpanded
                      ? 'border-white'
                      : 'border-[#0a0a0b]'
                  } transition-transform`}
                  style={{
                    transform: item.isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={item.isExpanded ? 'text-white' : 'text-[#0a0a0b]'}
                  >
                    <path
                      d="M12.5 6L8 10.5L3.5 6"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

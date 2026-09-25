'use client';

import { useEffect, useRef, useState } from 'react';

const FAQ_ITEMS = [
  {
    question: 'Who can participate?',
    answer: 'Any student in classes 9 to 12, studying at a school in India.',
  },
  {
    question: 'Is there a registration fee?',
    answer: 'No. Registration and participation are completely free.',
  },
  {
    question: 'Do I need prior coding or AI experience?',
    answer: 'No. The learning sessions start from the basics. All you need is curiosity about AI.',
  },
  {
    question: 'How are the learning sessions conducted?',
    answer:
      "Sessions are held live online, on weekend mornings. They won't clash with school, and you'll still have the rest of your weekend free.",
  },
  {
    question: 'What does the screening round involve?',
    answer:
      'There are two steps. First, a 40-minute test on what you learned in the sessions. Second, a small project that you build from one of 50 prompts we share. Screening is done individually.',
  },
  {
    question: 'How is the project evaluated?',
    answer:
      'Projects are judged on five criteria: originality, ethical use of AI, clarity, scalability, and potential for real-world impact.',
  },
  {
    question: 'Can I participate with my friends as a team?',
    answer:
      'Screening is individual. At the offline buildathon, finalists compete in teams of four, and teams are formed on the day of the event.',
  },
  {
    question: 'Will travel and accommodation be covered for finalists?',
    answer:
      'Yes. Travel and accommodation costs are reimbursed once receipts are verified, so keep all your bills. Travel and accommodation costs are reimbursed only for one child, one parent.',
  },
  {
    question: 'How does the ₹2 crore scholarship work?',
    answer:
      'The scholarship is a pool of ₹2 crore for participants who take admission to the upGrad School of Technology campus programme in the cohort in the next year. The scholarship becomes null and void if the student takes admission somewhere else.',
  },
  {
    question: 'Is parental consent required?',
    answer:
      'Yes. A parent or guardian must give consent at registration. We also recommend that a parent or guardian accompany the student throughout the offline buildathon.',
  },
  {
    question: 'Who owns the solutions built during the buildathon?',
    answer:
      'The solutions belong to the teams that built them. Participants are free to keep developing their projects after the event.',
  },
  {
    question: 'What do I need for the online sessions?',
    answer: 'A laptop or computer with a stable internet connection.',
  },
  {
    question: 'What if I miss a live session?',
    answer: 'You can access recorded sessions which will be uploaded.',
  },
  {
    question: 'What language are the sessions taught in?',
    answer: 'English.',
  },
  {
    question: "How will I know if I've been shortlisted?",
    answer: 'Shortlisted participants will be informed by email and phone.',
  },
];

const PREVIEW_COUNT = 6;

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const panelRefs = useRef([]);
  const answerRefs = useRef([]);

  const visible = showAll ? FAQ_ITEMS : FAQ_ITEMS.slice(0, PREVIEW_COUNT);

  // Height is applied from the answer's measured size rather than a CSS
  // keyword, because `height: auto` and `grid-template-rows: 0fr->1fr` are
  // both non-interpolable here, which is what made the panel snap open.
  useEffect(() => {
    const sync = () => {
      panelRefs.current.forEach((panel, i) => {
        if (!panel) return;
        const answer = answerRefs.current[i];
        panel.style.height = openIndex === i && answer ? `${answer.offsetHeight}px` : '0px';
      });
    };

    sync();
    window.addEventListener('resize', sync);
    return () => window.removeEventListener('resize', sync);
  }, [openIndex, showAll]);

  const toggleItem = (index) => {
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section id="faq" className="relative bg-[#fafafa] px-6 max-[860px]:px-5 pt-10 pb-20 overflow-hidden">
      <div className="mx-auto flex flex-col items-center gap-[54px] max-w-[964px] relative z-10">
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
          {visible.map((item, index) => {
            const isExpanded = openIndex === index;
            return (
              <div
                key={item.question}
                className={`flex items-start px-[32px] py-[24px] w-full cursor-pointer transition-colors duration-300 ease-out ${
                  isExpanded ? 'bg-red' : 'bg-white'
                }`}
                onClick={() => toggleItem(index)}
              >
                <div className="flex flex-1 items-start justify-between min-w-0">
                  <div className="flex flex-col items-start leading-normal flex-1 pr-4">
                    <p
                      className={`font-display font-medium text-[24px] max-[640px]:text-[19px] leading-normal transition-colors ${
                        isExpanded ? 'text-white' : 'text-[#0a0a0b]'
                      }`}
                    >
                      {item.question}
                    </p>
                    {/* Stays mounted so it can transition; the effect above
                        drives its height off the measured answer. */}
                    <div
                      ref={(el) => (panelRefs.current[index] = el)}
                      className="w-full overflow-hidden transition-[height,opacity] duration-300 ease-out"
                      style={{ opacity: isExpanded ? 1 : 0 }}
                    >
                      <p
                        ref={(el) => (answerRefs.current[index] = el)}
                        className="font-display font-normal text-[20px] max-[640px]:text-[16px] leading-normal text-[rgba(255,255,255,0.8)] pt-[12px]"
                      >
                        {item.answer}
                      </p>
                    </div>
                  </div>

                  {/* Chevron Icon */}
                  <div
                    className={`flex-shrink-0 flex items-center justify-center w-[32px] h-[32px] border-[0.615px] rounded ${
                      isExpanded ? 'border-white' : 'border-[#0a0a0b]'
                    } transition-all duration-300 ease-out`}
                    style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className={isExpanded ? 'text-white' : 'text-[#0a0a0b]'}
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
            );
          })}
        </div>

        {FAQ_ITEMS.length > PREVIEW_COUNT && (
          <button
            type="button"
            onClick={() => {
              // Collapsing past the open item would leave nothing highlighted,
              // so pull the selection back into the remaining set.
              if (showAll && openIndex !== null && openIndex >= PREVIEW_COUNT) setOpenIndex(null);
              setShowAll((v) => !v);
            }}
            className="font-display font-semibold text-[16px] text-[#111] border border-[#111] rounded-full px-8 py-3 hover:bg-[#111] hover:text-white transition-colors"
          >
            {showAll ? 'Show less' : 'View all'}
          </button>
        )}
      </div>
    </section>
  );
}

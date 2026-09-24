'use client';

import { useEffect } from 'react';

export default function SectionReveals() {
  useEffect(() => {
    const targets = document.querySelectorAll('.reveal-on-scroll');
    if (!targets.length || typeof IntersectionObserver === 'undefined') return;

    targets.forEach((el) => el.classList.add('reveal-pending'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}

'use client';

import { useEffect, useRef } from 'react';
import styles from '@/app/about/about.module.css';

const milestones = [
  { year: '2001', event: 'Founded with 16 students' },
  { year: '2005', event: 'Recognized by Govt. Tamil Nadu' },
  { year: '2006', event: '200+ students' },
  { year: '2010', event: 'Moved to own campus' },
  { year: '2015', event: 'Smart classes' },
  { year: '2023', event: 'School Excellence award' },
  { year: '2024', event: 'Day care started' },
  { year: '2025', event: 'Silver jubilee celebration' },
];

export default function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const line = lineRef.current;
    if (!section || !line) return;

    const items = section.querySelectorAll(`.${styles.timelineItem}`);

    const lineObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const updateLine = () => {
            const rect = section.getBoundingClientRect();
            const scrollPercent = Math.min(
              1,
              Math.max(0, (window.innerHeight - rect.top) / (rect.height + window.innerHeight))
            );
            line.style.height = `${scrollPercent * 100}%`;

            const lineBottom = rect.top + rect.height * scrollPercent;
            items.forEach((el) => {
              const item = el as HTMLElement;
              const itemTop = item.getBoundingClientRect().top + item.offsetHeight / 2;
              if (itemTop <= lineBottom) {
                item.classList.add(styles.visible);
              }
            });
          };
          updateLine();
          window.addEventListener('scroll', updateLine);
          window.addEventListener('resize', updateLine);
          cleanup = () => {
            window.removeEventListener('scroll', updateLine);
            window.removeEventListener('resize', updateLine);
          };
          lineObserver.disconnect();
        }
      },
      { threshold: 0 }
    );

    lineObserver.observe(section);
    let cleanup: (() => void) | null = null;

    return () => {
      lineObserver.disconnect();
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <section className={`section-padding ${styles.timelineSection}`} ref={sectionRef}>
      <div className="container">
        <div className="text-center">
          <span className="badge">Our Journey</span>
          <h2 className="section-title">Milestones Over the Years</h2>
          <p className="section-subtitle">From humble beginnings to a thriving school community.</p>
        </div>
        <div className={styles.timeline}>
          {milestones.map((m, i) => (
            <div key={i} className={`${styles.timelineItem} ${i % 2 === 0 ? styles.timelineLeft : styles.timelineRight}`}>
              <div className={styles.timelineContent}>
                <div className={styles.timelineYear}>{m.year}</div>
                <p className={styles.timelineEvent}>{m.event}</p>
              </div>
            </div>
          ))}
          <div className={styles.timelineLine} ref={lineRef} />
        </div>
      </div>
    </section>
  );
}

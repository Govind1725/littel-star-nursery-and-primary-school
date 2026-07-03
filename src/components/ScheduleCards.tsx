'use client';

import { useEffect, useRef } from 'react';
import styles from '@/app/child-care/child-care.module.css';

const schedule = [
  { time: '8:45 AM', title: 'Entry', icon: '🚪' },
  { time: '9:00 AM', title: 'Prayer start', icon: '🙏' },
  { time: '9:15 AM', title: 'Classes start', icon: '📚' },
  { time: '10:45 – 11:00 AM', title: 'Morning break', icon: '🎮' },
  { time: '12:30 – 1:15 PM', title: 'Lunch break', icon: '🍎' },
];

export default function ScheduleCards() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll(`.${styles.scheduleCard}`);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Array.from(cards).indexOf(entry.target);
            setTimeout(() => {
              entry.target.classList.add(styles.visible);
            }, index * 150);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.scheduleGrid} ref={gridRef}>
      {schedule.map((slot, i) => (
        <div key={i} className={styles.scheduleCard}>
          <div className={styles.scheduleIcon}>{slot.icon}</div>
          <div className={styles.scheduleTime}>{slot.time}</div>
          <h3 className={styles.scheduleTitle}>{slot.title}</h3>
        </div>
      ))}
    </div>
  );
}

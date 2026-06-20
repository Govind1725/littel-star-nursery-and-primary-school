'use client';

import { useState, useEffect } from 'react';
import { getAnnouncements, saveAnnouncements, deleteAnnouncement, type Announcement } from '@/lib/store';
import styles from './announcements.module.css';

const categoryConfig = {
  general: {
    label: 'General',
    color: 'var(--violet)',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'48px',height:'48px'}}>
        <ellipse cx="20" cy="32" rx="8" ry="14" fill="white" fillOpacity="0.9"/>
        <path d="M28 18 L52 10 L52 54 L28 46 Z" fill="white" fillOpacity="0.95"/>
        <rect x="12" y="32" width="16" height="18" rx="4" fill="white" fillOpacity="0.7"/>
        <path d="M52 24 C56 26 58 30 58 32 C58 34 56 38 52 40" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <path d="M52 28 C54 29.5 55 31 55 32 C55 33 54 34.5 52 36" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  event: {
    label: 'Event',
    color: '#059669',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'48px',height:'48px'}}>
        <circle cx="20" cy="14" r="8" fill="white" fillOpacity="0.9"/>
        <line x1="20" y1="22" x2="20" y2="50" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="44" cy="18" r="7" fill="white" fillOpacity="0.7"/>
        <line x1="44" y1="25" x2="44" y2="50" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <path d="M14 26 Q20 22 26 26" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <path d="M38 30 Q44 26 50 30" stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <circle cx="32" cy="8" r="3" fill="white" fillOpacity="0.8"/>
        <path d="M29 12 L35 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    ),
  },
  holiday: {
    label: 'Holiday',
    color: '#D97706',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'48px',height:'48px'}}>
        <circle cx="32" cy="28" r="14" fill="white" fillOpacity="0.95"/>
        <line x1="32" y1="8" x2="32" y2="4" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <line x1="32" y1="52" x2="32" y2="48" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <line x1="12" y1="28" x2="8" y2="28" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <line x1="56" y1="28" x2="52" y2="28" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <line x1="18" y1="14" x2="15" y2="11" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <line x1="49" y1="45" x2="46" y2="42" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <line x1="46" y1="14" x2="49" y2="11" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <line x1="15" y1="45" x2="18" y2="42" stroke="white" strokeWidth="3" strokeLinecap="round"/>
        <path d="M16 54 Q32 46 48 54" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
      </svg>
    ),
  },
  urgent: {
    label: 'Urgent',
    color: '#DC2626',
    icon: (
      <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'48px',height:'48px'}}>
        <rect x="20" y="30" width="24" height="20" rx="4" fill="white" fillOpacity="0.9"/>
        <rect x="27" y="24" width="10" height="12" rx="3" fill="white" fillOpacity="0.8"/>
        <ellipse cx="32" cy="14" rx="12" ry="10" fill="white" fillOpacity="0.15" stroke="white" strokeWidth="2"/>
        <path d="M24 14 Q32 8 40 14" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
        <circle cx="32" cy="40" r="3" fill="#DC2626"/>
        <line x1="32" y1="33" x2="32" y2="38" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M14 10 Q8 14 10 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" strokeOpacity="0.6"/>
        <path d="M50 10 Q56 14 54 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" strokeOpacity="0.6"/>
      </svg>
    ),
  },
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const now = Date.now();
    const THREE_DAYS = 3 * 24 * 60 * 60 * 1000;

    let items = getAnnouncements();

    // Filter out expired urgent announcements
    const active = items.filter((a) => {
      if (a.category !== 'urgent') return true;
      const age = now - new Date(a.createdAt).getTime();
      return age < THREE_DAYS;
    });

    // If some were removed, persist the cleaned list
    if (active.length < items.length) {
      saveAnnouncements(active);
    }

    // Sort: urgent (by createdAt desc) first, then normal (by createdAt desc)
    const sorted = [...active].sort((a, b) => {
      if (a.category === 'urgent' && b.category !== 'urgent') return -1;
      if (a.category !== 'urgent' && b.category === 'urgent') return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    setAnnouncements(sorted);
  }, []);

  const filtered = filter === 'all'
    ? announcements
    : announcements.filter((a) => a.category === filter);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  if (!mounted) return null;

  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <span className="badge">📢 Latest Updates</span>
          <h1>Announcements</h1>
          <p>Stay informed with the latest news, events, and updates from Little Star.</p>
        </div>
      </section>

      <section className={`section-padding ${styles.announcementsSection}`}>
        <div className="container">
          {/* Filter Tabs */}
          <div className={styles.filterRow}>
            {['all', 'general', 'event', 'holiday', 'urgent'].map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${filter === cat ? styles.filterActive : ''}`}
                onClick={() => setFilter(cat)}
                id={`filter-${cat}`}
              >
                {cat === 'all' ? '📋 All' : categoryConfig[cat as keyof typeof categoryConfig].label}
              </button>
            ))}
          </div>

          {/* Announcements List */}
          {filtered.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>📭</div>
              <h3>No announcements yet</h3>
              <p>Check back later for updates!</p>
            </div>
          ) : (
            <div className={styles.announcementsList}>
              {filtered.map((ann, i) => {
                const cfg = categoryConfig[ann.category];
                return (
                  <div
                    key={ann.id}
                    className={styles.announcementCard}
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    <div className={styles.cardLeft} style={{ background: cfg.color }}>
                      <div className={styles.cardEmoji}>{cfg.icon}</div>
                      <div className={styles.cardCategoryLabel}>{cfg.label}</div>
                    </div>
                    <div className={styles.cardBody}>
                      <div className={styles.cardMeta}>
                        <span className={styles.cardDate}>📅 {formatDate(ann.date)}</span>
                      </div>
                      <h3 className={styles.cardTitle}>{ann.title}</h3>
                      <p className={styles.cardContent}>{ann.content}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

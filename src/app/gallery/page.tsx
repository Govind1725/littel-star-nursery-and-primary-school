'use client';

import { useState, useEffect, useRef } from 'react';
import { getMediaItems, type MediaItem } from '@/lib/store';
import styles from './gallery.module.css';

const galleryEmojis = ['🎨', '📸', '🌸', '🎭', '🏃', '🎵', '🔬', '🌿', '🎉', '🏆', '📚', '🤝'];
const placeholderColors = [
  'linear-gradient(135deg, #7C3AED, #FFD700)',
  'linear-gradient(135deg, #4C1D95, #FFC107)',
  'linear-gradient(135deg, #FFD700, #7C3AED)',
  'linear-gradient(135deg, #6D28D9, #F59E0B)',
  'linear-gradient(135deg, #FFF9C4, #7C3AED)',
  'linear-gradient(135deg, #EDE9FE, #FFC107)',
];

export default function GalleryPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');
  const [lightbox, setLightbox] = useState<MediaItem | null>(null);
  const [mounted, setMounted] = useState(false);
  const [counted, setCounted] = useState<Set<number>>(new Set());
  const [counts, setCounts] = useState<number[]>([0, 0, 0]);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setMedia(getMediaItems());
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const el = statsRef.current;
    if (!el) return;

    const photos = media.filter((m) => m.type === 'image').length;
    const videos = media.filter((m) => m.type === 'video').length;
    const total = media.length;
    const statValues = [photos, videos, total];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          statValues.forEach((value, i) => {
            if (counted.has(i)) return;
            const duration = 2000;
            const steps = 30;
            const increment = value / steps;
            let current = 0;
            const timer = setInterval(() => {
              current += increment;
              if (current >= value) {
                current = value;
                clearInterval(timer);
              }
              setCounts((prev) => {
                const next = [...prev];
                next[i] = Math.floor(current);
                return next;
              });
            }, duration / steps);
            setCounted((prev) => new Set(prev).add(i));
          });
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted, media]);

  const filtered = filter === 'all' ? media : media.filter((m) => m.type === filter);

  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <span className="badge">📸 Memories</span>
          <h1>Our Gallery</h1>
          <p>Glimpses of joy, learning, and unforgettable moments at Little Star.</p>
          <div className={styles.heroStats} ref={statsRef}>
            <div className={styles.heroStat}>
              <span className={styles.heroStatIcon}>🖼️</span>
              <span className={styles.heroStatNum}>{counts[0]}</span>
              <span className={styles.heroStatLabel}>Photos</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatIcon}>🎬</span>
              <span className={styles.heroStatNum}>{counts[1]}</span>
              <span className={styles.heroStatLabel}>Videos</span>
            </div>
            <div className={styles.heroStat}>
              <span className={styles.heroStatIcon}>📸</span>
              <span className={styles.heroStatNum}>{counts[2]}</span>
              <span className={styles.heroStatLabel}>Memories</span>
            </div>
          </div>
        </div>
      </section>

      <section className={`section-padding ${styles.gallerySection}`}>
        <div className="container">
          {/* Filter */}
          <div className={styles.filterRow}>
            {(['all', 'image', 'video'] as const).map((f) => (
              <button
                key={f}
                className={`${styles.filterBtn} ${filter === f ? styles.filterActive : ''}`}
                onClick={() => setFilter(f)}
                id={`gallery-filter-${f}`}
              >
                {f === 'all' ? '🗂️ All' : f === 'image' ? '🖼️ Photos' : '🎬 Videos'}
              </button>
            ))}
          </div>

          {/* Count */}
          <p className={styles.count}>
            Showing <strong>{filtered.length}</strong> {filter === 'all' ? 'items' : filter + 's'}
          </p>

          {/* Grid */}
          {!mounted ? (
            <div className={styles.galleryGrid}>
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`${styles.mediaCard} ${styles.skeletonCard}`}>
                  <div className={`${styles.mediaThumb} ${styles.skeleton}`} />
                  <div className={styles.mediaInfo}>
                    <div className={styles.skeleton} style={{ height: '20px', borderRadius: '6px', marginBottom: '8px', width: '60%' }} />
                    <div className={styles.skeleton} style={{ height: '14px', borderRadius: '4px', width: '40%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.empty}>
              <div className={styles.emptyIcon}>🖼️</div>
              <h3>No media yet</h3>
              <p>The admin will add photos and videos soon!</p>
            </div>
          ) : (
            <div className={styles.galleryGrid}>
              {filtered.map((item, i) => (
                <div
                  key={item.id}
                  className={styles.mediaCard}
                  style={{ animationDelay: `${i * 0.06}s` }}
                  onClick={() => setLightbox(item)}
                  id={`gallery-item-${item.id}`}
                >
                  {/* Placeholder visual */}
                  <div
                    className={styles.mediaThumb}
                    style={{ background: placeholderColors[i % placeholderColors.length] }}
                  >
                    {item.url ? (
                      item.type === 'image' ? (
                        <img src={item.url} alt={item.title} className={styles.thumbImg} />
                      ) : (
                        <video src={item.url} className={styles.thumbImg} muted />
                      )
                    ) : (
                      <div className={styles.thumbPlaceholder}>
                        <span className={styles.thumbEmoji}>{galleryEmojis[i % galleryEmojis.length]}</span>
                        <span className={styles.thumbType}>{item.type === 'image' ? '🖼️ Photo' : '🎬 Video'}</span>
                      </div>
                    )}
                    <div className={styles.mediaOverlay}>
                      <span className={styles.overlayIcon}>{item.type === 'image' ? '🔍' : '▶️'}</span>
                    </div>
                    {item.type === 'video' && (
                      <div className={styles.videoTag}>🎬 Video</div>
                    )}
                  </div>
                  <div className={styles.mediaInfo}>
                    <h3 className={styles.mediaTitle}>{item.title}</h3>
                    {item.description && (
                      <p className={styles.mediaDesc}>{item.description}</p>
                    )}
                    <span className={styles.mediaDate}>
                      {new Date(item.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.lightboxClose} onClick={() => setLightbox(null)}>✕</button>
            <div className={styles.lightboxMedia}>
              {lightbox.url ? (
                lightbox.type === 'image' ? (
                  <img src={lightbox.url} alt={lightbox.title} />
                ) : (
                  <video src={lightbox.url} controls autoPlay />
                )
              ) : (
                <div className={styles.lightboxPlaceholder}>
                  <span>{lightbox.type === 'image' ? '🖼️' : '🎬'}</span>
                  <p>No media URL provided</p>
                </div>
              )}
            </div>
            <div className={styles.lightboxInfo}>
              <h3>{lightbox.title}</h3>
              {lightbox.description && <p>{lightbox.description}</p>}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

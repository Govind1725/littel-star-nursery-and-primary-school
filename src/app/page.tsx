'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getMediaItems, MediaItem } from '@/lib/store';
import styles from './page.module.css';

const contactInfo = [
  { icon: '📍', title: 'Address', lines: ['Little Star Nursery & Primary School', 'Chennai, Tamil Nadu, India'] },
  { icon: '📞', title: 'Phone', lines: ['+91 98765 43210', '+91 044-2345-6789'] },
  { icon: '✉️', title: 'Email', lines: ['info@littlestar.edu.in', 'admissions@littlestar.edu.in'] },
  { icon: '🕐', title: 'Office Hours', lines: ['Mon–Fri: 8:00 AM – 5:00 PM', 'Saturday: 9:00 AM – 1:00 PM'] },
];

const programs = [
  {
    img: '/images/program_toddler.png',
    age: '1.5 – 2.5 Years',
    badge: '🍼 Toddler',
    title: 'Toddler Program',
    desc: 'A gentle introduction to group learning through sensory play, music, and movement in a nurturing environment.',
    color: 'linear-gradient(135deg,#7C3AED,#4C1D95)',
  },
  {
    img: '/images/program_preschool.png',
    age: '2.5 – 3.5 Years',
    badge: '🌱 Nursery',
    title: 'Nursery (LKG)',
    desc: 'Building foundations in language, numbers, art, and social skills through joyful activity-based learning.',
    color: 'linear-gradient(135deg,#6D28D9,#7C3AED)',
  },
  {
    img: '/images/program_prek.png',
    age: '3.5 – 5 Years',
    badge: '🎒 Pre-KG',
    title: 'Pre-KG / UKG',
    desc: 'Preparing confident learners for primary school with literacy, numeracy, and critical thinking skills.',
    color: 'linear-gradient(135deg,#4C1D95,#6D28D9)',
  },
  {
    img: '/images/program_afterschool.png',
    age: '5 – 12 Years',
    badge: '📚 Primary',
    title: 'Primary & After School',
    desc: 'A structured curriculum blending academics, arts, sports, and values for holistic growth.',
    color: 'linear-gradient(135deg,#2E1065,#4C1D95)',
  },
];

const whyChooseUs = [
  { img: '/images/cognitive.png', title: 'Cognitive Development', desc: 'STEM-integrated curriculum sparks curiosity and builds critical thinking from an early age.' },
  { img: '/images/socio.png', title: 'Social & Emotional Growth', desc: 'Group activities and mindfulness build empathy, resilience, and strong friendships.' },
  { img: '/images/language.png', title: 'Language & Literacy', desc: 'Multi-lingual exposure and storytelling build strong communication skills.' },
  { img: '/images/life.png', title: 'Life Skills', desc: 'Independence, responsibility, and self-care are woven into daily routines.' },
  { img: '/images/karate_icon.png', title: 'Karate & Silambam', desc: 'Traditional martial arts build discipline, focus, and confidence in every child.' },
  { img: '/images/dance_icon.png', title: 'Arts & Expression', desc: 'Dance, music, and art forms nurture creativity and self-expression.' },
];

const lifeAtSchool = [
  { img: '/images/campus_building.png', label: 'Our Campus', caption: 'Safe, vibrant, and purpose-built spaces for play and learning.' },
  { img: '/images/learning_time.png', label: 'Learning Time', caption: 'Activity-based lessons that make every concept come alive.' },
  { img: '/images/play_time.png', label: 'Play Time', caption: 'Unstructured play fosters creativity, motor skills, and joy.' },
];

const stats = [
  { value: 500, suffix: '+', label: 'Happy Students' },
  { value: 25, suffix: '+', label: 'Expert Teachers' },
  { value: 14, suffix: '+', label: 'Years of Excellence' },
  { value: 98, suffix: '%', label: 'Parent Satisfaction' },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Parent of Aarav, Grade 2',
    text: 'Little Star has been a wonderful journey for our son. The teachers are so caring and the environment is full of joy!',
    emoji: '👩',
  },
  {
    name: 'Rajesh Kumar',
    role: 'Parent of Ananya, LKG',
    text: 'My daughter looks forward to school every single day. The activities are amazing and she has grown so much!',
    emoji: '👨',
  },
  {
    name: 'Meena Patel',
    role: 'Parent of Rohan, Nursery',
    text: 'The staff is incredibly supportive. Little Star truly feels like a second home for the children.',
    emoji: '👩‍💼',
  },
];

const announcements = [
  { date: 'June 20, 2026', tag: '🎉 Event', title: 'Annual Sports Day – July 15th', desc: 'Join us for a day of fun, competition, and celebration! All parents are invited.' },
  { date: 'June 15, 2026', tag: '📢 Notice', title: 'Admissions Open for 2026–27', desc: 'Seats are filling fast! Apply now for Nursery, LKG, UKG & Primary classes.' },
  { date: 'June 10, 2026', tag: '🏆 Achievement', title: 'State Science Fair Winners', desc: 'Our Grade 4 students won gold at the Tamil Nadu State Science Exhibition!' },
];

const floatingItems = ['⭐', '🌟', '✨', '🎈', '🦋', '🌸', '🎨', '📚'];

const galleryEmojis = ['🎨', '📸', '🌸', '🎭', '🏃', '🎵', '🔬', '🌿', '🎉', '🏆', '📚', '🤝'];
const placeholderColors = [
  'linear-gradient(135deg, #7C3AED, #FFD700)',
  'linear-gradient(135deg, #4C1D95, #FFC107)',
  'linear-gradient(135deg, #FFD700, #7C3AED)',
  'linear-gradient(135deg, #6D28D9, #F59E0B)',
  'linear-gradient(135deg, #FFF9C4, #7C3AED)',
  'linear-gradient(135deg, #EDE9FE, #FFC107)',
];

export default function HomePage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [counted, setCounted] = useState<Set<number>>(new Set());
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);
  const statsRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  useEffect(() => {
    setMounted(true);
    setMedia(getMediaItems().filter((m) => m.type === 'image'));
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          stats.forEach((s, i) => {
            if (counted.has(i)) return;
            const duration = 2000;
            const steps = 30;
            const increment = s.value / steps;
            let current = 0;
            const timer = setInterval(() => {
              current += increment;
              if (current >= s.value) {
                current = s.value;
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
  }, [mounted]);

  if (!mounted) return null;

  return (
    <>
      {/* ===== HERO ===== */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />

        {floatingItems.map((item, i) => (
          <div
            key={i}
            className={styles.floatingItem}
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + (i % 3)}s`,
              fontSize: `${1.2 + (i % 3) * 0.5}rem`,
            }}
          >
            {item}
          </div>
        ))}

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeDot} />
            Admissions Open 2026-27
          </div>

          <h1 className={styles.heroTitle}>
            Where Every Child
            <br />
            <span className={styles.heroHighlight}>Shines Like a Star</span>
          </h1>

          <p className={styles.heroDesc}>
            Welcome to Little Star Nursery &amp; Primary School — a vibrant, nurturing place where young
            learners explore, discover, and grow into confident individuals.
          </p>

          <div className={styles.heroBtns}>
            <Link href="/contact" className="btn-primary" id="hero-enroll-btn">
              Enroll Your Child
            </Link>
            <Link href="/about" className="btn-secondary" id="hero-learn-btn">
              Learn More →
            </Link>
          </div>

          <div className={styles.heroStats}>
            {stats.map((s, i) => (
              <div key={i} className={styles.heroStat}>
                <div className={styles.heroStatNum}>{s.value}{s.suffix}</div>
                <div className={styles.heroStatLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.heroCurve}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,0 C480,80 960,80 1440,0 L1440,80 L0,80 Z" fill="#FAFAFA" />
          </svg>
        </div>
      </section>

      {/* ===== WELCOME ===== */}
      <section className={`section-padding ${styles.welcome}`}>
        <div className="container">
          <div className={styles.welcomeGrid}>
            <div className={styles.welcomeImg}>
              <div className={styles.imgCard} style={{ position: 'relative' }}>
                <Image
                  src="/images/campus_building.png"
                  alt="Little Star Campus"
                  fill
                  style={{ objectFit: 'cover', borderRadius: '20px' }}
                  sizes="(max-width: 768px) 100vw, 45vw"
                  priority
                />
              </div>
              <div className={styles.imgBadge}>🌟 Est. 2010</div>
              <div className={styles.imgBubble}>
                <span>💛</span>
                <span>Loved by 500+ families!</span>
              </div>
            </div>
            <div className={styles.welcomeText}>
              <span className="badge">🌟 Welcome to Little Star</span>
              <h2 className="section-title">A Day at Little Star</h2>
              <p className={styles.welcomePara}>
                At Little Star Nursery &amp; Primary School, we believe that the early years are the
                most critical in shaping a child&apos;s future. Our dedicated team of educators creates
                a safe, stimulating, and joyful environment.
              </p>
              <p className={styles.welcomePara}>
                We combine play-based learning with structured academics to nurture creativity,
                curiosity, and confidence in every child.
              </p>
              <div className={styles.welcomeChecks}>
                {['Qualified & caring teachers', 'Safe & secure campus', 'Activity-based learning', 'Regular parent updates'].map((item) => (
                  <div key={item} className={styles.checkItem}>
                    <span className={styles.checkIcon}>✅</span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/about" className="btn-outline" id="welcome-about-btn" style={{ marginTop: '32px', display: 'inline-flex' }}>
                Discover More →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROGRAMS ===== */}
      <section className={`section-padding ${styles.programsSection}`}>
        <div className="container">
          <div className="text-center">
            <span className="badge">🎓 Our Programs</span>
            <h2 className="section-title">Programs for Every Stage</h2>
            <p className="section-subtitle">
              Age-appropriate programs designed to nurture your child&apos;s unique potential at every developmental stage.
            </p>
          </div>
          <div className={styles.stageJourney}>
            {programs.map((p, i) => (
              <div key={i} className={`${styles.stageRow} ${i % 2 === 0 ? '' : styles.stageRowRtl}`}>
                {i > 0 && <div className={styles.stageConnector} />}
                <Link href="/admission" className={styles.stageCard}>
                  <div className={styles.stageMedia}>
                    <div className={styles.stageImageWrap} style={{ background: p.color }}>
                      <Image src={p.img} alt={p.title} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" />
                    </div>
                    <div className={styles.stageAgeBubble}>{p.age}</div>
                  </div>
                  <div className={styles.stageContent}>
                    <span className={styles.stageEmoji}>{p.badge}</span>
                    <h3 className={styles.stageTitle}>{p.title}</h3>
                    <p className={styles.stageDesc}>{p.desc}</p>
                    <span className={styles.stageArrow}>
                      Explore <span>→</span>
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STATS BANNER ===== */}
      <section className={styles.statsBanner} ref={statsRef}>
        <div className={styles.statsBg} />
        <div className="container">
          <div className={styles.statsGrid}>
            {stats.map((s, i) => (
              <div key={i} className={styles.statItem}>
                <div className={styles.statNum}>{counts[i]}{s.suffix}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY CHOOSE US ===== */}
      <section className={`section-padding ${styles.whySection}`}>
        <div className="container">
          <div className="text-center">
            <span className="badge">🎯 Why Little Star</span>
            <h2 className="section-title">A Holistic Approach to Learning</h2>
            <p className="section-subtitle">
              Our curriculum covers all dimensions of a child&apos;s growth — cognitive, social, physical, creative, and emotional.
            </p>
          </div>
          <div className={styles.whyGrid}>
            {whyChooseUs.map((w, i) => (
              <div key={i} className={styles.whyCard} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className={styles.whyImgWrap}>
                  <Image
                    src={w.img}
                    alt={w.title}
                    width={80}
                    height={80}
                    style={{ objectFit: 'contain', width: '80px', height: '80px' }}
                  />
                </div>
                <h3 className={styles.whyTitle}>{w.title}</h3>
                <p className={styles.whyDesc}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LIFE AT SCHOOL ===== */}
      <section className={`section-padding ${styles.lifeSection}`}>
        <div className="container">
          <div className="text-center">
            <span className="badge">🏫 Campus Life</span>
            <h2 className="section-title">Life at Little Star</h2>
            <p className="section-subtitle">
              Every corner of our campus is designed to inspire curiosity, creativity, and joy.
            </p>
          </div>
          <div className={styles.lifeGrid}>
            {lifeAtSchool.map((item, i) => (
              <div key={i} className={`${styles.lifeCard} ${i === 0 ? styles.lifeCardFeatured : ''}`}>
                <div className={styles.lifeImgWrap} style={{ position: 'relative' }}>
                  <Image
                    src={item.img}
                    alt={item.label}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className={styles.lifeOverlay} />
                  <div className={styles.lifeCaption}>
                    <div className={styles.lifeLabel}>{item.label}</div>
                    <p className={styles.lifeCaptionText}>{item.caption}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CURRICULUM HIGHLIGHT ===== */}
      <section className={`section-padding ${styles.curriculumSection}`}>
        <div className="container">
          <div className={styles.curriculumGrid}>
            <div className={styles.curriculumImg}>
              <div className={styles.curriculumImgWrap} style={{ position: 'relative' }}>
                <Image
                  src="/images/curriculum_panda.png"
                  alt="Little Star Curriculum"
                  fill
                  loading="eager"
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </div>
            </div>
            <div className={styles.curriculumText}>
              <span className="badge">📖 Our Curriculum</span>
              <h2 className="section-title">Seven Petal Learning Framework</h2>
              <p className={styles.curriculumPara}>
                Our proprietary curriculum is built on seven pillars of development — cognitive, language, social, emotional, physical, creative, and life skills — ensuring every child grows into a well-rounded individual.
              </p>
              <div className={styles.curriculumPillars}>
                {['🧠 Cognitive', '💬 Language', '🤝 Social', '❤️ Emotional', '🏃 Physical', '🎨 Creative', '🌟 Life Skills'].map((p) => (
                  <div key={p} className={styles.pillarChip}>{p}</div>
                ))}
              </div>
              <Link href="/child-care" className="btn-primary" id="curriculum-learn-btn" style={{ marginTop: '28px', display: 'inline-flex' }}>
                Explore Our Approach →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ANNOUNCEMENTS ===== */}
      <section className={`section-padding ${styles.announcementsSection}`}>
        <div className="container">
          <div className={styles.announcementsHeader}>
            <div>
              <span className="badge">📢 Latest Updates</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>School Announcements</h2>
            </div>
            <Link href="/announcements" className="btn-outline" id="home-announcements-btn">
              View All →
            </Link>
          </div>
          <div className={styles.announcementsGrid}>
            {announcements.map((a, i) => (
              <div key={i} className={styles.announcementCard} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className={styles.announcementMeta}>
                  <span className={styles.announcementTag}>{a.tag}</span>
                  <span className={styles.announcementDate}>{a.date}</span>
                </div>
                <h3 className={styles.announcementTitle}>{a.title}</h3>
                <p className={styles.announcementDesc}>{a.desc}</p>
                <Link href="/announcements" className={styles.announcementLink} id={`announcement-${i}-btn`}>
                  Read More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== GALLERY PREVIEW ===== */}
      <section className={`section-padding ${styles.gallery}`}>
        <div className="container">
          <div className="text-center">
            <span className="badge">📸 School Life</span>
            <h2 className="section-title">Moments at Little Star</h2>
            <p className="section-subtitle">
              Capturing the joy, learning, and friendships that make every day special.
            </p>
          </div>
          <div className={styles.marqueeWrap}>
            <div className={styles.marqueeTrack}>
              {[...media, ...media].length > 0
                ? [...media, ...media].map((item, i) => (
                    <div key={`${item.id}-${i}`} className={styles.marqueeItem}>
                      {item.url ? (
                        <img src={item.url} alt={item.title} className={styles.marqueeImg} loading="lazy" />
                      ) : (
                        <div
                          className={styles.marqueePlaceholder}
                          style={{ background: placeholderColors[i % placeholderColors.length] }}
                        >
                          <span className={styles.marqueeEmoji}>{galleryEmojis[i % galleryEmojis.length]}</span>
                        </div>
                      )}
                    </div>
                  ))
                : [...Array(12)].map((_, i) => (
                    <div key={i} className={styles.marqueeItem}>
                      <div
                        className={styles.marqueePlaceholder}
                        style={{ background: placeholderColors[i % placeholderColors.length] }}
                      >
                        <span className={styles.marqueeEmoji}>{galleryEmojis[i % galleryEmojis.length]}</span>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
          <div className="text-center" style={{ marginTop: '40px' }}>
            <Link href="/gallery" className="btn-outline" id="home-gallery-btn">
              View Full Gallery 📸
            </Link>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className={`section-padding ${styles.testimonials}`}>
        <div className="container">
          <div className="text-center">
            <span className="badge">💬 Parent Stories</span>
            <h2 className="section-title">What Parents Say</h2>
            <p className="section-subtitle">
              Don&apos;t just take our word for it — hear from the families who trust us with their little stars.
            </p>
          </div>
          <div className={styles.testimonialGrid}>
            {testimonials.map((t, i) => (
              <div key={i} className={styles.testimonialCard}>
                <div className={styles.quoteIcon}>&ldquo;</div>
                <p className={styles.testimonialText}>{t.text}</p>
                <div className={styles.testimonialAuthor}>
                  <div className={styles.authorEmoji}>{t.emoji}</div>
                  <div>
                    <div className={styles.authorName}>{t.name}</div>
                    <div className={styles.authorRole}>{t.role}</div>
                  </div>
                </div>
                <div className={styles.stars}>⭐⭐⭐⭐⭐</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaBox}>
            <div className={styles.ctaDecos}>
              <span className={styles.ctaDeco1}>🌟</span>
              <span className={styles.ctaDeco2}>⭐</span>
              <span className={styles.ctaDeco3}>✨</span>
            </div>
            <h2 className={styles.ctaTitle}>Ready to Begin the Journey?</h2>
            <p className={styles.ctaDesc}>
              Give your child the gift of a bright future. Join the Little Star family today!
            </p>
            <div className={styles.ctaBtns}>
              <Link href="/contact" className="btn-primary" id="cta-enroll-btn">
                🎒 Enroll Now
              </Link>
              <Link href="/gallery" className="btn-outline" id="cta-gallery-btn" style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}>
                View Gallery 📸
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT ===== */}
      <section className={`section-padding ${styles.contactSection}`}>
        <div className="container">
          <div className={styles.contactGrid}>
            <div className={styles.infoCol}>
              <span className="badge">📞 Get in Touch</span>
              <h2 className="section-title" style={{ marginBottom: '12px' }}>Let&apos;s Connect!</h2>
              <p className={styles.infoDesc}>
                Have questions about admissions, fees, or our programs? Our team is here to help!
              </p>

              <div className={styles.infoCards}>
                {contactInfo.map((info, i) => (
                  <div key={i} className={styles.infoCard}>
                    <div className={styles.infoIcon}>{info.icon}</div>
                    <div>
                      <div className={styles.infoCardTitle}>{info.title}</div>
                      {info.lines.map((line, j) => (
                        <div key={j} className={styles.infoLine}>{line}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.quickInfo}>
                <h3 className={styles.quickTitle}>🎒 Admissions</h3>
                <p>Applications for 2026–27 are currently open. Visit us or fill out the form to get started!</p>
              </div>
            </div>

            <div className={styles.formCol}>
              {submitted ? (
                <div className={styles.successBox}>
                  <div className={styles.successIcon}>🎉</div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out! We&apos;ll get back to you within 24 hours.</p>
                  <button
                    className="btn-primary"
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                    id="home-contact-send-another-btn"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                  <h3 className={styles.formTitle}>Send us a Message ✉️</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="home-name">Full Name *</label>
                      <input
                        id="home-name" name="name" type="text"
                        placeholder="Your full name"
                        value={form.name} onChange={handleChange}
                        required className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="home-email">Email Address *</label>
                      <input
                        id="home-email" name="email" type="email"
                        placeholder="your@email.com"
                        value={form.email} onChange={handleChange}
                        required className={styles.input}
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="home-phone">Phone Number</label>
                      <input
                        id="home-phone" name="phone" type="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone} onChange={handleChange}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="home-subject">Subject *</label>
                      <select
                        id="home-subject" name="subject"
                        value={form.subject} onChange={handleChange}
                        required className={styles.input}
                      >
                        <option value="">Select a subject</option>
                        <option value="admission">Admission Inquiry</option>
                        <option value="fees">Fee Structure</option>
                        <option value="curriculum">Curriculum</option>
                        <option value="general">General Inquiry</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="home-message">Message *</label>
                    <textarea
                      id="home-message" name="message"
                      placeholder="Tell us how we can help you..."
                      value={form.message} onChange={handleChange}
                      required rows={5} className={`${styles.input} ${styles.textarea}`}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`btn-primary ${styles.submitBtn}`}
                    id="home-contact-submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className={styles.spinner} /> Sending...</>
                    ) : (
                      <>🚀 Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== MAP ===== */}
      <section className={styles.mapSection}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1!2d80.2707!3d13.0827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52664fc6e8b4f1%3A0xd6b9e81b3f7f1a2e!2sLITTLE%20STAR%20NURSERY%20%26%20PRIMARY%20SCHOOL%20%7C%20STAR%20KIDS%20PRE%20SCHOOL%20%26%20DAY%20CARE%20%7C%20STAR%20TUITION%20CENTRE!5e0!3m2!1sen!2sin!4v1750420000000!5m2!1sen!2sin"
          className={styles.mapIframe}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Little Star School Location"
        />

      </section>
    </>
  );
}

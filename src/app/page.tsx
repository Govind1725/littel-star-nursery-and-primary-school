'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGallery, useAnnouncements, useRealtimeSubscription } from '@/lib/queries';
import { TABLES } from '@/lib/supabase';
import styles from './page.module.css';
import { MapPin, Phone, Mail, Clock, Baby, Sprout, Backpack, BookOpen, BrainCircuit, MessageSquare, Users, Heart, Activity, Palette, Sparkles, User, BriefcaseBusiness, PartyPopper, Megaphone, Trophy, Star, Bell, ImageIcon, Check, Video, Smile, Handshake, Dumbbell, Microscope, Camera, Theater, FileAudio, Leaf } from 'lucide-react';

const contactInfo = [
  { icon: MapPin, title: 'Address', lines: ['No.2 Anna main road, Jayalakshmi Nagar', 'Nerkundram, Chennai-107'] },
  { icon: Phone, title: 'Phone', lines: ['9941294084'] },
  { icon: Mail, title: 'Email', lines: ['littlestarnpschoolnerkundram@gmail.com'] },
  { icon: Clock, title: 'Office Hours', lines: ['Mon–Fri: 9:00 AM – 5:00 PM', 'Saturday: 9:00 AM – 3:00 PM', 'Sunday & Govt. holidays: Holiday'] },
];

const programs = [
  {
    img: '/images/program_toddler.png',
    age: '2.5 – 3.5 Years',
    badge: 'Toddler',
    icon: Baby,
    title: 'Toddler Program',
    desc: 'A gentle introduction to group learning through sensory play, music, and movement in a nurturing environment.',
    color: 'linear-gradient(135deg,#7C3AED,#4C1D95)',
  },
  {
    img: '/images/program_preschool.png',
    age: '3.5 – 4.5 Years',
    badge: 'Nursery',
    icon: Sprout,
    title: 'Nursery (LKG)',
    desc: 'Building foundations in language, numbers, art, and social skills through joyful activity-based learning.',
    color: 'linear-gradient(135deg,#6D28D9,#7C3AED)',
  },
  {
    img: '/images/program_prek.png',
    age: '4.5 – 5.5 Years',
    badge: 'Pre-KG',
    icon: Backpack,
    title: 'Pre-KG / UKG',
    desc: 'Preparing confident learners for primary school with literacy, numeracy, and critical thinking skills.',
    color: 'linear-gradient(135deg,#4C1D95,#6D28D9)',
  },
  {
    img: '/images/program_afterschool.png',
    age: '5 – 12 Years',
    badge: 'Primary',
    icon: BookOpen,
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
  { value: 500, suffix: '+', label: 'Happy Students', icon: Users },
  { value: 25, suffix: '+', label: 'Expert Teachers', icon: User },
  { value: 25, suffix: '+', label: '25+ Years of Excellence', icon: Trophy },
  { value: 98, suffix: '%', label: 'Exceptional Parents', icon: Heart },
];

const testimonials = [
  {
    name: 'Priya Sharma',
    role: 'Parent of Aarav, Grade 2',
    text: 'Little Star has been a wonderful journey for our son. The teachers are so caring and the environment is full of joy!',
    emoji: User,
  },
  {
    name: 'Rajesh Kumar',
    role: 'Parent of Ananya, LKG',
    text: 'My daughter looks forward to school every single day. The activities are amazing and she has grown so much!',
    emoji: User,
  },
  {
    name: 'Meena Patel',
    role: 'Parent of Rohan, Nursery',
    text: 'The staff is incredibly supportive. Little Star truly feels like a second home for the children.',
    emoji: BriefcaseBusiness,
  },
];


const galleryIcons = [Palette, Camera, Sparkles, Theater, Activity, FileAudio, Microscope, Leaf, PartyPopper, Trophy, BookOpen, Handshake];
const placeholderColors = [
  'linear-gradient(135deg, #7C3AED, #FFD700)',
  'linear-gradient(135deg, #4C1D95, #FFC107)',
  'linear-gradient(135deg, #FFD700, #7C3AED)',
  'linear-gradient(135deg, #6D28D9, #F59E0B)',
  'linear-gradient(135deg, #FFF9C4, #7C3AED)',
  'linear-gradient(135deg, #EDE9FE, #FFC107)',
];

export default function HomePage() {
  const [mounted, setMounted] = useState(false);
  const [counted, setCounted] = useState<Set<number>>(new Set());
  const [counts, setCounts] = useState<number[]>([0, 0, 0, 0]);
  const statsRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // TanStack Query hooks
  const { data: announcementsData = [] } = useAnnouncements();
  const { data: galleryData = [] } = useGallery();

  // Supabase Realtime subscriptions
  useRealtimeSubscription(TABLES.announcements, ['announcements']);
  useRealtimeSubscription(TABLES.gallery, ['gallery']);

  const media = galleryData;
  const homeAnnouncements = announcementsData;

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

        <div className={styles.decorativeElements}>
          {/* Dotted Curves */}
          <svg className={styles.decoCurves} viewBox="0 0 1440 800" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
            <path d="M-100,250 Q250,50 600,300 T1500,200" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="6 6" />
            <path d="M-50,650 Q400,800 850,550 T1550,600" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.5" strokeDasharray="6 6" />
          </svg>

          {/* Stars */}
          <div className={`${styles.decoStar} ${styles.starYellow}`} style={{ top: '25%', left: '20%' }}>★</div>
          <div className={`${styles.decoStar} ${styles.starYellow}`} style={{ top: '25%', right: '25%' }}>★</div>
          <div className={`${styles.decoStar} ${styles.starOrange}`} style={{ top: '15%', left: '8%' }}>★</div>
          <div className={`${styles.decoStar} ${styles.starOrange}`} style={{ top: '30%', right: '5%' }}>★</div>
          <div className={`${styles.decoStar} ${styles.starOrange}`} style={{ bottom: '25%', left: '10%' }}>★</div>
          <div className={`${styles.decoStar} ${styles.starOrange}`} style={{ bottom: '10%', right: '15%' }}>★</div>

          {/* Butterfly Outline */}
          <svg className={styles.decoButterfly} style={{ top: '20%', right: '15%' }} width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2">
            <path d="M12 22s-3-2-3-8c0-3.5 1-4.5 1-4.5S6.5 9 4 12c0 0-2-3 1-6.5C8 2 12 7 12 7s4-5 7-1.5C22 9 20 12 20 12c-2.5-3-6-2.5-6-2.5s1 1 1 4.5c0 6-3 8-3 8z" />
            <path d="M12 22v-8" />
            <path d="M11 7c-1-2-3-4-5-4" />
            <path d="M13 7c1-2 3-4 5-4" />
          </svg>

          {/* Book Outline */}
          <svg className={styles.decoBook} style={{ bottom: '30%', right: '8%' }} width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>

          {/* Small Sparkles */}
          <div className={styles.decoSparkle} style={{ top: '15%', left: '25%' }}>✦</div>
          <div className={styles.decoSparkle} style={{ top: '40%', right: '10%' }}>✦</div>
          <div className={styles.decoSparkle} style={{ bottom: '20%', left: '25%' }}>✦</div>
        </div>

        <div className={`container ${styles.heroContent}`}>
          <div className={styles.heroBadge}>
            <span className={styles.badgeDot} />
            ADMISSIONS OPEN 2026-27
          </div>

          <div className={styles.heroTitleWrapper}>
            <div className={styles.heroWelcome}>Welcome to</div>
            <h1 className={styles.heroMainTitle}>LITTLE STAR</h1>
            <div className={styles.heroSubTitle}>Nursery &amp; Primary School</div>
            <div className={styles.heroBottomBadge}>
              <span className={styles.starIcon}>★</span> STAR KIDS Pre-School &amp; Day Care
            </div>
            <div className={styles.heroDaycareHours}>
              Day care Available from 8:30 am to 8 pm.
            </div>
          </div>

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

          <p className={styles.heroYears}>25+ Years of Excellence</p>

        </div>

        <div className={styles.heroCurve}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none">
            <path d="M0,0 C480,80 960,80 1440,0 L1440,80 L0,80 Z" fill="#FAFAFA" />
          </svg>
        </div>
      </section>

      {/* ===== ANNOUNCEMENTS ===== */}
      <section className={`section-padding ${styles.announcementsSection}`}>
        <div className="container">
          <div className={styles.announcementsHeader}>
            <div>
              <span className="badge"><Bell size={16} style={{ display: 'inline', marginRight: '6px' }} /> Latest Updates</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>School Announcements</h2>
            </div>
            <Link href="/announcements" className="btn-outline" id="home-announcements-btn">
              View All →
            </Link>
          </div>
          <div className={styles.announcementsGrid}>
            {homeAnnouncements.slice(0, 3).map((a, i) => {
              const tagMap: Record<string, { label: string; icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }> }> = {
                general: { label: 'Notice', icon: Megaphone },
                event: { label: 'Event', icon: PartyPopper },
                holiday: { label: 'Holiday', icon: Star },
                urgent: { label: 'Urgent', icon: Bell },
              };
              const tag = tagMap[a.category] || tagMap.general;
              const TagIcon = tag.icon;
              const formattedDate = new Date(a.created_at).toLocaleDateString('en-IN', {
                year: 'numeric', month: 'short', day: 'numeric'
              });
              return (
                <div key={a.id} className={styles.announcementCard} style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className={styles.announcementMeta}>
                    <span className={styles.announcementTag}><TagIcon size={14} style={{display: 'inline', marginRight: '4px'}} />{tag.label}</span>
                    <span className={styles.announcementDate}>{formattedDate}</span>
                  </div>
                  <h3 className={styles.announcementTitle}>{a.title}</h3>
                  <p className={styles.announcementDesc}>{a.description}</p>
                  <Link href="/announcements" className={styles.announcementLink} id={`announcement-${i}-btn`}>
                    Read More →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== WELCOME ===== */}
      <section className={`section-padding ${styles.welcomeSection}`}>
        <div className="container">
          <div className={styles.welcomeGrid}>
            <div className={styles.welcomeImgWrap}>
              <div className={styles.welcomeBadgeTop}>
                <Heart size={16} fill="#F97316" color="#F97316" /> Loved by 500+ families!
              </div>
              <Image 
                src="/images/campus_building.png" 
                alt="Welcome to Little Star" 
                width={600} 
                height={450} 
                className={styles.welcomeImg}
              />
              <div className={styles.welcomeBadgeBottom}>
                <Sparkles size={16} fill="#EAB308" color="#EAB308" /> Est. 2010
              </div>
            </div>
            
            <div>
              <span className="badge" style={{ background: '#FEF08A', color: '#5A2C99', borderColor: '#FEF08A', fontWeight: 800 }}>
                <Sparkles size={16} fill="#EAB308" color="#EAB308" style={{display: 'inline', marginRight: '6px'}} /> 
                WELCOME TO LITTLE STAR
              </span>
              <h2 className={styles.welcomeTitle}>A Day at Little Star</h2>
              
              <p className={styles.welcomeText}>
                At Little Star Nursery & Primary School, we believe that the early years are the most critical in shaping a child&apos;s future. Our dedicated team of educators creates a safe, stimulating, and joyful environment.
              </p>
              
              <p className={styles.welcomeText}>
                We combine play-based learning with structured academics to nurture creativity, curiosity, and confidence in every child.
              </p>
              
              <div className={styles.welcomeFeatures}>
                <div className={styles.welcomeFeature}>
                  <div className={styles.welcomeFeatureIcon}><Check size={14} strokeWidth={3} /></div>
                  Qualified & caring teachers
                </div>
                <div className={styles.welcomeFeature}>
                  <div className={styles.welcomeFeatureIcon}><Check size={14} strokeWidth={3} /></div>
                  Safe & secure campus
                </div>
                <div className={styles.welcomeFeature}>
                  <div className={styles.welcomeFeatureIcon}><Check size={14} strokeWidth={3} /></div>
                  Activity-based learning
                </div>
                <div className={styles.welcomeFeature}>
                  <div className={styles.welcomeFeatureIcon}><Check size={14} strokeWidth={3} /></div>
                  Regular parent updates
                </div>
              </div>
              
              <Link href="/about" className="btn-outline" style={{ display: 'inline-flex', padding: '12px 32px' }}>
                Discover More &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PROGRAMS ===== */}
      <section className={`section-padding ${styles.programsSection}`}>
        <div className="container">
          <div className="text-center">
            <span className="badge"><BookOpen size={16} style={{display: 'inline', marginRight: '4px'}} /> Our Programs</span>
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
                    <span className={styles.stageEmoji}><p.icon size={24} style={{display: 'inline', marginRight: '8px'}} />{p.badge}</span>
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
                <div className={styles.statIcon}><s.icon size={28} strokeWidth={1.5} /></div>
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
            <span className="badge"><Sparkles size={16} style={{display: 'inline', marginRight: '4px'}} /> Why Little Star</span>
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
                    className={styles.whyImg}
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
            <span className="badge"><MapPin size={16} style={{display: 'inline', marginRight: '4px'}} /> Campus Life</span>
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
              <span className="badge"><BookOpen size={16} style={{display: 'inline', marginRight: '4px'}} /> Our Curriculum</span>
              <h2 className="section-title">Seven Petal Learning Framework</h2>
              <p className={styles.curriculumPara}>
                Our proprietary curriculum is built on seven pillars of development — cognitive, language, social, emotional, physical, creative, and life skills — ensuring every child grows into a well-rounded individual.
              </p>
              <div className={styles.curriculumPillars}>
                {[
                  { label: 'Cognitive', icon: BrainCircuit },
                  { label: 'Language', icon: MessageSquare },
                  { label: 'Social', icon: Users },
                  { label: 'Emotional', icon: Heart },
                  { label: 'Physical', icon: Activity },
                  { label: 'Creative', icon: Palette },
                  { label: 'Life Skills', icon: Sparkles }
                ].map((p, i) => (
                  <div key={i} className={styles.pillarChip}>
                    <p.icon size={16} style={{marginRight: '6px', display: 'inline'}} /> {p.label}
                  </div>
                ))}
              </div>
              <Link href="/child-care" className="btn-primary" id="curriculum-learn-btn" style={{ marginTop: '28px', display: 'inline-flex' }}>
                Explore Our Approach →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== GALLERY PREVIEW ===== */}
      <section className={`section-padding ${styles.gallery}`}>
        <div className="container">
          <div className="text-center">
            <span className="badge"><Camera size={16} style={{display: 'inline', marginRight: '4px'}} /> School Life</span>
            <h2 className="section-title">Moments at Little Star</h2>
            <p className="section-subtitle">
              Capturing the joy, learning, and friendships that make every day special.
            </p>
          </div>
          <div className={styles.marqueeWrap}>
            <div className={styles.marqueeTrack}>
              {mounted && [...media, ...media].length > 0
                ? [...media, ...media].map((item, i) => (
                    <div key={`${item.id}-${i}`} className={styles.marqueeItem}>
                      {item.media_url ? (
                        item.media_type === 'image' ? (
                          <img src={item.media_url} alt={item.title} className={styles.marqueeImg} loading="lazy" />
                        ) : (
                          <video src={item.media_url} className={styles.marqueeImg} muted loop autoPlay playsInline style={{ objectFit: 'cover', height: '100%', width: '100%' }} />
                        )
                      ) : (
                        <div
                          className={styles.marqueePlaceholder}
                          style={{ background: placeholderColors[i % placeholderColors.length] }}
                        >
                          {(() => { const Icon = galleryIcons[i % galleryIcons.length]; return <Icon size={32} color="white" />; })()}
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
                        {(() => { const Icon = galleryIcons[i % galleryIcons.length]; return <Icon size={32} color="white" />; })()}
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

      {/* ===== DAILY ROUTINE ===== */}
      <section className={`section-padding ${styles.routineSection}`}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '1200px' }}>
          <span className={styles.routineBadge}>DAILY ROUTINE</span>
          <h2 className={styles.routineTitle}>A Day at Little Star</h2>
          <p className={styles.routineSub}>A balanced schedule of learning, play, and rest.</p>

          <div className={styles.routineTimeline}>
            <div className={styles.timelineLine}></div>
            <div className={styles.timelineCards}>
              {[
                { time: '8:45 AM', title: 'Entry', icon: '/images/routine_entry.png', bg: '#FFDFDF' },
                { time: '9:00 AM', title: 'Prayer start', icon: '/images/routine_prayer.png', bg: '#FFF1B8' },
                { time: '9:15 AM', title: 'Classes start', icon: '/images/routine_classes.png', bg: '#BDECB6' },
                { time: '10:45 – 11:00 AM', title: 'Morning break', icon: '/images/routine_break.png', bg: '#C2DBFF' },
                { time: '12:30 – 1:15 PM', title: 'Lunch break', icon: '/images/routine_lunch.png', bg: '#FFD1D1' },
              ].map((item, i) => (
                <div key={i} className={styles.routineCard}>
                  <div className={styles.routineIconWrapper} style={{ backgroundColor: item.bg }}>
                    <Image src={item.icon} alt={item.title} width={64} height={64} className={styles.routineIconImg} />
                  </div>
                  <div className={styles.routineTime}>{item.time}</div>
                  <h3 className={styles.routineCardTitle}>{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className={`section-padding ${styles.testimonials}`}>
        <div className="container">
          <div className="text-center">
            <span className="badge"><MessageSquare size={16} style={{display: 'inline', marginRight: '4px'}} /> Parent Stories</span>
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
                  <div className={styles.authorEmoji}><t.emoji size={24} /></div>
                  <div>
                    <div className={styles.authorName}>{t.name}</div>
                    <div className={styles.authorRole}>{t.role}</div>
                  </div>
                </div>
                <div className={styles.stars}>
                  {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="#F59E0B" color="#F59E0B" style={{display: 'inline', marginRight: '2px'}} />)}
                </div>
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
                <Backpack size={18} style={{display: 'inline', marginRight: '6px', marginBottom: '-4px'}} /> Enroll Now
              </Link>
              <Link href="/gallery" className="btn-outline" id="cta-gallery-btn" style={{ borderColor: 'rgba(255,255,255,0.5)', color: '#fff' }}>
                View Gallery <Camera size={18} style={{display: 'inline', marginLeft: '6px', marginBottom: '-4px'}} />
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
              <span className="badge"><Phone size={16} style={{display: 'inline', marginRight: '4px'}} /> Get in Touch</span>
              <h2 className="section-title" style={{ marginBottom: '12px' }}>Let&apos;s Connect!</h2>
              <p className={styles.infoDesc}>
                Have questions about admissions, fees, or our programs? Our team is here to help!
              </p>

              <div className={styles.infoCards}>
                {contactInfo.map((info, i) => (
                  <div key={i} className={styles.infoCard}>
                    <div className={styles.infoIcon}><info.icon size={24} /></div>
                    <div>
                      <div className={styles.infoCardTitle}>{info.title}</div>
                      {info.lines.map((line, j) => {
                        let href = '';
                        if (info.title === 'Phone') href = `tel:${line}`;
                        else if (info.title === 'Email') href = `mailto:${line}`;
                        else if (info.title === 'Address') href = 'https://www.google.com/maps?q=No.2+Anna+main+road,+Jayalakshmi+Nagar,+Nerkundram,+Chennai-107';
                        return href ? (
                          <a key={j} href={href} target="_blank" rel="noopener noreferrer" className={styles.infoLineLink}>{line}</a>
                        ) : (
                          <div key={j} className={styles.infoLine}>{line}</div>
                        );
                      })}
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
        <a
          href="https://www.google.com/maps?q=No.2+Anna+main+road,+Jayalakshmi+Nagar,+Nerkundram,+Chennai-107"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mapLink}
        >
          <div className={styles.mapStatic}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1!2d80.2707!3d13.0827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52664fc6e8b4f1%3A0xd6b9e81b3f7f1a2e!2sLITTLE%20STAR%20NURSERY%20%26%20PRIMARY%20SCHOOL!5e0!3m2!1sen!2sin!4v1750420000000!5m2!1sen!2sin"
              className={styles.mapIframe}
              loading="lazy"
              title="Little Star Location"
            />
            <div className={styles.mapOverlay}>
              <p className={styles.mapAddress}>
                No.2 Anna main road, Jayalakshmi Nagar<br />
                Nerkundram, Chennai-107
              </p>
            </div>
          </div>
        </a>
      </section>
    </>
  );
}

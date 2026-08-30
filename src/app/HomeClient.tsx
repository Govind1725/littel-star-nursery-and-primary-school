'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useGallery, useAnnouncements, useRealtimeSubscription } from '@/lib/queries';
import { TABLES } from '@/lib/supabase';
import styles from './page.module.css';
import { MapPin, Phone, Mail, Clock, Baby, Sprout, Backpack, BookOpen, BrainCircuit, MessageSquare, Users, Heart, Activity, Palette, Sparkles, User, BriefcaseBusiness, PartyPopper, Megaphone, Trophy, Star, Bell, Check, Camera, Theater, FileAudio, Microscope, Leaf, Handshake } from 'lucide-react';

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
    badge: 'Play School',
    icon: Baby,
    title: 'Play School & Preschool in Nerkundram',
    desc: 'Gentle introduction to group learning through sensory play, music, and movement in a safe, caring environment for toddlers.',
    color: 'linear-gradient(135deg,#7C3AED,#4C1D95)',
    href: '/play-school',
  },
  {
    img: '/images/program_preschool.png',
    age: '3.5 – 4.5 Years',
    badge: 'Nursery (LKG)',
    icon: Sprout,
    title: 'Nursery School in Nerkundram',
    desc: 'Building foundational language, numeracy, artistic expression, and social confidence through activity-based early education.',
    color: 'linear-gradient(135deg,#6D28D9,#7C3AED)',
    href: '/nursery-school',
  },
  {
    img: '/images/program_prek.png',
    age: '4.5 – 5.5 Years',
    badge: 'UKG',
    icon: Backpack,
    title: 'Kindergarten (UKG) in Nerkundram',
    desc: 'Preparing confident young learners for primary school with strong literacy, structured math, and critical thinking skills.',
    color: 'linear-gradient(135deg,#4C1D95,#6D28D9)',
    href: '/nursery-school',
  },
  {
    img: '/images/program_afterschool.png',
    age: '5 – 10 Years',
    badge: 'Primary & Tuition',
    icon: BookOpen,
    title: 'Primary School & Star Tuition Centre',
    desc: 'Classes I to V structured curriculum blending academic excellence, STEM projects, Karate, Silambam, and evening tuition.',
    color: 'linear-gradient(135deg,#2E1065,#4C1D95)',
    href: '/primary-school',
  },
];

const whyChooseUs = [
  { img: '/images/cognitive.png', title: 'Cognitive Development', desc: 'STEM-integrated activity-based learning sparks curiosity and builds critical problem-solving skills.' },
  { img: '/images/socio.png', title: 'Social & Emotional Growth', desc: 'Group learning, mindfulness, and collaborative play build empathy, resilience, and strong values.' },
  { img: '/images/language.png', title: 'Language & Literacy', desc: 'Multi-lingual exposure, phonics, and interactive storytelling nurture effective communication.' },
  { img: '/images/life.png', title: 'Life Skills & Hygiene', desc: 'Independence, personal responsibility, and healthy habits are woven into daily school routines.' },
  { img: '/images/karate_icon.png', title: 'Karate & Silambam', desc: 'Traditional physical martial arts build fitness, discipline, focus, and self-defense for children.' },
  { img: '/images/dance_icon.png', title: 'Arts & Creative Expression', desc: 'Music, dance, drawing, and stage performances cultivate holistic growth and confidence.' },
];

const lifeAtSchool = [
  { img: '/images/A Day at Little Star 1.png', label: 'Our Campus in Nerkundram', caption: 'Safe, vibrant, and child-friendly learning environment in Jaya Lakshmi Nagar, Nerkundram.' },
  { img: '/images/A Day at Little Star 3.png', label: 'Activity-Based Learning', caption: 'Hands-on lessons that make every academic concept clear, fun, and memorable.' },
  { img: '/images/A Day at Little Star 2.png', label: 'Play & Daycare Area', caption: 'Spacious indoor and outdoor play spaces designed for active play and childcare.' },
];

const stats = [
  { value: 500, suffix: '+', label: 'Happy Students Enrolled', icon: Users },
  { value: 25, suffix: '+', label: 'Experienced Educators', icon: User },
  { value: 25, suffix: '+', label: 'Years of Educational Excellence', icon: Trophy },
  { value: 98, suffix: '%', label: 'Parent Satisfaction', icon: Heart },
];

const testimonials = [
  {
    name: 'Manikandan',
    role: 'Parent from Nerkundram, Chennai',
    text: 'Little Star Nursery & Primary School has been a fantastic foundation for our child. The activity-based teaching method and caring teachers are truly exemplary!',
    emoji: User,
  },
  {
    name: 'Priya',
    role: 'Parent near Kodambakkam, Chennai',
    text: 'My daughter attends Star Kids Pre School & Day Care. The extended hours from 8:30 AM to 8 PM give complete peace of mind to working parents like us.',
    emoji: User,
  },
  {
    name: 'Surya Kannan',
    role: 'Parent from Koyambedu, Chennai',
    text: 'The evening tuition at Star Tuition Centre helped my son excel in primary school mathematics. Highly recommended for parents in Nerkundram and surrounding areas!',
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

export default function HomeClient() {
  const [mounted, setMounted] = useState(false);
  const [counted, setCounted] = useState<Set<number>>(new Set());
  const [, setCounts] = useState<number[]>([0, 0, 0, 0]);
  const statsRef = useRef<HTMLElement>(null);
  const [form, setForm] = useState({ name: '', dob: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [, setLoading] = useState(false);

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

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setSubmitted(true);

      const whatsappMessage = `*Little Star Nursery & Primary School*
----------------------------------
*Student Name:* ${form.name}
*Date of Birth:* ${form.dob}
*Parent Email:* ${form.email}
*Phone Number:* ${form.phone || 'N/A'}
*Program of Interest:* ${form.subject}
*Message / Notes:* ${form.message || 'N/A'}`;

      const whatsappUrl = `https://wa.me/919941294084?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');
    }
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
  }, [mounted, counted]);

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
          <div className={styles.heroTitleWrapper}>
            <div className={styles.heroBadge}>
              <span className={styles.badgeDot} />
              ADMISSIONS OPEN 2026-27
            </div>
            <div className={styles.heroWelcome}>Welcome to</div>
            <h1 className={styles.heroMainTitle}>LITTLE STAR</h1>
            <div className={styles.heroSubTitle}>Nursery &amp; Primary School</div>
            <div className={styles.heroBottomBadge}>
              <span className={styles.starIcon}>★</span> STAR KIDS Pre-School &amp; Day Care <span className={styles.starIcon}>★</span>
            </div>
            <div className={styles.heroDaycareHours}>
              Day care Available from 8:30 am to 8 pm.
            </div>
            <div className={styles.heroBottomBadge} style={{ marginTop: '24px' }}>
              <span className={styles.starIcon}>★</span> Star Tuition Centre <span className={styles.starIcon}>★</span>
            </div>
            <div className={styles.heroDaycareHours} style={{ marginTop: '12px' }}>
              Tuitions for all school children I STD to 12 STD, CBSE Maths (6 pm. to 8 pm)
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
              View All Notices →
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
                    Read Full Notice →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== ADMISSION OPEN ===== */}
      <section className={styles.admissionStrip}>
        <div className="container">
          <div className={styles.admissionStripInner}>
            <span className={styles.admissionStripDot} />
            <span>ADMISSIONS OPEN FOR PRE-KG, LKG, UKG &amp; PRIMARY CLASSES (I TO V STD)</span>
            <Link href="/admissions" className={styles.admissionStripBtn}>Apply for Admission →</Link>
          </div>
        </div>
      </section>

      {/* ===== WELCOME SECTION ===== */}
      <section className={`section-padding ${styles.welcomeSection}`}>
        <div className="container">
          <div className={styles.welcomeGrid}>
            <div className={styles.welcomeImgWrap}>
              <div className={styles.welcomeBadgeTop}>
                <Heart size={16} fill="#F97316" color="#F97316" /> Trusted by 500+ Families in Chennai
              </div>
              <Image 
                src="/images/A Day at Little Star.jpg" 
                alt="Little Star Nursery and Primary School in Nerkundram Chennai classroom activity" 
                width={600} 
                height={450} 
                className={styles.welcomeImg}
              />
              <div className={styles.welcomeBadgeBottom}>
                <Sparkles size={16} fill="#EAB308" color="#EAB308" /> Established in 2001
              </div>
            </div>
            
            <div>
              <span className="badge" style={{ background: '#FEF08A', color: '#5A2C99', borderColor: '#FEF08A', fontWeight: 800 }}>
                <Sparkles size={16} fill="#EAB308" color="#EAB308" style={{display: 'inline', marginRight: '6px'}} /> 
                WELCOME TO LITTLE STAR SCHOOL
              </span>
              <h2 className={styles.welcomeTitle}>Quality Nursery &amp; Primary Education in Nerkundram</h2>
              <p style={{ fontSize: '1.1rem', fontWeight: 700, color: '#7C3AED', letterSpacing: '0.5px', margin: '8px 0 16px' }}>
                Nurturing Academic Excellence &amp; Child Wellbeing in Chennai
              </p>

              <p className={styles.welcomeText}>
                At <strong>Little Star Nursery &amp; Primary School</strong>, located in Jaya Lakshmi Nagar, Nerkundram, Chennai, we believe early childhood education forms the bedrock of lifelong learning. Our safe, vibrant campus provides a nurturing environment where children discover their potential.
              </p>
              
              <p className={styles.welcomeText}>
                We combine structured academics with activity-based learning, creative arts, physical activities, and value-based education. Conveniently located near Kodambakkam, Koyambedu, Maduravoyal, Arumbakkam, Virugambakkam, Anna Nagar West, and Mogappair.
              </p>
              
              <div className={styles.welcomeFeatures}>
                <div className={styles.welcomeFeature}>
                  <div className={styles.welcomeFeatureIcon}><Check size={14} strokeWidth={3} /></div>
                  Experienced &amp; caring teachers
                </div>
                <div className={styles.welcomeFeature}>
                  <div className={styles.welcomeFeatureIcon}><Check size={14} strokeWidth={3} /></div>
                  Activity-based curriculum
                </div>
                <div className={styles.welcomeFeature}>
                  <div className={styles.welcomeFeatureIcon}><Check size={14} strokeWidth={3} /></div>
                  Safe &amp; secure campus with CCTV
                </div>
                <div className={styles.welcomeFeature}>
                  <div className={styles.welcomeFeatureIcon}><Check size={14} strokeWidth={3} /></div>
                  Karate, Silambam &amp; Creative Arts
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
                <Link href="/about" className="btn-primary">
                  Learn About Our History &rarr;
                </Link>
                <Link href="/nursery-school" className="btn-outline">
                  Explore Nursery Program &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SERVICES QUICK LINKS ===== */}
      <section className="section-padding" style={{ background: '#F5F3FF' }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto 40px' }}>
            <span className="badge">Our Educational Services</span>
            <h2 className="section-title">Nursery, Primary, Play School, Daycare &amp; Tuition Services</h2>
            <p className="section-subtitle">
              Comprehensive educational solutions for toddlers, nursery kids, primary students, and working parents in Nerkundram, Chennai.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            <Link href="/nursery-school" style={{ textDecoration: 'none' }}>
              <div className="card text-center" style={{ padding: '24px', borderRadius: '16px', background: '#FFF', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'transform 0.2s', height: '100%' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🌱</div>
                <h3 style={{ color: '#4C1D95', fontSize: '1.25rem', marginBottom: '8px' }}>Nursery School</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>LKG &amp; UKG foundational learning with activity-based phonics, numbers, and creative play in Nerkundram.</p>
                <span style={{ color: '#7C3AED', fontWeight: 600, fontSize: '0.9rem', marginTop: '12px', display: 'inline-block' }}>Learn More &rarr;</span>
              </div>
            </Link>

            <Link href="/primary-school" style={{ textDecoration: 'none' }}>
              <div className="card text-center" style={{ padding: '24px', borderRadius: '16px', background: '#FFF', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'transform 0.2s', height: '100%' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📚</div>
                <h3 style={{ color: '#4C1D95', fontSize: '1.25rem', marginBottom: '8px' }}>Primary School</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Classes I to V offering strong academics, STEM activities, Karate, Silambam, and character building.</p>
                <span style={{ color: '#7C3AED', fontWeight: 600, fontSize: '0.9rem', marginTop: '12px', display: 'inline-block' }}>Learn More &rarr;</span>
              </div>
            </Link>

            <Link href="/play-school" style={{ textDecoration: 'none' }}>
              <div className="card text-center" style={{ padding: '24px', borderRadius: '16px', background: '#FFF', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'transform 0.2s', height: '100%' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎨</div>
                <h3 style={{ color: '#4C1D95', fontSize: '1.25rem', marginBottom: '8px' }}>Play School / Preschool</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Star Kids Play School providing sensory stimulation, motor skills development, and social play for toddlers.</p>
                <span style={{ color: '#7C3AED', fontWeight: 600, fontSize: '0.9rem', marginTop: '12px', display: 'inline-block' }}>Learn More &rarr;</span>
              </div>
            </Link>

            <Link href="/daycare" style={{ textDecoration: 'none' }}>
              <div className="card text-center" style={{ padding: '24px', borderRadius: '16px', background: '#FFF', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'transform 0.2s', height: '100%' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🧸</div>
                <h3 style={{ color: '#4C1D95', fontSize: '1.25rem', marginBottom: '8px' }}>Day Care Centre</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Flexible child care from 8:30 AM to 8 PM with healthy meals, rest areas, and after-school supervision.</p>
                <span style={{ color: '#7C3AED', fontWeight: 600, fontSize: '0.9rem', marginTop: '12px', display: 'inline-block' }}>Learn More &rarr;</span>
              </div>
            </Link>

            <Link href="/tuition-centre" style={{ textDecoration: 'none' }}>
              <div className="card text-center" style={{ padding: '24px', borderRadius: '16px', background: '#FFF', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', transition: 'transform 0.2s', height: '100%' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>✍️</div>
                <h3 style={{ color: '#4C1D95', fontSize: '1.25rem', marginBottom: '8px' }}>Tuition Centre</h3>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Star Tuition Centre for STD I to XII &amp; CBSE Maths (6 PM to 8 PM) with personalized academic support.</p>
                <span style={{ color: '#7C3AED', fontWeight: 600, fontSize: '0.9rem', marginTop: '12px', display: 'inline-block' }}>Learn More &rarr;</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ===== GALLERY PREVIEW ===== */}
      <section className={`section-padding ${styles.gallery}`}>
        <div className="container">
          <div className="text-center">
            <span className="badge"><Camera size={16} style={{display: 'inline', marginRight: '4px'}} /> Campus Highlights</span>
            <h2 className="section-title">School Life &amp; Activities at Little Star</h2>
            <p className="section-subtitle">
              Capturing moments of learning, creativity, sports, and celebrations at our Nerkundram campus.
            </p>
          </div>
          <div className={styles.marqueeWrap}>
            <div className={styles.marqueeTrack}>
              {mounted && [...media, ...media].length > 0
                ? [...media, ...media].map((item, i) => (
                    <div key={`${item.id}-${i}`} className={styles.marqueeItem}>
                      {item.media_url ? (
                        item.media_type === 'image' ? (
                          <img src={item.media_url} alt={item.title || "Little Star Nursery and Primary School student activity in Nerkundram Chennai"} className={styles.marqueeImg} loading="lazy" />
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
              Explore Full Photo Gallery 📸
            </Link>
          </div>
        </div>
      </section>

      {/* ===== PROGRAMS ===== */}
      <section className={`section-padding ${styles.programsSection}`}>
        <div className="container">
          <div className="text-center">
            <span className="badge"><BookOpen size={16} style={{display: 'inline', marginRight: '4px'}} /> Learning Programs</span>
            <h2 className="section-title">Age-Appropriate Programs in Nerkundram</h2>
            <p className="section-subtitle">
              Structured developmental learning programs designed for toddlers, nursery children, and primary students.
            </p>
          </div>
          <div className={styles.stageJourney}>
            {programs.map((p, i) => (
              <div key={i} className={`${styles.stageRow} ${i % 2 === 0 ? '' : styles.stageRowRtl}`}>
                {i > 0 && <div className={styles.stageConnector} />}
                <Link href={p.href} className={styles.stageCard}>
                  <div className={styles.stageMedia}>
                    <div className={styles.stageImageWrap} style={{ background: p.color }}>
                      <Image src={p.img} alt={`Little Star School ${p.title} in Nerkundram`} fill style={{ objectFit: 'cover' }} sizes="(max-width: 768px) 100vw, 50vw" />
                    </div>
                    <div className={styles.stageAgeBubble}>{p.age}</div>
                  </div>
                  <div className={styles.stageContent}>
                    <span className={styles.stageEmoji}><p.icon size={24} style={{display: 'inline', marginRight: '8px'}} />{p.badge}</span>
                    <h3 className={styles.stageTitle}>{p.title}</h3>
                    <p className={styles.stageDesc}>{p.desc}</p>
                    <span className={styles.stageArrow}>
                      Learn More <span>→</span>
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
            <span className="badge"><Sparkles size={16} style={{display: 'inline', marginRight: '4px'}} /> Our Edge</span>
            <h2 className="section-title">Why Parents Choose Little Star in Nerkundram</h2>
            <p className="section-subtitle">
              Our holistic curriculum integrates cognitive skills, emotional maturity, physical discipline, and creative expression.
            </p>
          </div>
          <div className={styles.whyGrid}>
            {whyChooseUs.map((w, i) => (
              <div key={i} className={styles.whyCard} style={{ animationDelay: `${i * 0.08}s` }}>
                <div className={styles.whyImgWrap}>
                  <Image
                    src={w.img}
                    alt={`Little Star ${w.title} feature`}
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
            <span className="badge"><MapPin size={16} style={{display: 'inline', marginRight: '4px'}} /> Campus Environment</span>
            <h2 className="section-title">Life at Little Star Nerkundram</h2>
            <p className="section-subtitle">
              Every detail of our campus is designed to foster safety, curiosity, and joyful discovery.
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
                  alt="Little Star Nursery and Primary School Seven Petal Learning Curriculum"
                  fill
                  loading="eager"
                  style={{ objectFit: 'contain' }}
                  sizes="(max-width: 768px) 100vw, 45vw"
                />
              </div>
            </div>
            <div className={styles.curriculumText}>
              <span className="badge"><BookOpen size={16} style={{display: 'inline', marginRight: '4px'}} /> Holistic Learning</span>
              <h2 className="section-title">Seven Petal Learning Framework</h2>
              <p className={styles.curriculumPara}>
                Our balanced curriculum focuses on seven fundamental areas: Cognitive Ability, Language &amp; Literacy, Social Growth, Emotional Well-being, Physical Fitness, Creative Arts, and Life Skills.
              </p>
              <div className={styles.curriculumPillars}>
                {[
                  { label: 'Cognitive Ability', icon: BrainCircuit },
                  { label: 'Language & Literacy', icon: MessageSquare },
                  { label: 'Social Confidence', icon: Users },
                  { label: 'Emotional Well-being', icon: Heart },
                  { label: 'Physical Development', icon: Activity },
                  { label: 'Creative Arts', icon: Palette },
                  { label: 'Life Skills & Ethics', icon: Sparkles }
                ].map((p, i) => (
                  <div key={i} className={styles.pillarChip}>
                    <p.icon size={16} style={{marginRight: '6px', display: 'inline'}} /> {p.label}
                  </div>
                ))}
              </div>
              <Link href="/activities" className="btn-primary" id="curriculum-learn-btn" style={{ marginTop: '28px', display: 'inline-flex' }}>
                Explore Extracurricular Activities →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DAILY ROUTINE ===== */}
      <section className={`section-padding ${styles.routineSection}`}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '1200px' }}>
          <span className={styles.routineBadge}>SCHOOL TIMINGS &amp; SCHEDULE</span>
          <h2 className={styles.routineTitle}>A Typical Day at Little Star</h2>
          <p className={styles.routineSub}>Structured balance of prayer, interactive learning, snack breaks, and outdoor activities.</p>

          <div className={styles.routineTimeline}>
            <div className={styles.timelineLine}></div>
            <div className={styles.timelineCards}>
              {[
                { time: '8:45 AM', title: 'Student Arrival', icon: '/images/routine_entry.png', bg: '#FFDFDF' },
                { time: '9:00 AM', title: 'Morning Assembly & Prayer', icon: '/images/routine_prayer.png', bg: '#FFF1B8' },
                { time: '9:15 AM', title: 'Academic Sessions', icon: '/images/routine_classes.png', bg: '#BDECB6' },
                { time: '10:45 – 11:00 AM', title: 'Healthy Snack Break', icon: '/images/routine_break.png', bg: '#C2DBFF' },
                { time: '12:30 – 1:15 PM', title: 'Lunch & Relaxed Time', icon: '/images/routine_lunch.png', bg: '#FFD1D1' },
              ].map((item, i) => (
                <div key={i} className={styles.routineCard}>
                  <div className={styles.routineIconWrapper} style={{ backgroundColor: item.bg }}>
                    <Image src={item.icon} alt={`Little Star daily schedule ${item.title}`} width={64} height={64} className={styles.routineIconImg} />
                  </div>
                  <div className={styles.routineTime}>{item.time}</div>
                  <h3 className={styles.routineCardTitle}>{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== PARENT TESTIMONIALS ===== */}
      <section className={`section-padding ${styles.testimonials}`}>
        <div className="container">
          <div className="text-center">
            <span className="badge"><MessageSquare size={16} style={{display: 'inline', marginRight: '4px'}} /> Parent Reviews</span>
            <h2 className="section-title">What Parents Say About Little Star</h2>
            <p className="section-subtitle">
              Read real feedback from families living in Nerkundram, Kodambakkam, and Koyambedu, Chennai.
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

      {/* ===== HOME FAQ SECTION ===== */}
      <section className="section-padding" style={{ background: '#FAF5FF' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="text-center" style={{ marginBottom: '32px' }}>
            <span className="badge">Parent Queries</span>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Answers to common questions about admissions, school location, daycare hours, and tuition in Nerkundram.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ padding: '20px 24px', borderRadius: '12px', background: '#FFF' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#4C1D95', marginBottom: '8px' }}>What programs are offered at Little Star Nerkundram?</h3>
              <p style={{ color: '#555', lineHeight: 1.6 }}>We offer Play School / Preschool for toddlers (2.5+ yrs), Nursery (LKG &amp; UKG), Primary Education (Classes I to V), Day Care (8:30 AM to 8:00 PM), and Star Tuition Centre for school students (STD I to XII &amp; CBSE Maths).</p>
            </div>

            <div className="card" style={{ padding: '20px 24px', borderRadius: '12px', background: '#FFF' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#4C1D95', marginBottom: '8px' }}>Where is Little Star Nursery &amp; Primary School located?</h3>
              <p style={{ color: '#555', lineHeight: 1.6 }}>We are located at 2, Anna Street, near Moogambigai Amman Temple, Jaya Lakshmi Nagar, Kothandaraman Nagar, Nerkundram, Chennai - 600107. Conveniently accessible from Kodambakkam, Koyambedu, Maduravoyal, Arumbakkam, Virugambakkam, Anna Nagar West, and Mogappair.</p>
            </div>

            <div className="card" style={{ padding: '20px 24px', borderRadius: '12px', background: '#FFF' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#4C1D95', marginBottom: '8px' }}>What are the daycare timings at Star Kids Pre School &amp; Day Care?</h3>
              <p style={{ color: '#555', lineHeight: 1.6 }}>Our daycare operates from 8:30 AM to 8:00 PM, Monday through Saturday, providing full-day and after-school care with dedicated supervision, rest zones, and engaging activities for children.</p>
            </div>

            <div className="card" style={{ padding: '20px 24px', borderRadius: '12px', background: '#FFF' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#4C1D95', marginBottom: '8px' }}>How can parents apply for 2026–27 admissions?</h3>
              <p style={{ color: '#555', lineHeight: 1.6 }}>Parents can submit an inquiry through our website, visit our Nerkundram campus directly, or call our admissions coordinator at +91 99412 94084.</p>
            </div>
          </div>

          <div className="text-center" style={{ marginTop: '24px' }}>
            <Link href="/faq" style={{ color: '#7C3AED', fontWeight: 700, textDecoration: 'none' }}>
              View All Frequently Asked Questions &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className={styles.cta}>
        <div className="container">
          <div className={styles.ctaBox}>
            <div className={styles.ctaDecos}>
              <span className={styles.ctaDeco1}>🌟</span>
              <span className={styles.ctaDeco2}>⭐</span>
              <span className={styles.ctaDeco3}>✨</span>
            </div>
            <h2 className={styles.ctaTitle}>Admissions Open for 2026–27</h2>
            <p className={styles.ctaDesc}>
              Visit Little Star Nursery &amp; Primary School in Nerkundram or contact us to schedule a campus tour today!
            </p>
            <div className={styles.ctaBtns}>
              <Link href="/admissions" className="btn-primary" id="cta-enroll-btn">
                <Backpack size={18} style={{display: 'inline', marginRight: '6px', marginBottom: '-4px'}} /> Apply for Admission
              </Link>
              <a href="tel:+919941294084" className="btn-outline" id="cta-call-btn" style={{ borderColor: 'rgba(255,255,255,0.8)', color: '#fff' }}>
                <Phone size={18} style={{display: 'inline', marginRight: '6px', marginBottom: '-4px'}} /> Call +91 99412 94084
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CONTACT & ENQUIRY SECTION ===== */}
      <section className={`section-padding ${styles.contactSection}`}>
        <div className="container">
          <div className={styles.contactGrid}>
            <div className={styles.infoCol}>
              <span className="badge"><Phone size={16} style={{display: 'inline', marginRight: '4px'}} /> Campus Location</span>
              <h2 className="section-title" style={{ marginBottom: '12px' }}>Visit Little Star in Nerkundram</h2>
              <p className={styles.infoDesc}>
                We welcome parents to tour our facility, interact with our principal and teachers, and explore our learning programs.
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
                <h3 className={styles.quickTitle}>📍 Serving Surrounding Chennai Areas</h3>
                <p style={{ color: '#FFFFFF' }}>Nerkundram, Kodambakkam, Koyambedu, Maduravoyal, Arumbakkam, Virugambakkam, Anna Nagar West, and Mogappair.</p>
              </div>
            </div>

            <div className={styles.formCol}>
              {submitted ? (
                <div className={styles.successBox}>
                  <div className={styles.successIcon}>🎉</div>
                  <h3>Admission Enquiry Received!</h3>
                  <p>Thank you for inquiring about Little Star School. Our admissions team will contact you shortly.</p>
                  <button
                    className="btn-primary"
                    onClick={() => { setSubmitted(false); setForm({ name: '', dob: '', email: '', phone: '', subject: '', message: '' }); }}
                    id="home-contact-send-another-btn"
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                  <h3 className={styles.formTitle}>Admission Inquiry Form ✉️</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="home-name">Child&apos;s Full Name *</label>
                      <input
                        id="home-name" name="name" type="text"
                        placeholder="Enter child's name"
                        value={form.name} onChange={handleChange}
                        required className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="home-dob">Child&apos;s Date of Birth *</label>
                      <input
                        id="home-dob" name="dob" type="date"
                        value={form.dob} onChange={handleChange}
                        required className={styles.input}
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="home-email">Parent&apos;s Email *</label>
                      <input
                        id="home-email" name="email" type="email"
                        placeholder="parent@example.com"
                        value={form.email} onChange={handleChange}
                        required className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="home-phone">Phone Number *</label>
                      <input
                        id="home-phone" name="phone" type="tel"
                        placeholder="+91 99412 94084"
                        value={form.phone} onChange={handleChange}
                        required className={styles.input}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="home-subject">Program of Interest *</label>
                    <select
                      id="home-subject" name="subject"
                      value={form.subject} onChange={handleChange}
                      required className={styles.input}
                    >
                      <option value="">Select a program</option>
                      <option value="play-school">Play School / Preschool</option>
                      <option value="nursery">Nursery School (LKG / UKG)</option>
                      <option value="primary">Primary School (I - V STD)</option>
                      <option value="daycare">Day Care Service</option>
                      <option value="tuition">Star Tuition Centre</option>
                      <option value="general">General Enquiry</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="home-message">Additional Notes / Address</label>
                    <textarea
                      id="home-message" name="message" rows={3}
                      placeholder="Tell us about your child or preferred start date"
                      value={form.message} onChange={handleChange}
                      className={styles.input}
                    />
                  </div>
                  <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '12px' }}>
                    Submit Admission Enquiry
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

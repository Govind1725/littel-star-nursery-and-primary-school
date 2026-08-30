import type { Metadata } from 'next';
import styles from './about.module.css';
import Link from 'next/link';
import TimelineSection from '@/components/TimelineSection';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd, { SCHOOL_NAP } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'About Little Star Nursery & Primary School | Nerkundram, Chennai',
  description:
    'Learn about Little Star Nursery & Primary School in Nerkundram, Chennai. Nurturing young minds since 2001 with quality education, dedicated principal & teachers serving Nerkundram, Kodambakkam & Koyambedu.',
  alternates: {
    canonical: 'https://www.littlestarnpschool.com/about',
  },
  openGraph: {
    title: 'About Little Star Nursery & Primary School | Nerkundram, Chennai',
    description:
      'Discover Little Star School history, mission, vision, core values, and dedicated leadership in Nerkundram, Chennai.',
    url: 'https://www.littlestarnpschool.com/about',
  },
};

const team = [
  { name: 'Dr. G. Muthukumar M.C.A, Ph.D, B.Ed', role: 'Founder and Correspondent', exp: 'Academic Visionary' },
  { name: 'Mrs. Bavani Muthukumar M.Sc', role: 'Principal', exp: 'Early Education Specialist' },
  { name: 'Mrs. Sugans Rekha B.Lit', role: 'Head Mistress', exp: 'Curriculum & School Operations' },
  { name: 'Mrs. J. Murugeshwari', role: 'KG Coordinator', exp: 'Pre-KG & Nursery Academic Lead' },
  { name: 'Ms. Dhanya', role: 'Primary Coordinator', exp: 'Primary Classes Academic Lead' },
];

const values = [
  { title: 'Love & Care', desc: 'Every child is treated with individual attention, patience, and warmth.' },
  { title: 'Excellence', desc: 'We maintain high standards in foundational academics and character building.' },
  { title: 'Inclusivity', desc: 'We welcome and celebrate children from all backgrounds with equal dedication.' },
  { title: 'Activity-Based Innovation', desc: 'Modern teaching methods and hands-on activities bring learning to life.' },
  { title: 'Community Trust', desc: 'Strong partnerships with parents build a supportive school family in Nerkundram.' },
  { title: 'Holistic Growth', desc: 'Continuous physical, mental, and creative development for every child.' },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={SCHOOL_NAP} />
      
      <Breadcrumbs items={[{ name: 'About Us', url: '/about' }]} />

      {/* Hero */}
      <section className="page-hero" style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)', color: '#FFF', padding: '60px 0 70px', textAlign: 'center' }}>
        <div className="container">
          <span className="badge" style={{ background: '#FEF08A', color: '#4C1D95', fontWeight: 800 }}>Established 2001</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', margin: '16px 0', color: '#FFF' }}>
            About Little Star Nursery &amp; Primary School
          </h1>
          <p style={{ maxWidth: '750px', margin: '0 auto', fontSize: '1.15rem', opacity: 0.95 }}>
            A 25+ year legacy of nurturing young minds with love, creativity, discipline, and academic foundations in Nerkundram, Chennai.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={`section-padding ${styles.missionSection}`}>
        <div className="container">
          <div className={styles.missionGrid}>
            <div className={`card ${styles.missionCard}`}>
              <div className={styles.missionIcon}>🎯</div>
              <h2>Our Educational Mission</h2>
              <p>
                To provide a safe, stimulating, and joyful learning environment in Nerkundram where every child is empowered to reach their full potential through activity-based learning, creative expression, character building, and solid academic foundations.
              </p>
            </div>
            <div className={`card ${styles.missionCard} ${styles.visionCard}`}>
              <div className={styles.missionIcon}>🌟</div>
              <h2>Our Vision for Every Child</h2>
              <p>
                To be a benchmark institution in early childhood and primary education — shaping confident, curious, resilient, and compassionate young citizens ready to excel in higher education and life.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={`section-padding ${styles.valuesSection}`}>
        <div className="container">
          <div className="text-center">
            <span className="badge">Our Core Values</span>
            <h2 className="section-title">What We Stand For</h2>
            <p className="section-subtitle">
              Our core values guide every interaction, teaching method, and school initiative at Little Star.
            </p>
          </div>
          <div className={styles.valuesGrid}>
            {values.map((v, i) => (
              <div key={i} className={styles.valueCard}>
                <h3 className={styles.valueTitle}>{v.title}</h3>
                <p className={styles.valueDesc}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <TimelineSection />

      {/* Team */}
      <section className={`section-padding ${styles.teamSection}`}>
        <div className="container">
          <div className="text-center">
            <span className="badge">Leadership &amp; Faculty</span>
            <h2 className="section-title">Meet Our Dedicated Educators</h2>
            <p className="section-subtitle">
              Qualified, compassionate professionals committed to guiding children with care and expertise.
            </p>
          </div>
          <div className={styles.teamGrid}>
            {team.map((member, i) => (
              <div key={i} className={styles.teamCard}>
                <h3 className={styles.teamName}>{member.name}</h3>
                <div className={styles.teamRole}>{member.role}</div>
                <div className={styles.teamExp}>{member.exp}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Serving Local Community */}
      <section className="section-padding" style={{ background: '#FAF5FF' }}>
        <div className="container text-center">
          <span className="badge">Local Nerkundram Landmark</span>
          <h2>A Nurturing Environment Near You</h2>
          <p style={{ maxWidth: '750px', margin: '16px auto 24px', lineHeight: 1.6 }}>
            Located in Jaya Lakshmi Nagar, Kothandaraman Nagar, Nerkundram, Chennai, Little Star Nursery &amp; Primary School serves families residing in Nerkundram, Kodambakkam, Koyambedu, Maduravoyal, Arumbakkam, Virugambakkam, Anna Nagar West, and Mogappair.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className={`section-padding ${styles.ctaSection}`}>
        <div className="container text-center">
          <h2 className="section-title">Become Part of the Little Star Family</h2>
          <p className="section-subtitle">Admissions are currently open for 2026–27. Give your child the best foundation!</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/admissions" className="btn-primary" id="about-enroll-btn">Apply for Admission</Link>
            <Link href="/gallery" className="btn-secondary" id="about-gallery-btn">Explore Photo Gallery</Link>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className={styles.mapSection}>
        <a
          href="https://www.google.com/maps?q=No.2+Anna+main+road,+Jayalakshmi+Nagar,+Nerkundram,+Chennai-107"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mapLink}
        >
          <div className={styles.mapStatic}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.6667!2d80.1915!3d13.0684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52664fc6e8b4f1%3A0xd6b9e81b3f7f1a2e!2sLITTLE%20STAR%20NURSERY%20%26%20PRIMARY%20SCHOOL!5e0!3m2!1sen!2sin!4v1750420000000!5m2!1sen!2sin"
              className={styles.mapIframe}
              loading="lazy"
              title="Little Star School Location Map Nerkundram Chennai"
            />
            <div className={styles.mapOverlay}>
              <p className={styles.mapAddress}>
                No.2 Anna main road, Jayalakshmi Nagar<br />
                Nerkundram, Chennai-600107
              </p>
            </div>
          </div>
        </a>
      </section>
    </>
  );
}

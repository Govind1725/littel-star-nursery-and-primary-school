import type { Metadata } from 'next';
import styles from './about.module.css';
import Link from 'next/link';
import TimelineSection from '@/components/TimelineSection';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Little Star Nursery & Primary School – our mission, values, and dedicated team.',
};

const team = [
  { name: 'Mrs. Lakshmi Devi', role: 'Principal', exp: '20 years experience' },
  { name: 'Mr. Ramesh Kumar', role: 'Vice Principal', exp: '15 years experience' },
  { name: 'Mrs. Priya Nair', role: 'Head of Nursery', exp: '12 years experience' },
  { name: 'Mrs. Deepa Raj', role: 'Primary Coordinator', exp: '10 years experience' },
];

const values = [
  { title: 'Love & Care', desc: 'Every child is treated with warmth, compassion, and individual attention.' },
  { title: 'Excellence', desc: 'We pursue the highest standards in teaching and holistic development.' },
  { title: 'Inclusivity', desc: 'We celebrate diversity and ensure every child feels valued and included.' },
  { title: 'Innovation', desc: 'Modern methods and creative approaches bring learning to life.' },
  { title: 'Community', desc: 'Strong partnerships with families build a supportive school community.' },
  { title: 'Growth', desc: 'Continuous improvement for students, staff, and the school as a whole.' },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <span className="badge">Our Story</span>
          <h1>About Little Star</h1>
          <p>A legacy of nurturing young minds with love, creativity, and excellence since 2001.</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={`section-padding ${styles.missionSection}`}>
        <div className="container">
          <div className={styles.missionGrid}>
            <div className={`card ${styles.missionCard}`}>
              <div className={styles.missionIcon}></div>
              <h2>Our Mission</h2>
              <p>
                To provide a safe, stimulating, and joyful learning environment where every child is
                empowered to reach their full potential through play-based learning, creative exploration,
                and strong academic foundations.
              </p>
            </div>
            <div className={`card ${styles.missionCard} ${styles.visionCard}`}>
              <div className={styles.missionIcon}></div>
              <h2>Our Vision</h2>
              <p>
                To be the leading institution in early childhood education — shaping confident, curious,
                and compassionate individuals who are ready to make a positive difference in the world.
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
              Our values guide every decision, every interaction, and every learning experience at Little Star.
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
            <span className="badge">Our Team</span>
            <h2 className="section-title">Meet Our Educators</h2>
            <p className="section-subtitle">
              Passionate, qualified, and dedicated professionals who make learning magical every day.
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

      {/* CTA */}
      <section className={`section-padding ${styles.ctaSection}`}>
        <div className="container text-center">
          <h2 className="section-title">Join the Little Star Family</h2>
          <p className="section-subtitle">Admissions are open for 2024–25. Give your child the best start!</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/contact" className="btn-primary" id="about-enroll-btn">Enroll Now</Link>
            <Link href="/gallery" className="btn-secondary" id="about-gallery-btn">View Gallery</Link>
          </div>
        </div>
      </section>
    </>
  );
}

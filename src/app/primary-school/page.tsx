import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd, { SCHOOL_NAP } from '@/components/JsonLd';
import styles from './primary.module.css';

export const metadata: Metadata = {
  title: 'Best Primary School in Nerkundram, Chennai | Little Star',
  description:
    'Searching for the best primary school in Nerkundram, Chennai? Little Star Primary School provides Classes I to V education with STEM learning, Karate, Silambam & creative arts near Kodambakkam, Koyambedu & Maduravoyal.',
  alternates: {
    canonical: 'https://www.littlestarnpschool.com/primary-school',
  },
  openGraph: {
    title: 'Best Primary School in Nerkundram, Chennai | Little Star',
    description:
      'Quality primary education (Classes I to V) in Nerkundram, Chennai. Balanced academic syllabus, STEM projects, sports, Karate, Silambam & character development.',
    url: 'https://www.littlestarnpschool.com/primary-school',
  },
};

const primaryFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What classes are included in Little Star Primary School?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Little Star Primary School offers classes from Class I to Class V (Standard 1 to Standard 5) with comprehensive academic and extracurricular development.',
      },
    },
    {
      '@type': 'Question',
      name: 'What extracurricular activities are offered for primary students?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We provide traditional martial arts including Karate and Silambam, dance, music, fine arts, computer literacy, and STEM project learning.',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is the school located for primary students?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our campus is located at 2, Anna Street, Jaya Lakshmi Nagar, Nerkundram, Chennai - 600107, easily accessible from Kodambakkam, Koyambedu, Maduravoyal, Arumbakkam, Virugambakkam, Anna Nagar West, and Mogappair.',
      },
    },
  ],
};

export default function PrimarySchoolPage() {
  return (
    <>
      <JsonLd data={SCHOOL_NAP} />
      <JsonLd data={primaryFaqSchema} />
      
      <Breadcrumbs items={[{ name: 'Primary School', url: '/primary-school' }]} />

      <section className="page-hero" style={{ background: 'linear-gradient(135deg, #2E1065 0%, #6D28D9 100%)', color: '#FFF', padding: '60px 0 80px', textAlign: 'center' }}>
        <div className="container">
          <span className="badge" style={{ background: '#FEF08A', color: '#4C1D95', fontWeight: 800 }}>Primary Education (Classes I to V)</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', margin: '16px 0', color: '#FFF' }}>
            Best Primary School in Nerkundram, Chennai
          </h1>
          <p style={{ maxWidth: '750px', margin: '0 auto', fontSize: '1.15rem', opacity: 0.95 }}>
            Empowering students in Class I through V with rigorous academic foundations, STEM curiosity, digital literacy, Karate, Silambam, and moral values.
          </p>
        </div>
      </section>

      <section className={`section-padding ${styles.overview}`}>
        <div className="container">
          <div className={styles.gridTwo}>
            <div>
              <span className="badge">Academic Excellence</span>
              <h2>Holistic Primary Education at Little Star School</h2>
              <p>
                At <strong>Little Star Primary School in Nerkundram</strong>, we foster a learning environment where students excel academically, develop critical thinking, and build physical resilience. Our primary curriculum aligns with educational standards while emphasizing experiential learning.
              </p>
              <p>
                From mathematics and science to languages and social studies, our primary teachers guide children through conceptual understanding rather than rote memorization.
              </p>
              <div className={styles.highlights}>
                <div className={styles.checkItem}>✓ Structured core curriculum: English, Tamil/Hindi, Mathematics &amp; Science</div>
                <div className={styles.checkItem}>✓ STEM-integrated projects &amp; interactive science experiments</div>
                <div className={styles.checkItem}>✓ Physical education, Karate &amp; traditional Silambam training</div>
                <div className={styles.checkItem}>✓ Digital literacy &amp; computer laboratory exposure</div>
                <div className={styles.checkItem}>✓ Regular progress reports &amp; parent-teacher consultations</div>
              </div>
            </div>
            <div className={styles.imgCol}>
              <Image
                src="/images/program_afterschool.png"
                alt="Little Star Primary School students learning in classroom Nerkundram Chennai"
                width={550}
                height={400}
                className={styles.roundedImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum Pillars */}
      <section className="section-padding" style={{ background: '#FAF5FF' }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto 40px' }}>
            <span className="badge">Primary Curriculum</span>
            <h2>Core Subject Areas &amp; Special Training</h2>
            <p>Comprehensive subject mastery combined with co-curricular growth for Classes 1 to 5.</p>
          </div>

          <div className={styles.gridThree}>
            <div className="card" style={{ padding: '24px', background: '#FFF', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📐</div>
              <h3 style={{ color: '#4C1D95' }}>Mathematics &amp; Problem Solving</h3>
              <p>Conceptual arithmetic, geometry, logical reasoning, and mental math practice for daily real-world application.</p>
            </div>

            <div className="card" style={{ padding: '24px', background: '#FFF', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔬</div>
              <h3 style={{ color: '#4C1D95' }}>General Science &amp; STEM</h3>
              <p>Hands-on experiments, environmental science, biology basics, and observational science activities.</p>
            </div>

            <div className="card" style={{ padding: '24px', background: '#FFF', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🥋</div>
              <h3 style={{ color: '#4C1D95' }}>Karate &amp; Silambam Physical Arts</h3>
              <p>Disciplined martial arts training building physical fitness, focus, self-defense, and balance for young students.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Location reach */}
      <section className="section-padding">
        <div className="container text-center">
          <span className="badge">Local Primary School</span>
          <h2>Serving Families Across Chennai Neighborhoods</h2>
          <p style={{ maxWidth: '700px', margin: '12px auto 24px' }}>
            Convenient primary school education for residents of Nerkundram, Kodambakkam, Koyambedu, Maduravoyal, Arumbakkam, Virugambakkam, Anna Nagar West, and Mogappair.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            {['Nerkundram', 'Kodambakkam', 'Koyambedu', 'Maduravoyal', 'Arumbakkam', 'Virugambakkam', 'Anna Nagar West', 'Mogappair'].map((area, i) => (
              <span key={i} style={{ background: '#EDE9FE', color: '#4C1D95', fontWeight: 600, padding: '10px 20px', borderRadius: '30px' }}>
                📍 Primary School in {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding" style={{ background: '#FAF5FF' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="text-center" style={{ marginBottom: '32px' }}>
            <span className="badge">Primary FAQs</span>
            <h2>Frequently Asked Questions About Primary School</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ padding: '20px 24px', borderRadius: '12px', background: '#FFF' }}>
              <h3 style={{ color: '#4C1D95', fontSize: '1.1rem', marginBottom: '8px' }}>What classes are included in Little Star Primary School?</h3>
              <p style={{ color: '#555' }}>Little Star Primary School offers classes from Class I to Class V (Standard 1 to Standard 5) with comprehensive academic and extracurricular development.</p>
            </div>
            <div className="card" style={{ padding: '20px 24px', borderRadius: '12px', background: '#FFF' }}>
              <h3 style={{ color: '#4C1D95', fontSize: '1.1rem', marginBottom: '8px' }}>What extracurricular activities are offered for primary students?</h3>
              <p style={{ color: '#555' }}>We provide traditional martial arts including Karate and Silambam, dance, music, fine arts, computer literacy, and STEM project learning.</p>
            </div>
            <div className="card" style={{ padding: '20px 24px', borderRadius: '12px', background: '#FFF' }}>
              <h3 style={{ color: '#4C1D95', fontSize: '1.1rem', marginBottom: '8px' }}>Where is the school located for primary students?</h3>
              <p style={{ color: '#555' }}>Our campus is located at 2, Anna Street, Jaya Lakshmi Nagar, Nerkundram, Chennai - 600107, easily accessible from Kodambakkam, Koyambedu, Maduravoyal, Arumbakkam, Virugambakkam, Anna Nagar West, and Mogappair.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding text-center" style={{ background: '#4C1D95', color: '#FFF' }}>
        <div className="container">
          <h2 style={{ color: '#FFF', fontSize: '2rem' }}>Enroll Your Child in Primary School</h2>
          <p style={{ margin: '16px auto 30px', maxWidth: '600px' }}>Admissions open for 2026–27 academic sessions. Schedule a campus tour today.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/admissions" className="btn-primary">Apply for Primary Admission</Link>
            <Link href="/contact" className="btn-outline" style={{ borderColor: '#FFF', color: '#FFF' }}>Contact School Office</Link>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd, { SCHOOL_NAP } from '@/components/JsonLd';
import styles from './tuition.module.css';

export const metadata: Metadata = {
  title: 'Best Tuition Centre in Nerkundram, Chennai | Little Star',
  description:
    'Looking for the best tuition centre in Nerkundram, Chennai? Star Tuition Centre provides evening tuition for STD I to XII & specialized CBSE Maths (6 PM - 8 PM) near Kodambakkam & Koyambedu.',
  alternates: {
    canonical: 'https://www.littlestarnpschool.com/tuition-centre',
  },
  openGraph: {
    title: 'Best Tuition Centre in Nerkundram, Chennai | Little Star',
    description:
      'Expert evening academic tuition for school students in Nerkundram, Chennai. STD I to XII, CBSE Maths coaching, individual attention & exam preparation.',
    url: 'https://www.littlestarnpschool.com/tuition-centre',
  },
};

const tuitionFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What classes and subjects are covered at Star Tuition Centre Nerkundram?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Star Tuition Centre provides academic coaching for students from Standard I to XII across State Board and CBSE, with special coaching for CBSE Mathematics.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the evening tuition batch timings?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Tuition classes run every evening from 6:00 PM to 8:00 PM, allowing students to revise lessons, clarify doubts, and complete homework comfortably.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are tuition classes open to students from other schools in Chennai?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Star Tuition Centre welcomes all school students residing in Nerkundram, Kodambakkam, Koyambedu, Maduravoyal, Arumbakkam, Virugambakkam, Anna Nagar West, and Mogappair.',
      },
    },
  ],
};

export default function TuitionCentrePage() {
  return (
    <>
      <JsonLd data={SCHOOL_NAP} />
      <JsonLd data={tuitionFaqSchema} />
      
      <Breadcrumbs items={[{ name: 'Tuition Centre', url: '/tuition-centre' }]} />

      <section className="page-hero" style={{ background: 'linear-gradient(135deg, #2E1065 0%, #4C1D95 100%)', color: '#FFF', padding: '60px 0 80px', textAlign: 'center' }}>
        <div className="container">
          <span className="badge" style={{ background: '#FEF08A', color: '#4C1D95', fontWeight: 800 }}>Star Tuition Centre (6:00 PM – 8:00 PM)</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', margin: '16px 0', color: '#FFF' }}>
            Best Tuition Centre in Nerkundram, Chennai
          </h1>
          <p style={{ maxWidth: '750px', margin: '0 auto', fontSize: '1.15rem', opacity: 0.95 }}>
            Personalized academic support and coaching for school students (STD I to XII &amp; CBSE Maths) by experienced tutors dedicated to concept mastery and high exam scores.
          </p>
        </div>
      </section>

      <section className={`section-padding ${styles.overview}`}>
        <div className="container">
          <div className={styles.gridTwo}>
            <div>
              <span className="badge">Academic Coaching</span>
              <h2>Star Tuition Centre in Nerkundram</h2>
              <p>
                Every student learns at their own pace. At <strong>Star Tuition Centre</strong>, located within the Little Star School campus in Nerkundram, Chennai, we provide focused academic guidance to strengthen subject fundamentals, resolve doubts, and build exam confidence.
              </p>
              <p>
                Our evening tuition sessions (6:00 PM to 8:00 PM) are structured around small batches, ensuring every student receives personalized attention in Science, Mathematics, English, and core subjects.
              </p>
              <div className={styles.highlights}>
                <div className={styles.checkItem}>✓ Evening batches: 6:00 PM to 8:00 PM</div>
                <div className={styles.checkItem}>✓ Comprehensive coaching for STD I to XII</div>
                <div className={styles.checkItem}>✓ Specialized CBSE &amp; State Board Mathematics</div>
                <div className={styles.checkItem}>✓ Small student batch sizes for individual guidance</div>
                <div className={styles.checkItem}>✓ Daily homework assistance &amp; chapter-wise mock tests</div>
              </div>
            </div>
            <div className={styles.imgCol}>
              <Image
                src="/images/program_afterschool.png"
                alt="Star Tuition Centre evening class in Nerkundram Chennai"
                width={550}
                height={400}
                className={styles.roundedImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Special Features */}
      <section className="section-padding" style={{ background: '#FAF5FF' }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto 40px' }}>
            <span className="badge">Coaching Highlights</span>
            <h2>Why Students Excel at Star Tuition Centre</h2>
            <p>Proven teaching methods designed to turn complex concepts into easy, enjoyable learning.</p>
          </div>

          <div className={styles.gridThree}>
            <div className="card" style={{ padding: '24px', background: '#FFF', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔢</div>
              <h3 style={{ color: '#4C1D95' }}>CBSE &amp; State Board Maths Specialization</h3>
              <p>Step-by-step problem solving, formula derivation, and speed math techniques for elementary to high school math.</p>
            </div>

            <div className="card" style={{ padding: '24px', background: '#FFF', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>📝</div>
              <h3 style={{ color: '#4C1D95' }}>Regular Mock Tests &amp; Revision</h3>
              <p>Weekly tests, past exam paper practice, and error analysis to ensure readiness for school assessments.</p>
            </div>

            <div className="card" style={{ padding: '24px', background: '#FFF', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎯</div>
              <h3 style={{ color: '#4C1D95' }}>Doubt Clarification &amp; Homework Support</h3>
              <p>Dedicated time after lessons to solve school homework, projects, and clarify individual learning doubts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Serving Local Areas */}
      <section className="section-padding">
        <div className="container text-center">
          <span className="badge">Local Coaching</span>
          <h2>Convenient Tuition Centre for Surrounding Areas</h2>
          <p style={{ maxWidth: '700px', margin: '12px auto 24px' }}>
            Welcoming students from Nerkundram, Kodambakkam, Koyambedu, Maduravoyal, Arumbakkam, Virugambakkam, Anna Nagar West, and Mogappair.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            {['Nerkundram', 'Kodambakkam', 'Koyambedu', 'Maduravoyal', 'Arumbakkam', 'Virugambakkam', 'Anna Nagar West', 'Mogappair'].map((area, i) => (
              <span key={i} style={{ background: '#EDE9FE', color: '#4C1D95', fontWeight: 600, padding: '10px 20px', borderRadius: '30px' }}>
                📍 Tuition Centre in {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding" style={{ background: '#FAF5FF' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="text-center" style={{ marginBottom: '32px' }}>
            <span className="badge">Tuition FAQs</span>
            <h2>Frequently Asked Questions About Tuition Batches</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ padding: '20px 24px', borderRadius: '12px', background: '#FFF' }}>
              <h3 style={{ color: '#4C1D95', fontSize: '1.1rem', marginBottom: '8px' }}>What classes and subjects are covered at Star Tuition Centre Nerkundram?</h3>
              <p style={{ color: '#555' }}>Star Tuition Centre provides academic coaching for students from Standard I to XII across State Board and CBSE, with special coaching for CBSE Mathematics.</p>
            </div>
            <div className="card" style={{ padding: '20px 24px', borderRadius: '12px', background: '#FFF' }}>
              <h3 style={{ color: '#4C1D95', fontSize: '1.1rem', marginBottom: '8px' }}>What are the evening tuition batch timings?</h3>
              <p style={{ color: '#555' }}>Tuition classes run every evening from 6:00 PM to 8:00 PM, allowing students to revise lessons, clarify doubts, and complete homework comfortably.</p>
            </div>
            <div className="card" style={{ padding: '20px 24px', borderRadius: '12px', background: '#FFF' }}>
              <h3 style={{ color: '#4C1D95', fontSize: '1.1rem', marginBottom: '8px' }}>Are tuition classes open to students from other schools in Chennai?</h3>
              <p style={{ color: '#555' }}>Yes! Star Tuition Centre welcomes all school students residing in Nerkundram, Kodambakkam, Koyambedu, Maduravoyal, Arumbakkam, Virugambakkam, Anna Nagar West, and Mogappair.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding text-center" style={{ background: '#4C1D95', color: '#FFF' }}>
        <div className="container">
          <h2 style={{ color: '#FFF', fontSize: '2rem' }}>Join Star Tuition Centre in Nerkundram Today</h2>
          <p style={{ margin: '16px auto 30px', maxWidth: '600px' }}>Inquire about batch availability and fee structures for STD I to XII.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:+919941294084" className="btn-primary">Call Tuition Coordinator: +91 99412 94084</a>
            <Link href="/contact" className="btn-outline" style={{ borderColor: '#FFF', color: '#FFF' }}>Enquire Online</Link>
          </div>
        </div>
      </section>
    </>
  );
}

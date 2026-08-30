import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd, { SCHOOL_NAP } from '@/components/JsonLd';
import styles from './daycare.module.css';

export const metadata: Metadata = {
  title: 'Best Daycare in Nerkundram, Chennai | Little Star',
  description:
    'Looking for the best daycare in Nerkundram, Chennai? Star Kids Day Care offers flexible child care from 8:30 AM to 8:00 PM with CCTV monitoring, clean rest zones & nutritious meals near Kodambakkam & Koyambedu.',
  alternates: {
    canonical: 'https://www.littlestarnpschool.com/daycare',
  },
  openGraph: {
    title: 'Best Daycare in Nerkundram, Chennai | Little Star',
    description:
      'Safe, reliable daycare and child care in Nerkundram, Chennai. Open 8:30 AM to 8 PM, after-school care, caring attendants & hygienic facilities.',
    url: 'https://www.littlestarnpschool.com/daycare',
  },
};

const daycareFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What are the operating hours of Star Kids Daycare in Nerkundram?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Star Kids Day Care operates from 8:30 AM to 8:00 PM, Monday through Saturday, offering flexible options for working parents.',
      },
    },
    {
      '@type': 'Question',
      name: 'Do you provide after-school daycare for primary school children?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! We offer after-school daycare where children can have lunch, complete homework, rest, and engage in supervised play until parents pick them up.',
      },
    },
    {
      '@type': 'Question',
      name: 'What safety measures are implemented at the daycare facility?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We maintain 24/7 CCTV surveillance, verified female caregivers, air-conditioned rest rooms, child-safe furniture, and strict entry/exit security protocols.',
      },
    },
  ],
};

export default function DaycarePage() {
  return (
    <>
      <JsonLd data={SCHOOL_NAP} />
      <JsonLd data={daycareFaqSchema} />
      
      <Breadcrumbs items={[{ name: 'Daycare', url: '/daycare' }]} />

      <section className="page-hero" style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)', color: '#FFF', padding: '60px 0 80px', textAlign: 'center' }}>
        <div className="container">
          <span className="badge" style={{ background: '#FEF08A', color: '#4C1D95', fontWeight: 800 }}>Star Kids Day Care (8:30 AM – 8:00 PM)</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', margin: '16px 0', color: '#FFF' }}>
            Best Daycare &amp; Child Care Centre in Nerkundram, Chennai
          </h1>
          <p style={{ maxWidth: '750px', margin: '0 auto', fontSize: '1.15rem', opacity: 0.95 }}>
            A secure, warm, and structured daycare facility providing professional supervision, nutritious meal routines, rest areas, and after-school care for working parents in Nerkundram and surrounding areas.
          </p>
        </div>
      </section>

      <section className={`section-padding ${styles.overview}`}>
        <div className="container">
          <div className={styles.gridTwo}>
            <div>
              <span className="badge">Home Away From Home</span>
              <h2>Trusted Daycare Services in Nerkundram</h2>
              <p>
                Balancing professional work with parenting requires absolute trust in your child care provider. At <strong>Star Kids Pre School &amp; Day Care</strong> in Nerkundram, Chennai, we treat every child with motherly care, affection, and individual attention.
              </p>
              <p>
                Whether you require full-day child care for toddlers or after-school care for primary school students, our purpose-built daycare environment provides safety, comfort, and productive routines.
              </p>
              <div className={styles.highlights}>
                <div className={styles.checkItem}>✓ Convenient hours: 8:30 AM to 8:00 PM (Mon–Sat)</div>
                <div className={styles.checkItem}>✓ CCTV monitored, air-conditioned nap &amp; rest rooms</div>
                <div className={styles.checkItem}>✓ Supervised after-school homework assistance</div>
                <div className={styles.checkItem}>✓ Clean, hygienic dining areas &amp; fresh snack service</div>
                <div className={styles.checkItem}>✓ Experienced female caregivers &amp; security staff</div>
              </div>
            </div>
            <div className={styles.imgCol}>
              <Image
                src="/images/A Day at Little Star 2.png"
                alt="Star Kids Daycare playing room in Nerkundram Chennai"
                width={550}
                height={400}
                className={styles.roundedImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Daycare Services */}
      <section className="section-padding" style={{ background: '#FAF5FF' }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto 40px' }}>
            <span className="badge">Daycare Programs</span>
            <h2>Flexible Daycare Solutions for Busy Parents</h2>
            <p>Designed for infant toddlers, preschool children, and primary school students in Nerkundram.</p>
          </div>

          <div className={styles.gridThree}>
            <div className="card" style={{ padding: '24px', background: '#FFF', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🌅</div>
              <h3 style={{ color: '#4C1D95' }}>Full-Day Child Care</h3>
              <p>From 8:30 AM to 8:00 PM, including morning playtime, guided learning, nap time, snacks, and outdoor play.</p>
            </div>

            <div className="card" style={{ padding: '24px', background: '#FFF', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎒</div>
              <h3 style={{ color: '#4C1D95' }}>After-School Daycare</h3>
              <p>For primary school kids finishing school at 12:45 PM or 3:30 PM, providing lunch, rest, homework assistance, and games.</p>
            </div>

            <div className="card" style={{ padding: '24px', background: '#FFF', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🛡️</div>
              <h3 style={{ color: '#4C1D95' }}>Safety &amp; Health Standards</h3>
              <p>Regular sanitization, first-aid trained staff, emergency protocols, and child-safe play equipment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Serving Local Areas */}
      <section className="section-padding">
        <div className="container text-center">
          <span className="badge">Local Daycare</span>
          <h2>Serving Families Across Nerkundram &amp; Surrounding Locality</h2>
          <p style={{ maxWidth: '700px', margin: '12px auto 24px' }}>
            Ideal daycare facility for parents working or residing in Nerkundram, Kodambakkam, Koyambedu, Maduravoyal, Arumbakkam, Virugambakkam, Anna Nagar West, and Mogappair.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            {['Nerkundram', 'Kodambakkam', 'Koyambedu', 'Maduravoyal', 'Arumbakkam', 'Virugambakkam', 'Anna Nagar West', 'Mogappair'].map((area, i) => (
              <span key={i} style={{ background: '#EDE9FE', color: '#4C1D95', fontWeight: 600, padding: '10px 20px', borderRadius: '30px' }}>
                📍 Daycare in {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding" style={{ background: '#FAF5FF' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="text-center" style={{ marginBottom: '32px' }}>
            <span className="badge">Daycare FAQs</span>
            <h2>Frequently Asked Questions About Daycare</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ padding: '20px 24px', borderRadius: '12px', background: '#FFF' }}>
              <h3 style={{ color: '#4C1D95', fontSize: '1.1rem', marginBottom: '8px' }}>What are the operating hours of Star Kids Daycare in Nerkundram?</h3>
              <p style={{ color: '#555' }}>Star Kids Day Care operates from 8:30 AM to 8:00 PM, Monday through Saturday, offering flexible options for working parents.</p>
            </div>
            <div className="card" style={{ padding: '20px 24px', borderRadius: '12px', background: '#FFF' }}>
              <h3 style={{ color: '#4C1D95', fontSize: '1.1rem', marginBottom: '8px' }}>Do you provide after-school daycare for primary school children?</h3>
              <p style={{ color: '#555' }}>Yes! We offer after-school daycare where children can have lunch, complete homework, rest, and engage in supervised play until parents pick them up.</p>
            </div>
            <div className="card" style={{ padding: '20px 24px', borderRadius: '12px', background: '#FFF' }}>
              <h3 style={{ color: '#4C1D95', fontSize: '1.1rem', marginBottom: '8px' }}>What safety measures are implemented at the daycare facility?</h3>
              <p style={{ color: '#555' }}>We maintain 24/7 CCTV surveillance, verified female caregivers, air-conditioned rest rooms, child-safe furniture, and strict entry/exit security protocols.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding text-center" style={{ background: '#4C1D95', color: '#FFF' }}>
        <div className="container">
          <h2 style={{ color: '#FFF', fontSize: '2rem' }}>Enroll Your Child in Nerkundram&apos;s Preferred Day Care</h2>
          <p style={{ margin: '16px auto 30px', maxWidth: '600px' }}>Contact us today to inquire about daycare slots, fees, and campus visits.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="tel:+919941294084" className="btn-primary">Call Daycare Manager: +91 99412 94084</a>
            <Link href="/contact" className="btn-outline" style={{ borderColor: '#FFF', color: '#FFF' }}>Book a Visit</Link>
          </div>
        </div>
      </section>
    </>
  );
}

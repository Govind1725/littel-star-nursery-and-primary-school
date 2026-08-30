import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd, { SCHOOL_NAP } from '@/components/JsonLd';
import styles from './nursery.module.css';

export const metadata: Metadata = {
  title: 'Best Nursery School in Nerkundram, Chennai | Little Star',
  description:
    'Looking for the best nursery school in Nerkundram, Chennai? Little Star Nursery School offers LKG & UKG programs with activity-based learning, phonics & caring teachers near Kodambakkam, Koyambedu & Maduravoyal.',
  alternates: {
    canonical: 'https://www.littlestarnpschool.com/nursery-school',
  },
  openGraph: {
    title: 'Best Nursery School in Nerkundram, Chennai | Little Star',
    description:
      'Nurturing LKG and UKG nursery education in Nerkundram, Chennai. Foundational phonics, math concepts, creative play & safe environment.',
    url: 'https://www.littlestarnpschool.com/nursery-school',
  },
};

const nurseryFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What age group is eligible for Nursery (LKG & UKG) admission?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Children aged 3.5 to 4.5 years are eligible for Lower Kindergarten (LKG), and children aged 4.5 to 5.5 years are eligible for Upper Kindergarten (UKG) at Little Star Nerkundram.',
      },
    },
    {
      '@type': 'Question',
      name: 'What teaching methodology is used in the Nursery program?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'We follow an activity-based learning approach combining phonics, storytelling, hands-on math tools, creative arts, and sensory exercises to build early literacy and cognitive skills.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is transport/location convenient for parents in Kodambakkam and Koyambedu?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Little Star Nursery School is conveniently located in Nerkundram, just minutes away from Kodambakkam, Koyambedu, Maduravoyal, Arumbakkam, Virugambakkam, Anna Nagar West, and Mogappair.',
      },
    },
  ],
};

export default function NurserySchoolPage() {
  return (
    <>
      <JsonLd data={SCHOOL_NAP} />
      <JsonLd data={nurseryFaqSchema} />
      
      <Breadcrumbs items={[{ name: 'Nursery School', url: '/nursery-school' }]} />

      <section className="page-hero" style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)', color: '#FFF', padding: '60px 0 80px', textAlign: 'center' }}>
        <div className="container">
          <span className="badge" style={{ background: '#FEF08A', color: '#4C1D95', fontWeight: 800 }}>Nursery Education (LKG &amp; UKG)</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', margin: '16px 0', color: '#FFF' }}>
            Best Nursery School in Nerkundram, Chennai
          </h1>
          <p style={{ maxWidth: '750px', margin: '0 auto', fontSize: '1.15rem', opacity: 0.95 }}>
            Fostering curiosity, early literacy, numerical thinking, and social confidence in a warm, activity-filled environment for children in Nerkundram and nearby Chennai localities.
          </p>
        </div>
      </section>

      <section className={`section-padding ${styles.overview}`}>
        <div className="container">
          <div className={styles.gridTwo}>
            <div>
              <span className="badge">Nurturing Early Learners</span>
              <h2>Why Little Star is the Preferred Nursery School in Nerkundram</h2>
              <p>
                At <strong>Little Star Nursery &amp; Primary School</strong>, our Nursery program (LKG &amp; UKG) bridges early childhood curiosity with structured academic readiness. We recognize that children learn best when they are actively engaged, happy, and safe.
              </p>
              <p>
                Our experienced nursery teachers utilize multi-sensory tools, phonics routines, number games, and interactive storytelling to lay strong foundations in English, Mathematics, Environmental Science, and Art.
              </p>
              <div className={styles.highlights}>
                <div className={styles.checkItem}>✓ Phonics-based reading &amp; vocabulary building</div>
                <div className={styles.checkItem}>✓ Activity-based numerical &amp; counting skills</div>
                <div className={styles.checkItem}>✓ Fine &amp; gross motor skill development</div>
                <div className={styles.checkItem}>✓ Creative art, music &amp; group storytelling</div>
                <div className={styles.checkItem}>✓ Warm, patient &amp; certified nursery educators</div>
              </div>
            </div>
            <div className={styles.imgCol}>
              <Image
                src="/images/program_preschool.png"
                alt="Little Star Nursery School classroom in Nerkundram Chennai"
                width={550}
                height={400}
                className={styles.roundedImg}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={`section-padding ${styles.curriculum}`} style={{ background: '#FAF5FF' }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto 40px' }}>
            <span className="badge">Curriculum Highlights</span>
            <h2>LKG &amp; UKG Nursery Learning Pillars</h2>
            <p>Designed for children aged 3.5 to 5.5 years, helping them transition smoothly into primary school.</p>
          </div>

          <div className={styles.gridThree}>
            <div className="card" style={{ padding: '24px', background: '#FFF', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🗣️</div>
              <h3 style={{ color: '#4C1D95' }}>Phonics &amp; Language Development</h3>
              <p>Letter recognition, sound blending, conversational English, and beginner vocabulary worksheets.</p>
            </div>

            <div className="card" style={{ padding: '24px', background: '#FFF', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🔢</div>
              <h3 style={{ color: '#4C1D95' }}>Early Mathematics &amp; Logic</h3>
              <p>Counting, number sequencing, shape identification, sorting, and pattern recognition through hands-on blocks.</p>
            </div>

            <div className="card" style={{ padding: '24px', background: '#FFF', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🌿</div>
              <h3 style={{ color: '#4C1D95' }}>Environmental Awareness</h3>
              <p>Exploring plants, animals, weather, hygiene, community helpers, and social manners.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Serving Local Areas */}
      <section className="section-padding">
        <div className="container">
          <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto 30px' }}>
            <span className="badge">Convenient Location</span>
            <h2>Serving Parents Across Nerkundram &amp; Surrounding Areas</h2>
            <p>
              Located in Jaya Lakshmi Nagar, Nerkundram, our school is easily accessible for families residing in:
            </p>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            {['Nerkundram', 'Kodambakkam', 'Koyambedu', 'Maduravoyal', 'Arumbakkam', 'Virugambakkam', 'Anna Nagar West', 'Mogappair'].map((area, i) => (
              <span key={i} style={{ background: '#EDE9FE', color: '#4C1D95', fontWeight: 600, padding: '10px 20px', borderRadius: '30px' }}>
                📍 Nursery School in {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding" style={{ background: '#FAF5FF' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="text-center" style={{ marginBottom: '32px' }}>
            <span className="badge">Nursery FAQs</span>
            <h2>Frequently Asked Questions About Nursery Admission</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ padding: '20px 24px', borderRadius: '12px', background: '#FFF' }}>
              <h3 style={{ color: '#4C1D95', fontSize: '1.1rem', marginBottom: '8px' }}>What age group is eligible for Nursery (LKG &amp; UKG) admission?</h3>
              <p style={{ color: '#555' }}>Children aged 3.5 to 4.5 years are eligible for Lower Kindergarten (LKG), and children aged 4.5 to 5.5 years are eligible for Upper Kindergarten (UKG) at Little Star Nerkundram.</p>
            </div>
            <div className="card" style={{ padding: '20px 24px', borderRadius: '12px', background: '#FFF' }}>
              <h3 style={{ color: '#4C1D95', fontSize: '1.1rem', marginBottom: '8px' }}>What teaching methodology is used in the Nursery program?</h3>
              <p style={{ color: '#555' }}>We follow an activity-based learning approach combining phonics, storytelling, hands-on math tools, creative arts, and sensory exercises to build early literacy and cognitive skills.</p>
            </div>
            <div className="card" style={{ padding: '20px 24px', borderRadius: '12px', background: '#FFF' }}>
              <h3 style={{ color: '#4C1D95', fontSize: '1.1rem', marginBottom: '8px' }}>Is transport/location convenient for parents in Kodambakkam and Koyambedu?</h3>
              <p style={{ color: '#555' }}>Yes! Little Star Nursery School is conveniently located in Nerkundram, just minutes away from Kodambakkam, Koyambedu, Maduravoyal, Arumbakkam, Virugambakkam, Anna Nagar West, and Mogappair.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding text-center" style={{ background: '#4C1D95', color: '#FFF' }}>
        <div className="container">
          <h2 style={{ color: '#FFF', fontSize: '2rem' }}>Enroll Your Child in Nerkundram&apos;s Preferred Nursery School</h2>
          <p style={{ margin: '16px auto 30px', maxWidth: '600px' }}>Admissions open for 2026–27. Give your child a joyful educational beginning.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/admissions" className="btn-primary">Apply for Nursery Admission</Link>
            <Link href="/contact" className="btn-outline" style={{ borderColor: '#FFF', color: '#FFF' }}>Contact Us</Link>
          </div>
        </div>
      </section>
    </>
  );
}

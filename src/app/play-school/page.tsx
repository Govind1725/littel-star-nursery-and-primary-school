import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd, { SCHOOL_NAP } from '@/components/JsonLd';
import styles from './playschool.module.css';

export const metadata: Metadata = {
  title: 'Best Play School & Preschool in Nerkundram, Chennai | Little Star',
  description:
    'Searching for the best play school or preschool in Nerkundram, Chennai? Star Kids Play School offers sensory play, toddler activities, emotional care & safe spaces near Kodambakkam, Koyambedu & Maduravoyal.',
  alternates: {
    canonical: 'https://www.littlestarnpschool.com/play-school',
  },
  openGraph: {
    title: 'Best Play School & Preschool in Nerkundram, Chennai | Little Star',
    description:
      'Gentle toddler preschool & play school in Nerkundram, Chennai. Sensory play, motor development, caring caregivers & activity-based early learning.',
    url: 'https://www.littlestarnpschool.com/play-school',
  },
};

const playschoolFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'At what age can a child join the Play School / Preschool program?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Toddlers aged 2.5 to 3.5 years are eligible to enroll in the Star Kids Play School & Toddler program in Nerkundram, Chennai.',
      },
    },
    {
      '@type': 'Question',
      name: 'How does play school help toddlers adjust to school routines?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Our play school program introduces social interaction, sharing, listening skills, and structured routines through fun games, rhymes, and sensory activities.',
      },
    },
    {
      '@type': 'Question',
      name: 'Is the preschool campus safe and hygienic for young toddlers?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes! Our campus features child-proofed indoor play areas, sanitized toys, CCTV surveillance, and trained female attendants ensuring complete safety.',
      },
    },
  ],
};

export default function PlaySchoolPage() {
  return (
    <>
      <JsonLd data={SCHOOL_NAP} />
      <JsonLd data={playschoolFaqSchema} />
      
      <Breadcrumbs items={[{ name: 'Play School', url: '/play-school' }]} />

      <section className="page-hero" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)', color: '#FFF', padding: '60px 0 80px', textAlign: 'center' }}>
        <div className="container">
          <span className="badge" style={{ background: '#FEF08A', color: '#4C1D95', fontWeight: 800 }}>Star Kids Play School &amp; Preschool</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', margin: '16px 0', color: '#FFF' }}>
            Best Play School &amp; Preschool in Nerkundram, Chennai
          </h1>
          <p style={{ maxWidth: '750px', margin: '0 auto', fontSize: '1.15rem', opacity: 0.95 }}>
            A gentle, joyful, and creative environment where toddlers (ages 2.5 to 3.5 years) explore sensory play, build socialization, and blossom into confident learners.
          </p>
        </div>
      </section>

      <section className={`section-padding ${styles.overview}`}>
        <div className="container">
          <div className={styles.gridTwo}>
            <div>
              <span className="badge">Joyful Early Steps</span>
              <h2>Star Kids Preschool Learning Environment in Nerkundram</h2>
              <p>
                A child&apos;s first experience outside the home should feel warm, safe, and exciting. At <strong>Star Kids Pre School in Nerkundram</strong>, we create a supportive environment where toddlers feel cherished and eager to explore.
              </p>
              <p>
                Our play-based methodology encourages toddlers to learn through touch, sound, color, movement, and play activities that spark natural curiosity and social development.
              </p>
              <div className={styles.highlights}>
                <div className={styles.checkItem}>✓ Sensory play &amp; tactile learning corners</div>
                <div className={styles.checkItem}>✓ Music, movement &amp; nursery rhyme sessions</div>
                <div className={styles.checkItem}>✓ Fine motor skills &amp; hand-eye coordination games</div>
                <div className={styles.checkItem}>✓ Gentle separation-anxiety support for parents</div>
                <div className={styles.checkItem}>✓ Child-safe toys, soft play areas &amp; hygiene standards</div>
              </div>
            </div>
            <div className={styles.imgCol}>
              <Image
                src="/images/program_toddler.png"
                alt="Star Kids Play School toddlers playing in Nerkundram Chennai"
                width={550}
                height={400}
                className={styles.roundedImg}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Program Features */}
      <section className="section-padding" style={{ background: '#FAF5FF' }}>
        <div className="container">
          <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto 40px' }}>
            <span className="badge">Preschool Highlights</span>
            <h2>What Toddlers Experience at Star Kids Play School</h2>
            <p>Thoughtfully planned activities designed specifically for toddlers aged 2.5 to 3.5 years.</p>
          </div>

          <div className={styles.gridThree}>
            <div className="card" style={{ padding: '24px', background: '#FFF', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎨</div>
              <h3 style={{ color: '#4C1D95' }}>Sensory &amp; Art Exploration</h3>
              <p>Finger painting, playdough modeling, texture boards, and color recognition activities.</p>
            </div>

            <div className="card" style={{ padding: '24px', background: '#FFF', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🎵</div>
              <h3 style={{ color: '#4C1D95' }}>Music, Movement &amp; Rhymes</h3>
              <p>Rhythm circles, dancing, nursery rhymes, and auditory discrimination exercises.</p>
            </div>

            <div className="card" style={{ padding: '24px', background: '#FFF', borderRadius: '16px' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>🧸</div>
              <h3 style={{ color: '#4C1D95' }}>Social Interaction &amp; Sharing</h3>
              <p>Group play, circle time, building friendships, learning manners, and emotional bonding.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Serving Local Areas */}
      <section className="section-padding">
        <div className="container text-center">
          <span className="badge">Local Preschool</span>
          <h2>Serving Parents in Nerkundram &amp; Nearby Chennai Areas</h2>
          <p style={{ maxWidth: '700px', margin: '12px auto 24px' }}>
            Accessible play school education for families in Nerkundram, Kodambakkam, Koyambedu, Maduravoyal, Arumbakkam, Virugambakkam, Anna Nagar West, and Mogappair.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
            {['Nerkundram', 'Kodambakkam', 'Koyambedu', 'Maduravoyal', 'Arumbakkam', 'Virugambakkam', 'Anna Nagar West', 'Mogappair'].map((area, i) => (
              <span key={i} style={{ background: '#EDE9FE', color: '#4C1D95', fontWeight: 600, padding: '10px 20px', borderRadius: '30px' }}>
                📍 Play School in {area}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding" style={{ background: '#FAF5FF' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="text-center" style={{ marginBottom: '32px' }}>
            <span className="badge">Play School FAQs</span>
            <h2>Frequently Asked Questions About Preschool</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ padding: '20px 24px', borderRadius: '12px', background: '#FFF' }}>
              <h3 style={{ color: '#4C1D95', fontSize: '1.1rem', marginBottom: '8px' }}>At what age can a child join the Play School / Preschool program?</h3>
              <p style={{ color: '#555' }}>Toddlers aged 2.5 to 3.5 years are eligible to enroll in the Star Kids Play School &amp; Toddler program in Nerkundram, Chennai.</p>
            </div>
            <div className="card" style={{ padding: '20px 24px', borderRadius: '12px', background: '#FFF' }}>
              <h3 style={{ color: '#4C1D95', fontSize: '1.1rem', marginBottom: '8px' }}>How does play school help toddlers adjust to school routines?</h3>
              <p style={{ color: '#555' }}>Our play school program introduces social interaction, sharing, listening skills, and structured routines through fun games, rhymes, and sensory activities.</p>
            </div>
            <div className="card" style={{ padding: '20px 24px', borderRadius: '12px', background: '#FFF' }}>
              <h3 style={{ color: '#4C1D95', fontSize: '1.1rem', marginBottom: '8px' }}>Is the preschool campus safe and hygienic for young toddlers?</h3>
              <p style={{ color: '#555' }}>Yes! Our campus features child-proofed indoor play areas, sanitized toys, CCTV surveillance, and trained female attendants ensuring complete safety.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding text-center" style={{ background: '#4C1D95', color: '#FFF' }}>
        <div className="container">
          <h2 style={{ color: '#FFF', fontSize: '2rem' }}>Give Your Toddler a Happy Start in Play School</h2>
          <p style={{ margin: '16px auto 30px', maxWidth: '600px' }}>Admissions open for 2026–27. Book a visit to Star Kids Pre School today.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/admissions" className="btn-primary">Apply for Play School</Link>
            <Link href="/contact" className="btn-outline" style={{ borderColor: '#FFF', color: '#FFF' }}>Visit Our Campus</Link>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd, { SCHOOL_NAP } from '@/components/JsonLd';
import styles from './activities.module.css';

export const metadata: Metadata = {
  title: 'Activities & Extracurricular Programs | Little Star School Nerkundram',
  description:
    'Discover extracurricular activities at Little Star Nursery & Primary School Nerkundram, Chennai. Karate, Silambam, Arts & Crafts, Dance, Music, STEM projects & Sports.',
  alternates: {
    canonical: 'https://www.littlestarnpschool.com/activities',
  },
  openGraph: {
    title: 'Activities & Extracurricular Programs | Little Star School Nerkundram',
    description:
      'Holistic extracurricular growth at Little Star School in Nerkundram, Chennai. Martial arts, creative arts, stage confidence & physical fitness.',
    url: 'https://www.littlestarnpschool.com/activities',
  },
};

const activityItems = [
  {
    title: 'Karate Training',
    desc: 'Traditional martial arts instruction building physical stamina, self-defense awareness, focus, and discipline.',
    img: '/images/karate_icon.png',
  },
  {
    title: 'Silambam Martial Art',
    desc: 'Ancient Tamil martial art staff spinning that develops agility, balance, core strength, and cultural pride.',
    img: '/images/karate_icon.png',
  },
  {
    title: 'Dance & Music Expression',
    desc: 'Rhythm, melody, and choreography sessions fostering self-expression, stage poise, and coordination.',
    img: '/images/dance_icon.png',
  },
  {
    title: 'Arts & Craft Workshops',
    desc: 'Drawing, clay modeling, origamy, and paper craft enhancing fine motor skills and imaginative thinking.',
    img: '/images/life.png',
  },
  {
    title: 'STEM & Hands-on Science',
    desc: 'Fun science experiments, robotics kits, and logic puzzles introducing young minds to technology.',
    img: '/images/cognitive.png',
  },
  {
    title: 'Annual Day & Cultural Festivals',
    desc: 'Grand stage celebrations where every student participates in plays, dance dramas, and song recitals.',
    img: '/images/socio.png',
  },
];

export default function ActivitiesPage() {
  return (
    <>
      <JsonLd data={SCHOOL_NAP} />
      <Breadcrumbs items={[{ name: 'Activities & Programs', url: '/activities' }]} />

      <section className="page-hero" style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #7C3AED 100%)', color: '#FFF', padding: '60px 0 70px', textAlign: 'center' }}>
        <div className="container">
          <span className="badge" style={{ background: '#FEF08A', color: '#4C1D95', fontWeight: 800 }}>Co-Curricular Growth</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', margin: '16px 0', color: '#FFF' }}>
            Extracurricular Activities &amp; Programs at Little Star Nerkundram
          </h1>
          <p style={{ maxWidth: '750px', margin: '0 auto', fontSize: '1.15rem', opacity: 0.95 }}>
            Nurturing confident, creative, and physically fit individuals through Karate, Silambam, Arts, Dance, Music, and Annual Day performances.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container">
          <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto 40px' }}>
            <span className="badge">Beyond Books</span>
            <h2>Holistic Development Programs</h2>
            <p>We believe every child possesses unique artistic and physical talents that flourish with proper guidance.</p>
          </div>

          <div className={styles.gridThree}>
            {activityItems.map((item, i) => (
              <div key={i} className="card" style={{ padding: '24px', borderRadius: '16px', background: '#FFF', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                <div style={{ width: '70px', height: '70px', margin: '0 auto 16px', position: 'relative' }}>
                  <Image src={item.img} alt={item.title} fill style={{ objectFit: 'contain' }} />
                </div>
                <h3 style={{ color: '#4C1D95', fontSize: '1.25rem', marginBottom: '8px', textAlign: 'center' }}>{item.title}</h3>
                <p style={{ color: '#555', textAlign: 'center', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding text-center" style={{ background: '#4C1D95', color: '#FFF' }}>
        <div className="container">
          <h2 style={{ color: '#FFF', fontSize: '2rem' }}>Experience Campus Life at Little Star</h2>
          <p style={{ margin: '16px auto 30px', maxWidth: '600px' }}>Visit our Nerkundram campus to observe co-curricular activities in action.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/admissions" className="btn-primary">Apply for Admission</Link>
            <Link href="/gallery" className="btn-outline" style={{ borderColor: '#FFF', color: '#FFF' }}>View Photo Gallery</Link>
          </div>
        </div>
      </section>
    </>
  );
}

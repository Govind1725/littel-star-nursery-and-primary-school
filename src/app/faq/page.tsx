import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd, { SCHOOL_NAP } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | Little Star Nursery & Primary School Nerkundram',
  description:
    'Got questions about admissions, fees, daycare timings, nursery programs, primary school curriculum, or tuition in Nerkundram, Chennai? Find all answers here.',
  alternates: {
    canonical: 'https://www.littlestarnpschool.com/faq',
  },
  openGraph: {
    title: 'Frequently Asked Questions | Little Star Nursery & Primary School Nerkundram',
    description:
      'Clear, detailed answers to parent questions regarding Nursery, Primary, Play School, Day Care, and Tuition Centre in Nerkundram, Chennai.',
    url: 'https://www.littlestarnpschool.com/faq',
  },
};

const comprehensiveFaqs = [
  {
    q: 'What programs are offered at Little Star Nursery & Primary School?',
    a: 'We offer Play School / Preschool for toddlers (ages 2.5 - 3.5), Nursery School (LKG & UKG), Primary Education (Classes I to V), Daycare Services (8:30 AM to 8:00 PM), and Star Tuition Centre (STD I to XII & CBSE Maths from 6:00 PM to 8:00 PM).',
  },
  {
    q: 'Where is the school located in Chennai?',
    a: 'Our campus is located at 2, Anna Street, near Moogambigai Amman Temple, Jaya Lakshmi Nagar, Kothandaraman Nagar, Nerkundram, Chennai, Tamil Nadu 600107. Conveniently accessible from Kodambakkam, Koyambedu, Maduravoyal, Arumbakkam, Virugambakkam, Anna Nagar West, and Mogappair.',
  },
  {
    q: 'What are the school operating hours?',
    a: 'Pre-KG runs 8:45 AM - 12:00 PM, LKG 8:45 AM - 12:45 PM, UKG 8:45 AM - 2:45 PM, Primary 8:45 AM - 3:30 PM. Daycare is open 8:30 AM to 8:00 PM. Tuition operates 6:00 PM to 8:00 PM.',
  },
  {
    q: 'What is the admission procedure for 2026–27?',
    a: 'Parents can fill out the online admission form, call +91 99412 94084, or visit the school office directly for campus tours and document submission.',
  },
  {
    q: 'What are the safety and security arrangements?',
    a: 'We maintain 24/7 CCTV camera monitoring, security guards at gate, verified female attendants, air-conditioned rooms, and first-aid kits.',
  },
  {
    q: 'Are extracurricular activities included in the curriculum?',
    a: 'Yes! We provide regular training in Karate, Silambam martial arts, dance, music, fine arts, computer literacy, and STEM activities.',
  },
  {
    q: 'Does the school provide tuition for CBSE students?',
    a: 'Yes, Star Tuition Centre specializes in CBSE Mathematics and core academic subjects for Standard I through XII.',
  },
];

const mainFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: comprehensiveFaqs.map(f => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.a,
    },
  })),
};

export default function FAQPage() {
  return (
    <>
      <JsonLd data={SCHOOL_NAP} />
      <JsonLd data={mainFaqSchema} />
      
      <Breadcrumbs items={[{ name: 'Frequently Asked Questions', url: '/faq' }]} />

      <section className="page-hero" style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)', color: '#FFF', padding: '60px 0 70px', textAlign: 'center' }}>
        <div className="container">
          <span className="badge" style={{ background: '#FEF08A', color: '#4C1D95', fontWeight: 800 }}>Parent Help Center</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', margin: '16px 0', color: '#FFF' }}>
            Frequently Asked Questions (FAQ)
          </h1>
          <p style={{ maxWidth: '750px', margin: '0 auto', fontSize: '1.15rem', opacity: 0.95 }}>
            Find quick answers to common questions about admissions, academic syllabus, daycare hours, and tuition in Nerkundram, Chennai.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container" style={{ maxWidth: '900px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {comprehensiveFaqs.map((faq, i) => (
              <div key={i} className="card" style={{ padding: '24px', borderRadius: '16px', background: '#FFF', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                <h3 style={{ color: '#4C1D95', fontSize: '1.2rem', marginBottom: '10px' }}>{faq.q}</h3>
                <p style={{ color: '#555', lineHeight: 1.6, margin: 0 }}>{faq.a}</p>
              </div>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: '40px' }}>
            <p style={{ fontSize: '1.1rem', color: '#666' }}>Have a question not listed here?</p>
            <Link href="/contact" className="btn-primary" style={{ marginTop: '12px', display: 'inline-block' }}>
              Contact Our School Office
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

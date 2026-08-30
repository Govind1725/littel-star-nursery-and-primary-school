import type { Metadata } from 'next';
import AdmissionsClient from './AdmissionsClient';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd, { SCHOOL_NAP } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Admissions 2026-27 | Little Star Nursery & Primary School Nerkundram',
  description:
    'Admissions open for 2026–27 at Little Star Nursery & Primary School, Nerkundram, Chennai. Apply for Play School, Nursery (LKG/UKG), Primary (STD I-V), Daycare & Tuition.',
  alternates: {
    canonical: 'https://www.littlestarnpschool.com/admissions',
  },
  openGraph: {
    title: 'Admissions 2026-27 | Little Star Nursery & Primary School Nerkundram',
    description:
      'Enroll your child at Little Star Nerkundram. Easy 4-step admission process, transparent age eligibility & caring teachers.',
    url: 'https://www.littlestarnpschool.com/admissions',
  },
};

const admissionsFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What programs are open for 2026–27 admissions?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Admissions are open for Play School (2.5-3.5 yrs), Nursery LKG (3.5-4.5 yrs), UKG (4.5-5.5 yrs), Primary Classes (I to V STD), Daycare (8:30 AM to 8 PM), and Evening Tuition.',
      },
    },
    {
      '@type': 'Question',
      name: 'What documents are required during enrollment?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Parents need to provide child Birth Certificate copy, Aadhaar card copy, passport size photos, and transfer certificate (if applicable).',
      },
    },
  ],
};

export default function AdmissionsPage() {
  return (
    <>
      <JsonLd data={SCHOOL_NAP} />
      <JsonLd data={admissionsFaqSchema} />
      
      <Breadcrumbs items={[{ name: 'Admissions', url: '/admissions' }]} />

      <section className="page-hero" style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)', color: '#FFF', padding: '60px 0 70px', textAlign: 'center' }}>
        <div className="container">
          <span className="badge" style={{ background: '#FEF08A', color: '#4C1D95', fontWeight: 800 }}>Enrollment 2026–27</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', margin: '16px 0', color: '#FFF' }}>
            School Admissions 2026–27 | Little Star Nerkundram
          </h1>
          <p style={{ maxWidth: '750px', margin: '0 auto', fontSize: '1.15rem', opacity: 0.95 }}>
            Take the first big step towards your child&apos;s bright future. Our admission process is simple, transparent, and parent-friendly.
          </p>
        </div>
      </section>

      <AdmissionsClient />
    </>
  );
}

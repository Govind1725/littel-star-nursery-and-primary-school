import type { Metadata } from 'next';
import ContactClient from './ContactClient';
import Breadcrumbs from '@/components/Breadcrumbs';
import JsonLd, { SCHOOL_NAP } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Contact Little Star Nursery & Primary School | Nerkundram, Chennai',
  description:
    'Contact Little Star Nursery & Primary School in Nerkundram, Chennai. Phone: +91 99412 94084. Serving parents in Nerkundram, Kodambakkam, Koyambedu, Maduravoyal, Arumbakkam, Virugambakkam & Mogappair.',
  alternates: {
    canonical: 'https://www.littlestarnpschool.com/contact',
  },
  openGraph: {
    title: 'Contact Little Star Nursery & Primary School | Nerkundram, Chennai',
    description:
      'Reach out for Nursery, Primary School, Play School, Day Care & Tuition admissions in Nerkundram, Chennai. Call +91 99412 94084.',
    url: 'https://www.littlestarnpschool.com/contact',
  },
};

export default function ContactPage() {
  return (
    <>
      <JsonLd data={SCHOOL_NAP} />
      <Breadcrumbs items={[{ name: 'Contact Us', url: '/contact' }]} />
      
      {/* Hero */}
      <section className="page-hero" style={{ background: 'linear-gradient(135deg, #4C1D95 0%, #6D28D9 100%)', color: '#FFF', padding: '60px 0 70px', textAlign: 'center' }}>
        <div className="container">
          <span className="badge" style={{ background: '#FEF08A', color: '#4C1D95', fontWeight: 800 }}>📞 Reach Our Team</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', margin: '16px 0', color: '#FFF' }}>
            Contact Little Star Nursery &amp; Primary School
          </h1>
          <p style={{ maxWidth: '750px', margin: '0 auto', fontSize: '1.15rem', opacity: 0.95 }}>
            We are here to answer all your queries regarding admissions, fees, daycare options, and campus visits in Nerkundram, Chennai.
          </p>
        </div>
      </section>

      <ContactClient />
    </>
  );
}

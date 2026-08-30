import type { Metadata } from 'next';
import HomeClient from './HomeClient';
import JsonLd, { SCHOOL_NAP } from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Little Star Nursery & Primary School | Best School in Nerkundram, Chennai',
  description:
    'Little Star Nursery & Primary School — Best Nursery, Primary School, Play School, Daycare & Tuition Centre in Nerkundram, Chennai. Serving parents in Nerkundram, Kodambakkam, Koyambedu, Maduravoyal, Arumbakkam, Virugambakkam & Mogappair.',
  alternates: {
    canonical: 'https://www.littlestarnpschool.com/',
  },
  openGraph: {
    title: 'Little Star Nursery & Primary School | Best School in Nerkundram, Chennai',
    description:
      'Top-rated Nursery, Primary School, Play School, Daycare & Tuition Centre in Nerkundram, Chennai. Activity-based learning, experienced teachers & safe environment.',
    url: 'https://www.littlestarnpschool.com/',
    siteName: 'Little Star Nursery & Primary School',
    locale: 'en_IN',
    type: 'website',
  },
};

const homepageFaqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'What programs are offered at Little Star Nerkundram?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Little Star offers Play School / Preschool, Nursery School (LKG & UKG), Primary Education (Classes I to V), Daycare (8:30 AM to 8:00 PM), and Star Tuition Centre (STD I to XII & CBSE Maths).',
      },
    },
    {
      '@type': 'Question',
      name: 'Where is Little Star Nursery & Primary School located?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Little Star is located at 2, Anna Street, near Moogambigai Amman Temple, Jaya Lakshmi Nagar, Kothandaraman Nagar, Nerkundram, Chennai - 600107, serving Nerkundram, Kodambakkam, Koyambedu, Maduravoyal, Arumbakkam, Virugambakkam, Anna Nagar West, and Mogappair.',
      },
    },
    {
      '@type': 'Question',
      name: 'What are the daycare timings at Star Kids Pre School & Day Care?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Daycare operates from 8:30 AM to 8:00 PM Monday to Saturday, offering supervised child care, nutritious snacks, and rest areas.',
      },
    },
  ],
};

const homepageWebsiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Little Star Nursery & Primary School',
  url: 'https://www.littlestarnpschool.com/',
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={SCHOOL_NAP} />
      <JsonLd data={homepageWebsiteSchema} />
      <JsonLd data={homepageFaqSchema} />
      <HomeClient />
    </>
  );
}

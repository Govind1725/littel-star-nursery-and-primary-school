import React from 'react';

interface JsonLdProps {
  data: Record<string, any> | Record<string, any>[];
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// Pre-configured schema helper builders
export const SCHOOL_NAP = {
  name: 'Little Star Nursery & Primary School',
  alternateName: ['Star Kids Pre School & Day Care', 'Star Tuition Centre'],
  url: 'https://www.littlestarnpschool.com',
  telephone: '+919941294084',
  email: 'littlestarnpschoolnerkundram@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '2, Anna Street, near Moogambigai Amman Temple, Jaya Lakshmi Nagar, Kothandaraman Nagar',
    addressLocality: 'Nerkundram',
    addressRegion: 'Tamil Nadu',
    postalCode: '600107',
    addressCountry: 'IN',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 13.0684,
    longitude: 80.1915,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '08:45',
      closes: '17:00',
    },
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Saturday'],
      opens: '08:45',
      closes: '15:00',
    },
  ],
  hasMap: 'https://www.google.com/maps?q=No.2+Anna+main+road,+Jayalakshmi+Nagar,+Nerkundram,+Chennai-107',
  areaServed: [
    'Nerkundram',
    'Kodambakkam',
    'Koyambedu',
    'Maduravoyal',
    'Arumbakkam',
    'Virugambakkam',
    'Anna Nagar West',
    'Mogappair',
    'Chennai',
  ],
};

'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from './admission.module.css';

const admissionSteps = [
  {
    step: '01',
    title: 'Submit Inquiry',
    desc: 'Visit our contact page and fill up the quick Preschool Admission Form with your details.',
    icon: '📝',
  },
  {
    step: '02',
    title: 'Consultation',
    desc: 'Our admission counsellors will get in touch with you to understand your child\'s requirements.',
    icon: '📞',
  },
  {
    step: '03',
    title: 'Campus Tour',
    desc: 'Visit the nearest Little Star Preschool for a guided tour of our joyful learning spaces.',
    icon: '🏫',
  },
  {
    step: '04',
    title: 'Enrolment',
    desc: 'Complete the enrolment process and documentation with assistance from our counsellors.',
    icon: '🎓',
  },
];

const faqs = [
  {
    q: 'What are the preschool programs offered by Little Star?',
    a: 'We offer age-appropriate programs: Developing Roots / Playgroup (2-3 years), Emerging Wings / Nursery (3-4 years), Ready To Fly I / Lower KG (4-5 years), and Ready To Fly II / Upper KG (5-6 years).',
  },
  {
    q: 'Why should I choose Little Star for my child?',
    a: 'Little Star provides a nurturing environment with a scientifically researched Seven Petal approach. We focus on holistic development, experienced educators, and safe, vibrant classrooms.',
  },
  {
    q: 'At what age should I admit my child?',
    a: 'The best time for admission is at the age of two years (Playgroup). Early years are critical for a child\'s development, building a strong bond with knowledge and social values.',
  },
  {
    q: 'Can children be admitted during mid-year?',
    a: 'Yes, children can be admitted mid-year for our Developing Roots (Playgroup) and Emerging Wings (Nursery) programs, subject to seat availability.',
  },
  {
    q: 'What is the student-teacher ratio?',
    a: 'To ensure high-quality personal attention for every child, we follow a strict student-teacher ratio of 10:1.',
  },
  {
    q: 'What are the safety and security measures?',
    a: 'Safety is our top priority. We have restricted entry, verified staff, CCTV surveillance, and regular teacher training on incident management and first aid.',
  },
];

export default function AdmissionPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="page-hero">
        <div className="container">
          <h1>Admission Details</h1>
          <p>
            Take the first big step towards a bright future. Our admission process is simple, transparent, and designed to help you make the best choice.
          </p>
        </div>
      </section>

      {/* ===== ADMISSION PROCESS ===== */}
      <section className={`section-padding ${styles.processSection}`}>
        <div className="container">
          <div className="text-center">
            <span className="badge">🚀 Getting Started</span>
            <h2 className="section-title">4 Simple Steps to Join Us</h2>
            <p className="section-subtitle">
              We make the enrolment journey as smooth and joyful as possible for both parents and children.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            {admissionSteps.map((item, i) => (
              <div key={i} className={styles.stepCard}>
                <div className={styles.stepNum}>{item.step}</div>
                <div className={styles.stepIcon}>{item.icon}</div>
                <h3 className={styles.stepTitle}>{item.title}</h3>
                <p className={styles.stepDesc}>{item.desc}</p>
                {i < admissionSteps.length - 1 && <div className={styles.stepArrow}>➔</div>}
              </div>
            ))}
          </div>

          <div className="text-center" style={{ marginTop: '50px' }}>
            <Link href="/contact" className="btn-primary" id="admission-apply-btn">
              📝 Apply Now
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAQS ===== */}
      <section className={`section-padding ${styles.faqSection}`}>
        <div className="container">
          <div className="text-center">
            <span className="badge">❓ Got Questions?</span>
            <h2 className="section-title">Parent FAQs</h2>
            <p className="section-subtitle">
              Find answers to the most frequently asked questions related to preschool admissions, programs, and our campus.
            </p>
          </div>

          <div className={styles.faqList}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                className={`${styles.faqItem} ${openFaq === i ? styles.faqOpen : ''}`}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className={styles.faqHeader}>
                  <h3 className={styles.faqQ}>{faq.q}</h3>
                  <span className={styles.faqToggle}>{openFaq === i ? '−' : '+'}</span>
                </div>
                <div className={styles.faqBody}>
                  <p className={styles.faqA}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

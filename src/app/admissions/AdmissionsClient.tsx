'use client';

import { useState } from 'react';
import Link from 'next/link';
import styles from '../admission/admission.module.css';
import { FileText, Phone, MapPin, GraduationCap, Rocket, HelpCircle, CheckCircle } from 'lucide-react';

const admissionSteps = [
  {
    step: '01',
    title: 'Submit Inquiry Form',
    desc: 'Fill out our quick online admission inquiry form or call our administrative team.',
    icon: FileText,
  },
  {
    step: '02',
    title: 'Parent Consultation',
    desc: 'Our admissions coordinator contacts you to discuss your child\'s age eligibility and program choices.',
    icon: Phone,
  },
  {
    step: '03',
    title: 'Campus Tour',
    desc: 'Visit Little Star Nerkundram to explore our classrooms, play areas, and meet our teachers.',
    icon: MapPin,
  },
  {
    step: '04',
    title: 'Enrollment & Welcome',
    desc: 'Complete simple documentation, submit student details, and receive the welcome admission pack.',
    icon: GraduationCap,
  },
];

const faqs = [
  {
    q: 'What programs are open for 2026–27 admissions?',
    a: 'Admissions are open for Play School / Toddler (2.5 - 3.5 yrs), Nursery LKG (3.5 - 4.5 yrs), UKG (4.5 - 5.5 yrs), Primary Classes (I to V STD), Daycare (8:30 AM to 8 PM), and Evening Tuition.',
  },
  {
    q: 'What documents are required during enrollment?',
    a: 'Parents need to provide child\'s Birth Certificate, Aadhaar card copy, passport size photos, and transfer certificate (if transferring for primary classes).',
  },
  {
    q: 'Can children be admitted mid-academic year?',
    a: 'Yes, mid-year admissions are considered for Play School, Nursery, and Daycare based on seat availability.',
  },
  {
    q: 'What is the student-teacher ratio at Little Star?',
    a: 'We maintain low student-teacher ratios (approx 10:1 in KG) to ensure personalized attention for every child.',
  },
  {
    q: 'How can parents schedule a campus visit?',
    a: 'Parents are welcome to visit our campus at 2, Anna Street, Jaya Lakshmi Nagar, Nerkundram, Chennai Monday to Saturday (9:00 AM to 4:00 PM).',
  },
];

export default function AdmissionsClient() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <>
      {/* ===== ADMISSION PROCESS ===== */}
      <section className={`section-padding ${styles.processSection}`}>
        <div className="container">
          <div className="text-center">
            <span className="badge"><Rocket size={16} style={{display:'inline', marginRight:'4px'}} /> Simple 4-Step Process</span>
            <h2 className="section-title">How to Enroll Your Child at Little Star Nerkundram</h2>
            <p className="section-subtitle">
              We make school admissions transparent, smooth, and welcoming for every family.
            </p>
          </div>

          <div className={styles.stepsGrid}>
            {admissionSteps.map((item, i) => (
              <div key={i} className={styles.stepCard}>
                <div className={styles.stepNum}>{item.step}</div>
                <div className={styles.stepIcon}><item.icon size={48} strokeWidth={1.5} /></div>
                <h3 className={styles.stepTitle}>{item.title}</h3>
                <p className={styles.stepDesc}>{item.desc}</p>
                {i < admissionSteps.length - 1 && <div className={styles.stepArrow}><CheckCircle size={20} /></div>}
              </div>
            ))}
          </div>

          {/* Eligibility Table */}
          <div style={{ marginTop: '50px', background: '#FFF', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <h3 style={{ color: '#4C1D95', textAlign: 'center', marginBottom: '20px', fontSize: '1.4rem' }}>Program Age Eligibility Criteria (2026–27)</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: '#EDE9FE', color: '#4C1D95' }}>
                    <th style={{ padding: '12px 16px' }}>Program</th>
                    <th style={{ padding: '12px 16px' }}>Age Group</th>
                    <th style={{ padding: '12px 16px' }}>Focus &amp; Activities</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #EEE' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>Play School / Toddler</td>
                    <td style={{ padding: '12px 16px' }}>2.5 to 3.5 Years</td>
                    <td style={{ padding: '12px 16px' }}>Sensory play, social interaction, listening skills, motor activities</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #EEE' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>Nursery (LKG &amp; UKG)</td>
                    <td style={{ padding: '12px 16px' }}>3.5 to 5.5 Years</td>
                    <td style={{ padding: '12px 16px' }}>Phonics, math readiness, storytelling, arts, social manners</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #EEE' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>Primary School (I to V STD)</td>
                    <td style={{ padding: '12px 16px' }}>5.5 to 10.5 Years</td>
                    <td style={{ padding: '12px 16px' }}>Core subjects, STEM projects, Karate, Silambam, computer literacy</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid #EEE' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>Star Daycare</td>
                    <td style={{ padding: '12px 16px' }}>2 to 10 Years</td>
                    <td style={{ padding: '12px 16px' }}>8:30 AM – 8:00 PM flexible child care, nap rooms, meals &amp; homework help</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>Star Tuition Centre</td>
                    <td style={{ padding: '12px 16px' }}>Class I to XII</td>
                    <td style={{ padding: '12px 16px' }}>6:00 PM – 8:00 PM evening subject tuition &amp; CBSE Mathematics</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="text-center" style={{ marginTop: '40px' }}>
            <Link href="/contact" className="btn-primary" id="admission-apply-btn">
              <FileText size={18} style={{display:'inline', marginRight:'6px', marginBottom:'-4px'}} /> Submit Admission Enquiry Form
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAQS ===== */}
      <section className={`section-padding ${styles.faqSection}`}>
        <div className="container">
          <div className="text-center">
            <span className="badge"><HelpCircle size={16} style={{display:'inline', marginRight:'4px'}} /> Got Questions?</span>
            <h2 className="section-title">Admissions Frequently Asked Questions</h2>
            <p className="section-subtitle">
              Common questions from parents in Nerkundram, Kodambakkam, Koyambedu, and surrounding Chennai areas.
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

      {/* ===== MAP ===== */}
      <section className={styles.mapSection}>
        <a
          href="https://www.google.com/maps?q=No.2+Anna+main+road,+Jayalakshmi+Nagar,+Nerkundram,+Chennai-107"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mapLink}
        >
          <div className={styles.mapStatic}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.6667!2d80.1915!3d13.0684!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52664fc6e8b4f1%3A0xd6b9e81b3f7f1a2e!2sLITTLE%20STAR%20NURSERY%20%26%20PRIMARY%20SCHOOL!5e0!3m2!1sen!2sin!4v1750420000000!5m2!1sen!2sin"
              className={styles.mapIframe}
              loading="lazy"
              title="Little Star Location Nerkundram"
            />
            <div className={styles.mapOverlay}>
              <p className={styles.mapAddress}>
                No.2 Anna main road, Jayalakshmi Nagar<br />
                Nerkundram, Chennai-107
              </p>
            </div>
          </div>
        </a>
      </section>
    </>
  );
}

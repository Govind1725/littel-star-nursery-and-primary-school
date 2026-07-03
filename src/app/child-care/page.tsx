'use client';

import { useState } from 'react';
import styles from './child-care.module.css';
import Link from 'next/link';

const faqs = [
  { q: 'What are the school timings?', a: 'Our standard hours are 9:00 AM to 3:30 PM. We also offer extended daycare facilities.' },
  { q: 'What is the leave policy?', a: 'Please inform the class teacher via the school diary or app if your child will be absent.' },
  { q: 'How are fee payments handled?', a: 'Fees are collected term-wise. You can pay online or via the admin office.' },
  { q: 'When are parent-teacher meetings?', a: 'PTMs are held at the end of every term, but parents can request an appointment anytime.' },
];

export default function ChildCarePage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (i: number) => setOpenIndex(openIndex === i ? null : i);
  return (
    <>
      {/* ===== HERO ===== */}
      <section className="page-hero">
        <div className="container">
          <h1>Caring for Every Child</h1>
          <p>
            A safe, nurturing, and joyful environment where your child can learn, play, and grow.
          </p>
        </div>
      </section>

      {/* ===== CHILD CARE APPROACH & LEARNING ===== */}
      <section className={`section-padding ${styles.approachSection}`}>
        <div className="container">
          <div className="text-center">
            <span className="badge">Our Approach</span>
            <h2 className="section-title">Nurturing Hearts & Minds</h2>
            <p className="section-subtitle">
              We focus on holistic development through individualized attention and joyful learning.
            </p>
          </div>

          <div className={styles.gridCards}>
            <div className={styles.approachCard}>
              <h3>Individual Attention</h3>
              <p>Every child is unique. Our low student-teacher ratio ensures personalized care.</p>
            </div>
            <div className={styles.approachCard}>
              <h3>Positive Reinforcement</h3>
              <p>We build confidence by celebrating small wins and encouraging effort.</p>
            </div>
            <div className={styles.approachCard}>
              <h3>Social Skill Building</h3>
              <p>Interactive group activities help children learn sharing, empathy, and teamwork.</p>
            </div>
            <div className={styles.approachCard}>
              <h3>Learning Through Play</h3>
              <p>Language, numbers, art, and music are integrated seamlessly into playtime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DAILY ROUTINE ===== */}
      <section className={`section-padding ${styles.scheduleSection}`}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '1200px' }}>
          <div className={styles.routineBadge}>DAILY ROUTINE</div>
          <h2 className={styles.routineTitle}>A Day at Little Star</h2>
          <p className={styles.routineSub}>A balanced schedule of learning, play, and rest.</p>

          <div className={styles.routineTimeline}>
            <div className={styles.timelineLine}></div>
            <div className={styles.timelineCards}>
              {[
                { time: '8:45 AM', title: 'Entry', icon: '/images/routine_entry.png', bg: '#FFDFDF' },
                { time: '9:00 AM', title: 'Prayer start', icon: '/images/routine_prayer.png', bg: '#FFF1B8' },
                { time: '9:15 AM', title: 'Classes start', icon: '/images/routine_classes.png', bg: '#BDECB6' },
                { time: '10:45 – 11:00 AM', title: 'Morning break', icon: '/images/routine_break.png', bg: '#C2DBFF' },
                { time: '12:30 – 1:15 PM', title: 'Lunch break', icon: '/images/routine_lunch.png', bg: '#FFD1D1' },
              ].map((item, i) => (
                <div key={i} className={styles.routineCard}>
                  <div className={styles.routineIconWrapper} style={{ backgroundColor: item.bg }}>
                    <img src={item.icon} alt={item.title} width={64} height={64} className={styles.routineIconImg} />
                  </div>
                  <div className={styles.routineTime}>{item.time}</div>
                  <h3 className={styles.routineCardTitle}>{item.title}</h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== MEAL PLAN & NUTRITION ===== */}
      <section className={`section-padding ${styles.mealSection}`}>
        <div className="container">
          <div className={styles.splitLayout}>
            <div className={styles.splitText}>
              <span className="badge">Nutrition First</span>
              <h2 className="section-title">Daily Meal Plan</h2>
              <p>We provide wholesome, balanced meals to keep your little ones energetic throughout the day.</p>
              
              <div className={styles.mealCards}>
                <div className={styles.mealCard}>
                  <h4>Breakfast</h4>
                  <p>Oats, fresh fruits, idli, or poha.</p>
                </div>
                <div className={styles.mealCard}>
                  <h4>Lunch</h4>
                  <p>Rice/roti, dal, seasonal vegetables, and curd.</p>
                </div>
                <div className={styles.mealCard}>
                  <h4>Snacks</h4>
                  <p>Healthy sprouts, fruit salads, or milk.</p>
                </div>
              </div>
            </div>
            <div className={styles.splitImage}>
              <img src="/images/meal_plan.png" alt="Healthy Preschool Meal" className={styles.photo} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== DRESS CODE & WHAT TO BRING ===== */}
      <section className={`section-padding ${styles.dressSection}`}>
        <div className="container">
          <div className={styles.splitLayoutReverse}>
            <div className={styles.splitText}>
              <span className="badge">Get Ready</span>
              <h2 className="section-title">Dress Code & Essentials</h2>
              <p>Comfort is key. Our uniform is designed to be vibrant and play-friendly.</p>
              
              <ul className={styles.checklist}>
                <li><strong>Uniform:</strong> Yellow t-shirt & Violet bottoms.</li>
                <li><strong>Footwear:</strong> Comfortable velcro shoes & socks.</li>
                <li><strong>What to Bring:</strong>
                  <ul>
                    <li>Water bottle (labeled)</li>
                    <li>Extra pair of clothes</li>
                    <li>Lunch box (if opting out of school meals)</li>
                    <li>School diary</li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className={styles.splitImage}>
              <img src="/images/dress_code.png" alt="Preschool Dress Code" className={styles.photo} />
            </div>
          </div>
        </div>
      </section>

      {/* ===== HEALTH, SAFETY & TRANSPORT ===== */}
      <section className={`section-padding ${styles.safetySection}`}>
        <div className="container">
          <div className={styles.gridCards}>
            <div className={styles.card}>
              <h3>Health & Safety</h3>
              <p>Regular health checks, strict hygiene practices, and immediate emergency contact protocols. Medication is only administered with strict parental consent.</p>
            </div>
            <div className={styles.card}>
              <h3>Transport Information</h3>
              <p>Safe pickup and drop-off timings with verified drivers. Strict parent authorization rules apply for any alternate pickups.</p>
            </div>
            <div className={styles.card}>
              <h3>Daily Updates</h3>
              <p>We share daily photos, activity reports, and progress tracking directly with parents so you never miss a milestone.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== PARENT FAQS ===== */}
      <section className={`section-padding ${styles.faqSection}`}>
        <div className="container">
          <div className="text-center">
            <span className="badge">Quick Answers</span>
            <h2 className="section-title">Parent FAQs</h2>
          </div>
          
          <div className={styles.faqList}>
            {faqs.map((faq, i) => (
              <div key={i} className={`${styles.faqItem} ${openIndex === i ? styles.faqOpen : ''}`}>
                <button className={styles.faqBtn} onClick={() => toggleFaq(i)}>
                  <span>{faq.q}</span>
                  <span className={styles.faqArrow}>{openIndex === i ? '−' : '+'}</span>
                </button>
                <div className={styles.faqAnswer} style={{ maxHeight: openIndex === i ? '200px' : '0' }}>
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

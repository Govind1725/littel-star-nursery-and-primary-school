'use client';

import { useState } from 'react';
import styles from './contact.module.css';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  const contactInfo = [
    { icon: '📍', title: 'Address', lines: ['123 Star Lane, Sunshine Avenue', 'Tamil Nadu 600001, India'] },
    { icon: '📞', title: 'Phone', lines: ['+91 98765 43210', '+91 044-2345-6789'] },
    { icon: '✉️', title: 'Email', lines: ['info@littlestar.edu.in', 'admissions@littlestar.edu.in'] },
    { icon: '🕐', title: 'Office Hours', lines: ['Mon–Fri: 8:00 AM – 5:00 PM', 'Saturday: 9:00 AM – 1:00 PM'] },
  ];

  return (
    <>
      {/* Hero */}
      <section className="page-hero">
        <div className="container">
          <span className="badge">📞 Get in Touch</span>
          <h1>Contact Us</h1>
          <p>We&apos;d love to hear from you! Reach out with any questions about admissions or our programs.</p>
        </div>
      </section>

      <section className={`section-padding ${styles.contactSection}`}>
        <div className="container">
          <div className={styles.contactGrid}>

            {/* Contact Info */}
            <div className={styles.infoCol}>
              <h2 className={styles.infoTitle}>Let&apos;s Connect!</h2>
              <p className={styles.infoDesc}>
                Have questions about admissions, fees, or our programs? Our team is here to help!
              </p>

              <div className={styles.infoCards}>
                {contactInfo.map((info, i) => (
                  <div key={i} className={styles.infoCard}>
                    <div className={styles.infoIcon}>{info.icon}</div>
                    <div>
                      <div className={styles.infoCardTitle}>{info.title}</div>
                      {info.lines.map((line, j) => (
                        <div key={j} className={styles.infoLine}>{line}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Info */}
              <div className={styles.quickInfo}>
                <h3 className={styles.quickTitle}>🎒 Admissions</h3>
                <p>Applications for 2024–25 are currently open. Visit us or fill out the form to get started!</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className={styles.formCol}>
              {submitted ? (
                <div className={styles.successBox}>
                  <div className={styles.successIcon}>🎉</div>
                  <h3>Message Sent!</h3>
                  <p>Thank you for reaching out! We&apos;ll get back to you within 24 hours.</p>
                  <button
                    className="btn-primary"
                    onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                    id="contact-send-another-btn"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit}>
                  <h3 className={styles.formTitle}>Send us a Message ✉️</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">Full Name *</label>
                      <input
                        id="name" name="name" type="text"
                        placeholder="Your full name"
                        value={form.name} onChange={handleChange}
                        required className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email Address *</label>
                      <input
                        id="email" name="email" type="email"
                        placeholder="your@email.com"
                        value={form.email} onChange={handleChange}
                        required className={styles.input}
                      />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="phone">Phone Number</label>
                      <input
                        id="phone" name="phone" type="tel"
                        placeholder="+91 98765 43210"
                        value={form.phone} onChange={handleChange}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="subject">Subject *</label>
                      <select
                        id="subject" name="subject"
                        value={form.subject} onChange={handleChange}
                        required className={styles.input}
                      >
                        <option value="">Select a subject</option>
                        <option value="admission">Admission Inquiry</option>
                        <option value="fees">Fee Structure</option>
                        <option value="curriculum">Curriculum</option>
                        <option value="general">General Inquiry</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="message">Message *</label>
                    <textarea
                      id="message" name="message"
                      placeholder="Tell us how we can help you..."
                      value={form.message} onChange={handleChange}
                      required rows={5} className={`${styles.input} ${styles.textarea}`}
                    />
                  </div>
                  <button
                    type="submit"
                    className={`btn-primary ${styles.submitBtn}`}
                    id="contact-submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className={styles.spinner} /> Sending...</>
                    ) : (
                      <>🚀 Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder */}
      <section className={styles.mapSection}>
        <div className={styles.mapPlaceholder}>
          <div className={styles.mapContent}>
            <div className={styles.mapPin}>📍</div>
            <h3>Find Us Here</h3>
            <p>123 Star Lane, Sunshine Avenue, Tamil Nadu 600001</p>
          </div>
        </div>
      </section>
    </>
  );
}

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
    { icon: '📍', title: 'Address', lines: ['No.2 Anna main road, Jayalakshmi Nagar', 'Nerkundram, Chennai-107'] },
    { icon: '📞', title: 'Phone', lines: ['9941294084'] },
    { icon: '✉️', title: 'Email', lines: ['littlestarnpschoolnerkundram@gmail.com'] },
    { icon: '🕐', title: 'Office Hours', lines: ['Mon–Fri: 9:00 AM – 5:00 PM', 'Saturday: 9:00 AM – 3:00 PM', 'Sunday & Govt. holidays: Holiday'] },
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
                      {info.lines.map((line, j) => {
                        let href = '';
                        if (info.title === 'Phone') href = `tel:${line}`;
                        else if (info.title === 'Email') href = `mailto:${line}`;
                        else if (info.title === 'Address') href = 'https://www.google.com/maps?q=No.2+Anna+main+road,+Jayalakshmi+Nagar,+Nerkundram,+Chennai-107';
                        return href ? (
                          <a key={j} href={href} target="_blank" rel="noopener noreferrer" className={styles.infoLineLink}>{line}</a>
                        ) : (
                          <div key={j} className={styles.infoLine}>{line}</div>
                        );
                      })}
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1!2d80.2707!3d13.0827!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a52664fc6e8b4f1%3A0xd6b9e81b3f7f1a2e!2sLITTLE%20STAR%20NURSERY%20%26%20PRIMARY%20SCHOOL!5e0!3m2!1sen!2sin!4v1750420000000!5m2!1sen!2sin"
              className={styles.mapIframe}
              loading="lazy"
              title="Little Star Location"
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

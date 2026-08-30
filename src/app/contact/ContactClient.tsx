'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import styles from './contact.module.css';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare } from 'lucide-react';

export default function ContactClient() {
  const [form, setForm] = useState({ name: '', dob: '', email: '', phone: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = 'Student name must be at least 2 characters.';
    }

    if (!form.dob) {
      newErrors.dob = 'Please select a date of birth.';
    }

    if (!form.email.trim() || !emailRegex.test(form.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!form.subject) {
      newErrors.subject = 'Please select a subject.';
    }

    if (!form.message.trim() || form.message.trim().length < 5) {
      newErrors.message = 'Message must be at least 5 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form before submitting.');
      return;
    }

    setLoading(true);

    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    } catch (error) {
      console.error('Contact submission API error:', error);
    } finally {
      setLoading(false);
      setSubmitted(true);
      toast.success('Redirecting to WhatsApp to send your inquiry...');

      const whatsappMessage = `*Little Star Nursery & Primary School*
----------------------------------
*Student Name:* ${form.name}
*Date of Birth:* ${form.dob}
*Parent Email:* ${form.email}
*Phone Number:* ${form.phone || 'N/A'}
*Subject / Program:* ${form.subject}
*Message / Details:* ${form.message || 'N/A'}`;

      const whatsappUrl = `https://wa.me/919941294084?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');
    }
  };

  const contactInfo = [
    { icon: MapPin, title: 'School Address', lines: ['No.2 Anna main road, Jayalakshmi Nagar', 'Nerkundram, Chennai, Tamil Nadu 600107'] },
    { icon: Phone, title: 'Phone Number', lines: ['+91 99412 94084'] },
    { icon: Mail, title: 'Email Address', lines: ['littlestarnpschoolnerkundram@gmail.com'] },
    { icon: Clock, title: 'Office Hours', lines: ['Mon–Fri: 9:00 AM – 5:00 PM', 'Saturday: 9:00 AM – 3:00 PM', 'Sunday & Govt. holidays: Holiday'] },
  ];

  return (
    <>
      <section className={`section-padding ${styles.contactSection}`}>
        <div className="container">
          <div className={styles.contactGrid}>

            {/* Contact Info */}
            <div className={styles.infoCol}>
              <span className="badge"><Phone size={16} style={{display: 'inline', marginRight: '4px'}} /> Get in Touch</span>
              <h2 className={styles.infoTitle}>Connect with Little Star Nerkundram</h2>
              <p className={styles.infoDesc}>
                Have questions about Nursery, Primary, Play School, Day Care, or Tuition Centre admissions? Contact our administrative office directly.
              </p>

              <div className={styles.infoCards}>
                {contactInfo.map((info, i) => (
                  <div key={i} className={styles.infoCard}>
                    <div className={styles.infoIcon}><info.icon size={22} /></div>
                    <div>
                      <div className={styles.infoCardTitle}>{info.title}</div>
                      {info.lines.map((line, j) => {
                        let href = '';
                        if (info.title.includes('Phone')) href = `tel:${line.replace(/\s+/g, '')}`;
                        else if (info.title.includes('Email')) href = `mailto:${line}`;
                        else if (info.title.includes('Address')) href = 'https://www.google.com/maps?q=No.2+Anna+main+road,+Jayalakshmi+Nagar,+Nerkundram,+Chennai-107';
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

              {/* Driving Directions & Target Areas */}
              <div className={styles.quickInfo} style={{ marginTop: '24px' }}>
                <h3 className={styles.quickTitle}>📍 Easy Access From Nearby Locality</h3>
                <p style={{ lineHeight: 1.6, color: '#FFFFFF', fontSize: '0.95rem' }}>
                  Conveniently situated in Nerkundram for parents coming from:
                  <br />• <strong style={{ color: '#FFFFFF' }}>Kodambakkam:</strong> ~10 mins via Arcot Road / Koyambedu flyover
                  <br />• <strong style={{ color: '#FFFFFF' }}>Koyambedu &amp; Arumbakkam:</strong> ~5 mins via PH Road &amp; Nerkundram Main Rd
                  <br />• <strong style={{ color: '#FFFFFF' }}>Maduravoyal &amp; Virugambakkam:</strong> ~5-8 mins via Poonamallee High Road
                  <br />• <strong style={{ color: '#FFFFFF' }}>Anna Nagar West &amp; Mogappair:</strong> ~10 mins via Koyambedu junction
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <div className={styles.formCol}>
              {submitted ? (
                <div className={styles.successBox}>
                  <div className={styles.successIcon}>🎉</div>
                  <h3>Message Received!</h3>
                  <p>Thank you for reaching out to Little Star Nursery &amp; Primary School. We will contact you within 24 hours.</p>
                  <button
                    className="btn-primary"
                    onClick={() => { setSubmitted(false); setForm({ name: '', dob: '', email: '', phone: '', subject: '', message: '' }); setErrors({}); }}
                    id="contact-send-another-btn"
                  >
                    Send Another Inquiry
                  </button>
                </div>
              ) : (
                <form className={styles.form} onSubmit={handleSubmit} noValidate>
                  <h3 className={styles.formTitle}>Send an Admission Inquiry ✉️</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name">Student Name *</label>
                      <input
                        id="name" name="name" type="text"
                        placeholder="Student's full name"
                        value={form.name} onChange={handleChange}
                        required className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                      />
                      {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="dob">Date of Birth *</label>
                      <input
                        id="dob" name="dob" type="date"
                        value={form.dob} onChange={handleChange}
                        required className={`${styles.input} ${errors.dob ? styles.inputError : ''}`}
                      />
                      {errors.dob && <span className={styles.errorText}>{errors.dob}</span>}
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">Parent Email *</label>
                      <input
                        id="email" name="email" type="email"
                        placeholder="parent@example.com"
                        value={form.email} onChange={handleChange}
                        required className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                      />
                      {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="phone">Phone Number *</label>
                      <input
                        id="phone" name="phone" type="tel"
                        placeholder="+91 99412 94084"
                        value={form.phone} onChange={handleChange}
                        required className={styles.input}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="subject">Subject / Program of Interest *</label>
                    <select
                      id="subject" name="subject"
                      value={form.subject} onChange={handleChange}
                      required className={`${styles.input} ${errors.subject ? styles.inputError : ''}`}
                    >
                      <option value="">Select a program</option>
                      <option value="nursery">Nursery School (LKG / UKG)</option>
                      <option value="primary">Primary School (Class I - V)</option>
                      <option value="play-school">Play School / Preschool</option>
                      <option value="daycare">Day Care Services (8:30 AM - 8 PM)</option>
                      <option value="tuition">Star Tuition Centre (STD I - XII)</option>
                      <option value="fees">Fee Structure Inquiry</option>
                      <option value="other">General Inquiry</option>
                    </select>
                    {errors.subject && <span className={styles.errorText}>{errors.subject}</span>}
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="message">Message / Details *</label>
                    <textarea
                      id="message" name="message"
                      placeholder="Tell us about your child's age, grade, or any questions..."
                      value={form.message} onChange={handleChange}
                      required rows={4} className={`${styles.input} ${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                    />
                    {errors.message && <span className={styles.errorText}>{errors.message}</span>}
                  </div>
                  <button
                    type="submit"
                    className={`btn-primary ${styles.submitBtn}`}
                    id="contact-submit-btn"
                    disabled={loading}
                    style={{ width: '100%' }}
                  >
                    {loading ? (
                      <><span className={styles.spinner} /> Sending...</>
                    ) : (
                      <><Send size={18} style={{display: 'inline', marginRight: '6px'}} /> Submit Inquiry</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ===== GOOGLE MAPS EMBED ===== */}
      <section className={styles.mapSection}>
        <div className="container" style={{ marginBottom: '16px' }}>
          <h2 className="section-title text-center" style={{ fontSize: '1.75rem' }}>Google Maps Location &amp; Directions</h2>
        </div>
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
              title="Little Star Nursery and Primary School Google Map Nerkundram Chennai"
            />
            <div className={styles.mapOverlay}>
              <p className={styles.mapAddress}>
                <strong>Little Star Nursery &amp; Primary School</strong><br />
                2, Anna Street, near Moogambigai Amman Temple, Jaya Lakshmi Nagar,<br />
                Kothandaraman Nagar, Nerkundram, Chennai - 600107
              </p>
            </div>
          </div>
        </a>
      </section>
    </>
  );
}

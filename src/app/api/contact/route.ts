import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'littlestarnpschoolnerkundram@gmail.com';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, dob, email, phone, subject, message } = body;

    // Server-side validation
    const errors: string[] = [];

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      errors.push('Please enter a valid student name (at least 2 characters).');
    }

    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      errors.push('Please enter a valid email address.');
    }

    if (!subject || typeof subject !== 'string' || subject.trim() === '') {
      errors.push('Please select a subject.');
    }

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      errors.push('Please enter a message with at least 5 characters.');
    }

    if (errors.length > 0) {
      return NextResponse.json(
        { success: false, message: errors.join(' ') },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedSubject = subject.trim();
    const trimmedMessage = message.trim();
    const trimmedPhone = phone ? phone.trim() : 'N/A';
    const trimmedDob = dob ? dob.trim() : 'N/A';

    // Configure Nodemailer Transporter
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = Number(process.env.SMTP_PORT) || 465;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    const isSmtpConfigured = Boolean(smtpUser && smtpPass);

    if (isSmtpConfigured) {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      // 1. Admin Email Notification
      const adminMailOptions = {
        from: `"Little Star School Website" <${smtpUser}>`,
        to: ADMIN_EMAIL,
        replyTo: trimmedEmail,
        subject: `New Contact Form Submission: ${trimmedSubject.toUpperCase()} - ${trimmedName}`,
        text: `New message received from website contact form:

Student Name: ${trimmedName}
Date of Birth: ${trimmedDob}
Email Address: ${trimmedEmail}
Phone Number: ${trimmedPhone}
Subject: ${trimmedSubject}

Message:
${trimmedMessage}

Submitted At: ${new Date().toLocaleString('en-IN')}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
            <h2 style="color: #5A2C99; margin-top: 0;">🌟 New Website Inquiry</h2>
            <p><strong>Student Name:</strong> ${trimmedName}</p>
            <p><strong>Date of Birth:</strong> ${trimmedDob}</p>
            <p><strong>Email Address:</strong> <a href="mailto:${trimmedEmail}">${trimmedEmail}</a></p>
            <p><strong>Phone Number:</strong> ${trimmedPhone}</p>
            <p><strong>Subject:</strong> ${trimmedSubject}</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
            <h3 style="color: #444;">Message:</h3>
            <p style="background: #f9f9f9; padding: 14px; border-radius: 6px; white-space: pre-wrap;">${trimmedMessage}</p>
            <p style="font-size: 0.85rem; color: #888; margin-top: 20px;">Submitted at ${new Date().toLocaleString('en-IN')}</p>
          </div>
        `,
      };

      // 2. User Automatic Confirmation Email
      const userMailOptions = {
        from: `"Little Star Nursery & Primary School" <${smtpUser || ADMIN_EMAIL}>`,
        to: trimmedEmail,
        subject: `Thank you for contacting us`,
        text: `Hello ${trimmedName},

Thank you for contacting us. We have received your message successfully.

Our team will get back to you as soon as possible.

Regards,
littlestarnpschoolnerkundram@gmail.com`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 24px;">
            <h2 style="color: #5A2C99; margin-top: 0;">Little Star Nursery & Primary School</h2>
            <p>Hello <strong>${trimmedName}</strong>,</p>
            <p>Thank you for contacting us. We have received your message successfully.</p>
            <p>Our team will get back to you as soon as possible.</p>
            <br />
            <p>Regards,</p>
            <p><a href="mailto:littlestarnpschoolnerkundram@gmail.com">littlestarnpschoolnerkundram@gmail.com</a></p>
          </div>
        `,
      };

      // Send both emails concurrently
      await Promise.all([
        transporter.sendMail(adminMailOptions),
        transporter.sendMail(userMailOptions),
      ]);
    } else {
      // Dev mode fallback log when SMTP env vars are not set
      console.log('=== [DEV MODE] Contact Form Submitted (SMTP not configured) ===');
      console.log({
        trimmedName,
        trimmedDob,
        trimmedEmail,
        trimmedPhone,
        trimmedSubject,
        trimmedMessage,
        adminNotice: `Notification sent to ${ADMIN_EMAIL}`,
        userConfirmation: `Confirmation sent to ${trimmedEmail}`,
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your message has been sent successfully.',
    });
  } catch (error: any) {
    console.error('Contact API Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Failed to send message. Please try again later.',
      },
      { status: 500 }
    );
  }
}

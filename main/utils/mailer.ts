import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { UNSUBSCRIBE_URL } from '@/lib/constants'; // Adjust the import path as necessary

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '465', 10),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }
  return transporter;
}

interface SendMailOptions {
  to: string;
  name: string;
  message: string;
}

export async function sendContactMail({ to, name, message }: SendMailOptions) {
  const emailOptions = {
    from: `"GiftPool Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Thank you for contacting us',
    text: `Hi ${name},\n\nThank you for your message: "${message}".\n\nWe will get back to you shortly.\n\nBest regards,\nGiftPool Team`,
  };

  const mailer = getTransporter();
  return mailer.sendMail(emailOptions);
}
interface SendNewsletterOptions {
  to: string;
  name: string;
}

export async function sendNewsletterMail({ to, name }: SendNewsletterOptions) {
  const emailOptions = {
    from: `"GiftPool Newsletter" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Thank you for subscribing to our newsletter',
    html: `
      <p>Hi ${name},</p>
      <p>Thank you for subscribing to our newsletter! We're excited to keep you updated with the latest news and offers.</p>
      <p>If you wish to unsubscribe at any time, click the link below:</p>
      <p><a href="${UNSUBSCRIBE_URL}?email=${encodeURIComponent(to)}">Unsubscribe</a></p>
      <p>${UNSUBSCRIBE_URL}?email=${encodeURIComponent(to)}</p>
      <p>Best regards,<br>GiftPool Team</p>
    `,
  };

  const mailer = getTransporter();
  return mailer.sendMail(emailOptions);
}
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

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

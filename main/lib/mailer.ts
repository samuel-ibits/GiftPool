// lib/mailer.ts
import nodemailer from "nodemailer";
import { Attachment } from 'nodemailer/lib/mailer';


const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE,
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

export const notificationTransporter = nodemailer.createTransport({
  service: process.env.NOTIFICATION_SMTP_SERVICE,
  auth: {
    user: process.env.NOTIFICATION_EMAIL_USER, // Your email address
    pass: process.env.NOTIFICATION_EMAIL_PASS, // Your email password or app password
  },
});

export async function sendVerificationEmail(to: string, code: string) {
  const mailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Verify Your Email",
    html: `
      <div style="font-family: sans-serif; padding: 1rem;">
        <h2>🔐 Your OTP Code</h2>
        <p>Use the following code to verify your admin login:</p>
        <h1 style="letter-spacing: 2px;">${code}</h1>
        <p>This code will expire shortly. If you did not request this, please ignore.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

export async function sendWelcomeEmail(to: string) {
  const mailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Welcome to Our Platform",
    html: `<p>Hey,</p><p>Welcome aboard! We're excited to have you.</p>`,
  };

  await transporter.sendMail(mailOptions);
}

export async function resendOtpEmail(to: string, otp: string): Promise<void> {
  const mailOptions = {
    from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Your OTP Verification Code",
    html: `
      <div style="font-family: sans-serif; padding: 1rem;">
        <h2>🔐 Your OTP Code</h2>
        <p>Use the following code to verify your admin login:</p>
        <h1 style="letter-spacing: 2px;">${otp}</h1>
        <p>This code will expire shortly. If you did not request this, please ignore.</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}


export async function sendResetEmail(to: string, url: string): Promise<void> {
  const mailOptions = {
    from: `"GiftPool" <${process.env.NOTIFICATION_EMAIL_USER}>`,
    to,
    subject: "Password Reset",
    html: `
      <div style="font-family: sans-serif; padding: 1rem;">
        <h2>🔐Reset your password</h2> 
        <p>You have requested to change your password, Use the link bellow to reset it</p>
           <div style="text-align: center; margin: 20px 0;">
          <a href=${url}>
    <Button style="display:inline-block; padding: 6px 12px; background-color: #1e40af; color: #fff; font-size: 12px; letter-spacing: 4px; border-radius: 6px;" >
      Reset Password
        </Button>
        </a>
        </div>
        <p> ${url} <p>
          <p style="letter-spacing: 2px;" > This link will expire shortly.If you did not request this, please ignore.</p>
            </div>
              `,
  };

  await transporter.sendMail(mailOptions);
}

export const sendGiftPoolMail = async ({
  to,
  subject,
  html,
  attachments,
}: {
  to: string;
  subject: string;
  html: string;
  attachments?: Attachment[]; // Optional array of attachments
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });

    console.log("GiftPool mail sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending GiftPool mail:", error);
    throw error;
  }
};

export const sendFailureMail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });

    console.log("Failure mail sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending failure mail:", error);
    throw error;
  }
};

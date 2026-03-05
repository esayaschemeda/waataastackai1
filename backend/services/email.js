// services/email.js — Transactional emails via Resend (or SendGrid)
// npm install resend
const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
const FROM   = 'StackAI <noreply@yourdomain.com>';
const APP_URL = process.env.FRONTEND_URL;

async function sendVerificationEmail(email, name, token) {
  await resend.emails.send({
    from: FROM, to: email,
    subject: 'Verify your StackAI account',
    html: `
      <h2>Welcome to StackAI, ${name}!</h2>
      <p>Click the button below to verify your email address.</p>
      <a href="${APP_URL}/verify-email?token=${token}"
         style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin:16px 0">
        Verify Email
      </a>
      <p>This link expires in 24 hours.</p>
    `,
  });
}

async function sendPasswordResetEmail(email, name, token) {
  await resend.emails.send({
    from: FROM, to: email,
    subject: 'Reset your StackAI password',
    html: `
      <h2>Password Reset</h2>
      <p>Hi ${name}, click below to reset your password.</p>
      <a href="${APP_URL}/reset-password?token=${token}"
         style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin:16px 0">
        Reset Password
      </a>
      <p>This link expires in 1 hour. If you didn't request this, ignore this email.</p>
    `,
  });
}

async function sendEnrollmentConfirmation(email, name, courseTitle) {
  await resend.emails.send({
    from: FROM, to: email,
    subject: `You're enrolled in ${courseTitle}!`,
    html: `
      <h2>Enrollment Confirmed 🎉</h2>
      <p>Hi ${name}, you are now enrolled in <strong>${courseTitle}</strong>.</p>
      <a href="${APP_URL}/dashboard"
         style="background:#2563eb;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;display:inline-block;margin:16px 0">
        Start Learning →
      </a>
    `,
  });
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendEnrollmentConfirmation };

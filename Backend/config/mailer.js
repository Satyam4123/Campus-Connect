const nodemailer = require("nodemailer");

const transporter = process.env.SMTP_HOST
  ? nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    })
  : null;

const sendAuthEmail = async ({ to, subject, text }) => {
  if (!transporter || !process.env.MAIL_FROM) {
    throw new Error(
      "Email service is not configured: SMTP_HOST and MAIL_FROM are required",
    );
  }
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
  });
};

module.exports = { sendAuthEmail };

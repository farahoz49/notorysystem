import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASS, // ✅ App Password
    },
  });

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.GMAIL_USER,
    to,
    subject,
    html,
  });
};

import nodemailer, { Transporter } from 'nodemailer';

let transporter: Transporter;

if (process.env.SMTP_PROVIDER === 'outlook') {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, // smtp.office365.com
    port: Number(process.env.EMAIL_PORT), // 587
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
} else if (process.env.SMTP_PROVIDER === 'sendgrid') {
  transporter = nodemailer.createTransport({
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY,
    },
  });
} else {
  throw new Error('SMTP_PROVIDER non configuré ou inconnu');
}

export default transporter;

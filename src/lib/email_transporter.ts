import nodemailer, { Transporter } from 'nodemailer';
console.log(' Entré dans email_transporter.ts');

let transporter: Transporter;
console.log('SMTP CONFIG →', {
  provider: process.env.SMTP_PROVIDER,
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  user: process.env.EMAIL_USER,
});


if (process.env.SMTP_PROVIDER === 'outlook') {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
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
} else if (process.env.SMTP_PROVIDER === 'brevo') {
  transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
}

else {
  throw new Error('SMTP_PROVIDER non configuré ou inconnu');
}

export default transporter;

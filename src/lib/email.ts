import transporter from './email_transporter';

export async function sendVerificationEmail(to: string, subject: string, html: string) {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  };

  return transporter.sendMail(mailOptions);
}

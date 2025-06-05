import env from "@/lib/env";
import { NextResponse } from "next/server";
import * as nodemailer from "nodemailer";

const user = env.EMAIL_USER;
const pass = env.EMAIL_PASSWORD;
const service = env.SMTP_PROVIDER;

const transporter = nodemailer.createTransport({
  service: service,
  auth: {
    user: user,
    pass: pass,
  },
});
export async function POST(request: Request) {
  try {
    const { to, subject, html } = await request.json();
    console.log("subject====>", subject);
    console.log("to====>", to);

    await transporter.sendMail({
      from: "Hello@catchub.com",
      to,
      subject,
      html,
    });

    return NextResponse.json(
      { message: "Email envoyé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi de l'email" },
      { status: 500 }
    );
  }
}

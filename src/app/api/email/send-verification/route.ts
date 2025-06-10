import env from "@/lib/env";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: env.SMTP_PROVIDER,
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASSWORD,
  },
});

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.emailVerification.upsert({
      where: { email },
      update: { token, expiresAt, createdAt: new Date() },
      create: { email, token, expiresAt },
    });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Vérification de votre adresse email</h2>
        <p>Merci de votre inscription ! Pour continuer, veuillez utiliser le code de vérification ci-dessous :</p>
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
          ${token}
        </div>
        <p>Ce code est valable pendant 10 minutes.</p>
        <p>Si vous n'avez pas demandé ce code, vous pouvez ignorer cet email.</p>
      </div>
    `;

    await transporter.sendMail({
      from: "Hello@catchub.com",
      to: email,
      subject: "Vérification de votre adresse email",
      html,
    });

    return NextResponse.json({ message: "Code envoyé" }, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de l'envoi du code:", error);
    return NextResponse.json({ error: "Erreur lors de l'envoi" }, { status: 500 });
  }
}

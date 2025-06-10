import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json();
    if (!email || !token) {
      return NextResponse.json({ valid: false }, { status: 400 });
    }

    const record = await prisma.emailVerification.findUnique({ where: { email } });

    const valid = !!record && record.token === token && record.expiresAt > new Date();

    return NextResponse.json({ valid });
  } catch (error) {
    console.error("Erreur lors de la vérification du code:", error);
    return NextResponse.json({ error: "Erreur lors de la vérification" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: "Email et code requis." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.otpCode || !user.otpExpiry) {
      return NextResponse.json(
        { success: false, message: "Aucun code enregistré pour cet utilisateur." },
        { status: 404 }
      );
    }

    if (user.otpCode !== code) {
      return NextResponse.json(
        { success: false, message: "Code invalide." },
        { status: 401 }
      );
    }

    if (user.otpExpiry < new Date()) {
      return NextResponse.json(
        { success: false, message: "Code expiré." },
        { status: 410 }
      );
    }

    // ✅ Si tout est bon : nettoyage + confirmation
    await prisma.user.update({
      where: { email },
      data: {
        otpCode: null,
        otpExpiry: null,
         emailVerified: true, 
      },
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Erreur vérification OTP :", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur." },
      { status: 500 }
    );
  }
}

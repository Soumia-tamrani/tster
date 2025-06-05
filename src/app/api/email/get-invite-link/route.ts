import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret";

function getUserFromToken(token: any) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
}

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "Utilisateur non autorisé (pas de token)" },
      { status: 401 }
    );
  }

  const decoded = getUserFromToken(token) as any;
  if (!decoded || !decoded.email) {
    return NextResponse.json(
      { error: "Token invalide ou expiré" },
      { status: 401 }
    );
  }

  const { email  } = decoded as any;
  const professionnel = await prisma.professionnel.findUnique({
    where: { email },
  });
  const pme = await prisma.pme.findUnique({ where: { email } });

  if (!professionnel && !pme) {
    return NextResponse.json(
      { error: "Utilisateur non trouvé." },
      { status: 404 }
    );
  }

  const inviteLink = `http://localhost:3000/?ref=${encodeURIComponent(email)}`;

  return NextResponse.json({ link: inviteLink });
}

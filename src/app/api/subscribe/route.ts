// app/api/subscribe/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    let user = await prisma.user.findUnique({
      where: { Email: email },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          Email: email,
          Prénom: 'Unknown',
          Nom: 'Unknown',
          Téléphone_mobile: '', // Provide a default or placeholder value
          role: 'PROFESSIONAL',
          sector: 'AUTRE',
          subscribedToNewsletter: true,
        },
      });
    } else {
      user = await prisma.user.update({
        where: { Email: email },
        data: { subscribedToNewsletter: true },
      });
    }

    return NextResponse.json({ message: 'Subscription successful' }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'Error subscribing to newsletter' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
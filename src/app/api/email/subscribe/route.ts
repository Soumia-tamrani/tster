import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email } = await req.json();

  try {
    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "Vous devez vous inscrire avant de pouvoir vous abonner à la newsletter.",
          redirectToRegister: true,
        },
        { status: 403 }
      );
    }

    await prisma.user.update({
      where: { email: email },
      data: { subscribedToNewsletter: true },
    });

    return NextResponse.json(
      { message: "Subscription successful" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { message: "Error subscribing to newsletter" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

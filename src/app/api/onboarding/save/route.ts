import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    console.log("data from the front====>", data);
    const {
      firstName,
      lastName,
      email,
      phone,
      city,
      country,
      role,
      referralSource,
      secteur,
      centreInteret,
      companyName,
      companySize,
      roleInCompany,
      besoin,
      site,
    } = data;

    let resolvedParrainId = null;
    if (data.referrerEmail) {
      const referrer = await prisma.user.findUnique({
        where: { email: data.referrerEmail },
      });
      if (referrer) {
        resolvedParrainId = referrer.id;
      }
    }

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        city,
        country,
        role,
        referralSource: referralSource || null,
        parrainId: resolvedParrainId,
        createdAt: new Date(),
      },
    });

    if (role === "PROFESSIONAL") {
      await prisma.professionalProfile.create({
        data: {
          userId: user.id,
          secteur,
          centreInteret,
        },
      });
    } else if (role === "ENTREPRISE") {
      await prisma.entrepriseProfile.create({
        data: {
          userId: user.id,
          companyName,
          companySize,
          roleInCompany,
          secteur,
          besoin: besoin || [],
          site,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "User data saved successfully",
      userId: user.id,
    });
  } catch (error) {
    console.error("Error saving user data:", error);
    return NextResponse.json(
      { error: "Failed to save user data" },
      { status: 500 }
    );
  }
}

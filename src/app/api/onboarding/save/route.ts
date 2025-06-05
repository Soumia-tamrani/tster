import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      country,
      city,
      referrerEmail,
      referrerType,
      // Additional fields from other steps
      sector,
      professionalInterests,
      // Company specific fields
      companyName,
      companySize,
      companyNeeds,
      companyChallenges,
      companyWebsite,
      mainNeed,
      otherSector,
      profileType,
    } = data;

    // Find referrer if exists
    let parrainId = null;
    if (referrerEmail) {
      const referrer = await prisma.user.findUnique({
        where: { Email: referrerEmail },
        include: {
          _count: {
            select: { filleuls: true },
          },
        },
      });

      if (referrer) {
        parrainId = referrer.id;

        // Update referrer's rewards based on number of referrals
        const referralCount = referrer._count.filleuls;

        // Example reward tiers
        if (referralCount === 0) {
          // First referral - give basic reward
          await prisma.user.update({
            where: { id: referrer.id },
            data: {
              // Add your reward logic here
              // For example: rewardPoints: { increment: 100 }
            },
          });
        } else if (referralCount === 4) {
          // Fifth referral - give premium reward
          await prisma.user.update({
            where: { id: referrer.id },
            data: {
              // Add your premium reward logic here
            },
          });
        }
      }
    }

    // Create user with basic info
    const user = await prisma.user.create({
      data: {
        Prénom: firstName,
        Nom: lastName,
        Email: email,
        Téléphone_mobile: phone,
        role: profileType === "entreprise" ? "BUSINESS" : "PROFESSIONAL",
        city: city,
        country: country,
        sector: sector || "AUTRE",
        emailVerified: true,
        parrainId: parrainId,
        createdAt: new Date(),
        registrationDate: new Date(),
      },
    });

    // Create additional details based on profile type
    if (profileType === "entreprise") {
      await prisma.companyDetail.create({
        data: {
          userId: user.id,
          companyName: companyName,
          companySize: companySize,
          companyNeeds: companyNeeds,
          companyChallenges: companyChallenges,
          companyWebsite: companyWebsite,
          mainNeed: mainNeed,
          otherSector: otherSector,
          city: city,
          country: country,
        },
      });
    } else {
      await prisma.professionalDetail.create({
        data: {
          userId: user.id,
          professionalInterests: professionalInterests,
          city: city,
          country: country,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "User data saved successfully",
      userId: user.id,
      referralCount: parrainId
        ? (
            await prisma.user.findUnique({
              where: { id: parrainId },
              include: { _count: { select: { filleuls: true } } },
            })
          )?._count.filleuls
        : 0,
    });
  } catch (error) {
    console.error("Error saving user data:", error);
    return NextResponse.json(
      { error: "Failed to save user data" },
      { status: 500 }
    );
  }
}

import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

function toCompanySizeEnum(val: string | undefined): string | undefined {
  if (!val) return undefined;
  const map: Record<string, string> = {
    startup: "STARTUP",
    pme: "PME",
    grande_entreprise: "GRANDE_ENTREPRISE",
    STARTUP: "STARTUP",
    PME: "PME",
    GRANDE_ENTREPRISE: "GRANDE_ENTREPRISE",
  };
  return map[val.toLowerCase()] || undefined;
}

function toCompanyNeedsEnum(arr: string[] | undefined): string[] {
  if (!arr) return [];
  return arr
    .map((v: string) => {
      if (!v) return undefined;
      const map: Record<string, string> = {
        presentation_marque: "PRESENTATION_MARQUE",
        reseau_b2b: "RESEAU_B2B",
        talents_qualifies: "TALENTS_QUALIFIES",
        tableaux_bord: "TABLEAUX_BORD",
        insights_sectoriels: "INSIGHTS_SECTORIELS",
        offres_emploi: "OFFRES_EMPLOI",
        mentors_sectoriels: "MENTORS_SECTORIELS",
        freelance_hub: "FREELANCE_HUB",
        PRESENTATION_MARQUE: "PRESENTATION_MARQUE",
        RESEAU_B2B: "RESEAU_B2B",
        TALENTS_QUALIFIES: "TALENTS_QUALIFIES",
        TABLEAUX_BORD: "TABLEAUX_BORD",
        INSIGHTS_SECTORIELS: "INSIGHTS_SECTORIELS",
        OFFRES_EMPLOI: "OFFRES_EMPLOI",
        MENTORS_SECTORIELS: "MENTORS_SECTORIELS",
        FREELANCE_HUB: "FREELANCE_HUB",
      };
      return map[v.toLowerCase()] || undefined;
    })
    .filter(Boolean) as string[];
}

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
      });
      if (referrer) {
        parrainId = referrer.id;
      }
    }

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

    if (profileType === "entreprise") {
      await prisma.companyDetail.create({
        data: {
          userId: user.id,
          companyName: companyName,
          companySize: toCompanySizeEnum(companySize) as any,
          companyNeeds: toCompanyNeedsEnum(companyNeeds) as any,
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
    });
  } catch (error) {
    console.error("Error saving user data:", error);
    return NextResponse.json(
      { error: "Failed to save user data" },
      { status: 500 }
    );
  }
}

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PROFESSIONAL', 'BUSINESS');

-- CreateEnum
CREATE TYPE "Secteur" AS ENUM ('TECHNOLOGIE', 'AGRO_HALIEUTIQUE', 'COMMERCE', 'FINANCE', 'SANTE', 'ÉNERGIE_DURABILITE', 'TRANSPORT', 'INDUSTRIE', 'COMMERCE_DISTRIBUTION', 'SERVICES_PROFESSIONNELS', 'TOURISME', 'MEDIA_DIVERTISSEMENT', 'EDUCATION', 'AUTRE');

-- CreateEnum
CREATE TYPE "ProfessionalInterest" AS ENUM ('MENTORAT', 'RESEAUTAGE', 'EMPLOI', 'FORMATION', 'AUTRE');

-- CreateEnum
CREATE TYPE "CompanyNeed" AS ENUM ('PRESENTATION_MARQUE', 'RESEAU_B2B', 'TALENTS_QUALIFIES', 'TABLEAUX_BORD', 'INSIGHTS_SECTORIELS', 'OFFRES_EMPLOI', 'MENTORS_SECTORIELS', 'FREELANCE_HUB');

-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('STARTUP', 'PME', 'GRANDE_ENTREPRISE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "Prénom" TEXT NOT NULL,
    "Nom" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Téléphone_mobile" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "city" TEXT,
    "country" TEXT,
    "sector" "Secteur" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "emailVerified" BOOLEAN,
    "subscribedToNewsletter" BOOLEAN NOT NULL DEFAULT false,
    "registeredForTrial" BOOLEAN NOT NULL DEFAULT false,
    "registrationDate" TIMESTAMP(3),
    "referralSource" TEXT,
    "ipAddress" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "parrainId" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalDetail" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "professionalInterests" "ProfessionalInterest"[] DEFAULT ARRAY[]::"ProfessionalInterest"[],
    "professionalChallenges" TEXT,
    "city" TEXT,
    "country" TEXT,

    CONSTRAINT "ProfessionalDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyDetail" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companySize" "CompanySize" NOT NULL,
    "companyNeeds" "CompanyNeed"[],
    "companyChallenges" TEXT,
    "city" TEXT,
    "country" TEXT,
    "companyDescription" TEXT,
    "companyWebsite" TEXT,
    "companyFoundingYear" TEXT,
    "mainNeed" TEXT,
    "otherSector" TEXT,

    CONSTRAINT "CompanyDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CookieConsent" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT NOT NULL,
    "consentStatus" TEXT NOT NULL,
    "consentDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CookieConsent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "User_Téléphone_mobile_key" ON "User"("Téléphone_mobile");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalDetail_userId_key" ON "ProfessionalDetail"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CompanyDetail_userId_key" ON "CompanyDetail"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_parrainId_fkey" FOREIGN KEY ("parrainId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalDetail" ADD CONSTRAINT "ProfessionalDetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompanyDetail" ADD CONSTRAINT "CompanyDetail_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

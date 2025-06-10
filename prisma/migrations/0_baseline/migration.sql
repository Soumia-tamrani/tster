-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('PROFESSIONAL', 'ENTREPRISE');

-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('STARTUP', 'PME', 'GRANDE_ENTREPRISE');

-- CreateEnum
CREATE TYPE "Secteur" AS ENUM ('TECHNOLOGIE', 'AGRO_HALIEUTIQUE', 'COMMERCE', 'FINANCE', 'SANTE', 'ENERGIE_DURABILITE', 'TRANSPORT', 'INDUSTRIE', 'COMMERCE_DISTRIBUTION', 'SERVICES_PROFESSIONNELS', 'TOURISME', 'MEDIA_DIVERTISSEMENT', 'EDUCATION', 'AUTRE');

-- CreateEnum
CREATE TYPE "ReferralSource" AS ENUM ('RESEAUX_SOCIAUX', 'RECHERCHE_EN_LIGNE', 'RECOMMANDATION', 'PUBLICITE', 'AUTRE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "referralSource" "ReferralSource",
    "parrainId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subscribedToNewsletter" BOOLEAN NOT NULL DEFAULT false,
    "ipAddress" TEXT,
    "registeredForTrial" BOOLEAN NOT NULL DEFAULT false,
    "registrationDate" TIMESTAMP(3),
    "emailVerified" BOOLEAN,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProfessionalProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "secteur" "Secteur" NOT NULL,
    "centreInteret" TEXT NOT NULL,

    CONSTRAINT "ProfessionalProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntrepriseProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companySize" "CompanySize" NOT NULL,
    "roleInCompany" TEXT NOT NULL,
    "secteur" "Secteur" NOT NULL,
    "besoin" TEXT NOT NULL,
    "site" TEXT,

    CONSTRAINT "EntrepriseProfile_pkey" PRIMARY KEY ("id")
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
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "ProfessionalProfile_userId_key" ON "ProfessionalProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EntrepriseProfile_userId_key" ON "EntrepriseProfile"("userId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_parrainId_fkey" FOREIGN KEY ("parrainId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfessionalProfile" ADD CONSTRAINT "ProfessionalProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntrepriseProfile" ADD CONSTRAINT "EntrepriseProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


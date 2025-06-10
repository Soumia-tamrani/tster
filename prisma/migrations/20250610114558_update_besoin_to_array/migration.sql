/*
  Warnings:

  - The `besoin` column on the `EntrepriseProfile` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `updatedAt` to the `EntrepriseProfile` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `secteur` on the `EntrepriseProfile` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `site` on table `EntrepriseProfile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "EntrepriseProfile" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "secteur",
ADD COLUMN     "secteur" TEXT NOT NULL,
DROP COLUMN "besoin",
ADD COLUMN     "besoin" TEXT[],
ALTER COLUMN "site" SET NOT NULL;

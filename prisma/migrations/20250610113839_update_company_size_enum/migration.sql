/*
  Warnings:

  - The values [STARTUP,PME] on the enum `CompanySize` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "CompanySize_new" AS ENUM ('PETITE_ENTREPRISE', 'ENTREPRISE_CROISSANCE', 'MOYENNE_ENTREPRISE', 'GRANDE_ENTREPRISE');
ALTER TABLE "EntrepriseProfile" ALTER COLUMN "companySize" TYPE "CompanySize_new" USING ("companySize"::text::"CompanySize_new");
ALTER TYPE "CompanySize" RENAME TO "CompanySize_old";
ALTER TYPE "CompanySize_new" RENAME TO "CompanySize";
DROP TYPE "CompanySize_old";
COMMIT;

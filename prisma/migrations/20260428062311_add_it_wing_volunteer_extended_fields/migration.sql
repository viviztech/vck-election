/*
  Warnings:

  - Made the column `name` on table `it_wing_volunteers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "it_wing_volunteers" ADD COLUMN     "address" TEXT,
ADD COLUMN     "availability" TEXT,
ADD COLUMN     "canTravel" BOOLEAN,
ADD COLUMN     "dob" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "emergencyName" TEXT,
ADD COLUMN     "emergencyPhone" TEXT,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "followers" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "hearAboutUs" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "itSkills" TEXT[],
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "pincode" TEXT,
ADD COLUMN     "primaryDevice" TEXT,
ADD COLUMN     "priorExperience" TEXT,
ADD COLUMN     "softwareTools" TEXT,
ADD COLUMN     "town" TEXT,
ADD COLUMN     "twitterX" TEXT,
ADD COLUMN     "vckMember" BOOLEAN,
ADD COLUMN     "voterId" TEXT,
ADD COLUMN     "whatsapp" TEXT,
ADD COLUMN     "yearsExp" INTEGER,
ADD COLUMN     "youtube" TEXT,
ALTER COLUMN "name" SET NOT NULL;

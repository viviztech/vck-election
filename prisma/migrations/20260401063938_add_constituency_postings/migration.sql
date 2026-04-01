-- CreateEnum
CREATE TYPE "BodyType" AS ENUM ('MAIN_BODY', 'SUB_BODY');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateTable
CREATE TABLE "posting_types" (
    "id" TEXT NOT NULL,
    "nameTamil" TEXT NOT NULL,
    "nameEnglish" TEXT NOT NULL,
    "bodyType" "BodyType" NOT NULL DEFAULT 'MAIN_BODY',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "posting_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "constituency_members" (
    "id" TEXT NOT NULL,
    "constituencyId" TEXT NOT NULL,
    "postingTypeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "age" INTEGER,
    "gender" "Gender",
    "contact" TEXT NOT NULL,
    "alternateContact" TEXT,
    "email" TEXT,
    "partyMembershipId" TEXT,
    "photoKey" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "x" TEXT,
    "whatsapp" TEXT,
    "youtube" TEXT,
    "linkedin" TEXT,
    "telegram" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "constituency_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "posting_types_bodyType_idx" ON "posting_types"("bodyType");

-- CreateIndex
CREATE INDEX "constituency_members_constituencyId_idx" ON "constituency_members"("constituencyId");

-- CreateIndex
CREATE INDEX "constituency_members_postingTypeId_idx" ON "constituency_members"("postingTypeId");

-- AddForeignKey
ALTER TABLE "constituency_members" ADD CONSTRAINT "constituency_members_constituencyId_fkey" FOREIGN KEY ("constituencyId") REFERENCES "constituencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "constituency_members" ADD CONSTRAINT "constituency_members_postingTypeId_fkey" FOREIGN KEY ("postingTypeId") REFERENCES "posting_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

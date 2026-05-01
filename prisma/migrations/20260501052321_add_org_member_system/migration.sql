-- CreateEnum
CREATE TYPE "LocalUnitType" AS ENUM ('BLOCK', 'TOWN_PANCHAYAT', 'WARD');

-- AlterEnum
ALTER TYPE "BodyType" ADD VALUE 'LOCAL';

-- AlterTable
ALTER TABLE "constituencies" ADD COLUMN     "parliamentaryConstituencyId" TEXT;

-- CreateTable
CREATE TABLE "parliamentary_constituencies" (
    "id" TEXT NOT NULL,
    "nameTamil" TEXT NOT NULL,
    "nameEnglish" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "parliamentary_constituencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "local_units" (
    "id" TEXT NOT NULL,
    "type" "LocalUnitType" NOT NULL,
    "nameTamil" TEXT NOT NULL,
    "nameEnglish" TEXT NOT NULL,
    "constituencyId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "local_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "org_members" (
    "id" TEXT NOT NULL,
    "stateLevel" BOOLEAN NOT NULL DEFAULT false,
    "parliamentaryConstituencyId" TEXT,
    "districtId" TEXT,
    "constituencyId" TEXT,
    "localUnitId" TEXT,
    "wingId" TEXT,
    "postingTypeId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "age" INTEGER,
    "gender" "Gender",
    "contact" TEXT,
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

    CONSTRAINT "org_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "parliamentary_constituencies_code_key" ON "parliamentary_constituencies"("code");

-- CreateIndex
CREATE INDEX "local_units_constituencyId_idx" ON "local_units"("constituencyId");

-- CreateIndex
CREATE INDEX "local_units_type_idx" ON "local_units"("type");

-- CreateIndex
CREATE INDEX "org_members_stateLevel_idx" ON "org_members"("stateLevel");

-- CreateIndex
CREATE INDEX "org_members_parliamentaryConstituencyId_idx" ON "org_members"("parliamentaryConstituencyId");

-- CreateIndex
CREATE INDEX "org_members_districtId_idx" ON "org_members"("districtId");

-- CreateIndex
CREATE INDEX "org_members_constituencyId_idx" ON "org_members"("constituencyId");

-- CreateIndex
CREATE INDEX "org_members_localUnitId_idx" ON "org_members"("localUnitId");

-- CreateIndex
CREATE INDEX "org_members_wingId_idx" ON "org_members"("wingId");

-- CreateIndex
CREATE INDEX "org_members_postingTypeId_idx" ON "org_members"("postingTypeId");

-- CreateIndex
CREATE INDEX "constituencies_parliamentaryConstituencyId_idx" ON "constituencies"("parliamentaryConstituencyId");

-- AddForeignKey
ALTER TABLE "constituencies" ADD CONSTRAINT "constituencies_parliamentaryConstituencyId_fkey" FOREIGN KEY ("parliamentaryConstituencyId") REFERENCES "parliamentary_constituencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "local_units" ADD CONSTRAINT "local_units_constituencyId_fkey" FOREIGN KEY ("constituencyId") REFERENCES "constituencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_members" ADD CONSTRAINT "org_members_parliamentaryConstituencyId_fkey" FOREIGN KEY ("parliamentaryConstituencyId") REFERENCES "parliamentary_constituencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_members" ADD CONSTRAINT "org_members_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_members" ADD CONSTRAINT "org_members_constituencyId_fkey" FOREIGN KEY ("constituencyId") REFERENCES "constituencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_members" ADD CONSTRAINT "org_members_localUnitId_fkey" FOREIGN KEY ("localUnitId") REFERENCES "local_units"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_members" ADD CONSTRAINT "org_members_wingId_fkey" FOREIGN KEY ("wingId") REFERENCES "party_wings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_members" ADD CONSTRAINT "org_members_postingTypeId_fkey" FOREIGN KEY ("postingTypeId") REFERENCES "posting_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "OcrStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'MANUAL');

-- CreateEnum
CREATE TYPE "ParentType" AS ENUM ('FATHER', 'MOTHER');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "image" TEXT,
    "passwordHash" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "districts" (
    "id" TEXT NOT NULL,
    "nameTamil" TEXT NOT NULL,
    "nameEnglish" TEXT NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "districts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "constituencies" (
    "id" TEXT NOT NULL,
    "nameTamil" TEXT NOT NULL,
    "nameEnglish" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "districtId" TEXT NOT NULL,

    CONSTRAINT "constituencies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "form_entries" (
    "id" TEXT NOT NULL,
    "serialNumber" TEXT,
    "feeReceiptNumber" TEXT,
    "districtId" TEXT,
    "constituencyId" TEXT,
    "rawDistrictText" TEXT,
    "rawConstituencyText" TEXT,
    "name" TEXT,
    "parentName" TEXT,
    "parentType" "ParentType",
    "address" TEXT,
    "contactNumber" TEXT,
    "yearJoinedParty" INTEGER,
    "partyPosition" TEXT,
    "entryDate" TIMESTAMP(3),
    "entryPlace" TEXT,
    "ocrStatus" "OcrStatus" NOT NULL DEFAULT 'PENDING',
    "ocrJobId" TEXT,
    "ocrConfidenceScore" DOUBLE PRECISION,
    "ocrRawResponse" JSONB,
    "ocrProcessedAt" TIMESTAMP(3),
    "ocrErrorMessage" TEXT,
    "imageUrl" TEXT NOT NULL,
    "imageKey" TEXT NOT NULL,
    "imageMimeType" TEXT NOT NULL,
    "imageSizeBytes" INTEGER,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "verifiedById" TEXT,
    "lastEditedAt" TIMESTAMP(3),
    "submittedById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "form_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "changes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "districts_nameTamil_key" ON "districts"("nameTamil");

-- CreateIndex
CREATE UNIQUE INDEX "districts_nameEnglish_key" ON "districts"("nameEnglish");

-- CreateIndex
CREATE UNIQUE INDEX "districts_code_key" ON "districts"("code");

-- CreateIndex
CREATE UNIQUE INDEX "constituencies_code_key" ON "constituencies"("code");

-- CreateIndex
CREATE INDEX "constituencies_districtId_idx" ON "constituencies"("districtId");

-- CreateIndex
CREATE UNIQUE INDEX "constituencies_nameTamil_districtId_key" ON "constituencies"("nameTamil", "districtId");

-- CreateIndex
CREATE UNIQUE INDEX "form_entries_ocrJobId_key" ON "form_entries"("ocrJobId");

-- CreateIndex
CREATE UNIQUE INDEX "form_entries_imageKey_key" ON "form_entries"("imageKey");

-- CreateIndex
CREATE INDEX "form_entries_submittedById_idx" ON "form_entries"("submittedById");

-- CreateIndex
CREATE INDEX "form_entries_districtId_idx" ON "form_entries"("districtId");

-- CreateIndex
CREATE INDEX "form_entries_constituencyId_idx" ON "form_entries"("constituencyId");

-- CreateIndex
CREATE INDEX "form_entries_ocrStatus_idx" ON "form_entries"("ocrStatus");

-- CreateIndex
CREATE INDEX "form_entries_name_idx" ON "form_entries"("name");

-- CreateIndex
CREATE INDEX "form_entries_serialNumber_idx" ON "form_entries"("serialNumber");

-- CreateIndex
CREATE INDEX "form_entries_createdAt_idx" ON "form_entries"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_entryId_idx" ON "audit_logs"("entryId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "constituencies" ADD CONSTRAINT "constituencies_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_entries" ADD CONSTRAINT "form_entries_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "districts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_entries" ADD CONSTRAINT "form_entries_constituencyId_fkey" FOREIGN KEY ("constituencyId") REFERENCES "constituencies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "form_entries" ADD CONSTRAINT "form_entries_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "form_entries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

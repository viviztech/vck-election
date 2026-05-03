-- CreateEnum
CREATE TYPE "ElectionType" AS ENUM ('STATE', 'PARLIAMENT', 'LOCAL');

-- CreateEnum
CREATE TYPE "ResultStatus" AS ENUM ('COUNTING', 'LEADING', 'TRAILING', 'DECLARED');

-- CreateTable
CREATE TABLE "election_results" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "electionType" "ElectionType" NOT NULL DEFAULT 'STATE',
    "constituencyId" TEXT NOT NULL,
    "candidateName" TEXT NOT NULL,
    "candidatePhoto" TEXT,
    "partySymbol" TEXT,
    "vckVotes" INTEGER,
    "totalVotes" INTEGER,
    "winMargin" INTEGER,
    "isWon" BOOLEAN NOT NULL DEFAULT false,
    "status" "ResultStatus" NOT NULL DEFAULT 'COUNTING',
    "rank1CandidateName" TEXT,
    "rank1Votes" INTEGER,
    "updatedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "election_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "election_results_year_electionType_idx" ON "election_results"("year", "electionType");

-- CreateIndex
CREATE INDEX "election_results_constituencyId_idx" ON "election_results"("constituencyId");

-- CreateIndex
CREATE UNIQUE INDEX "election_results_year_electionType_constituencyId_key" ON "election_results"("year", "electionType", "constituencyId");

-- AddForeignKey
ALTER TABLE "election_results" ADD CONSTRAINT "election_results_constituencyId_fkey" FOREIGN KEY ("constituencyId") REFERENCES "constituencies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "election_results" ADD CONSTRAINT "election_results_updatedById_fkey" FOREIGN KEY ("updatedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

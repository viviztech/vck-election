-- AlterTable
ALTER TABLE "election_results" ADD COLUMN     "opponentParty" TEXT,
ADD COLUMN     "opponentPhoto" TEXT;

-- CreateTable
CREATE TABLE "election_comments" (
    "id" TEXT NOT NULL,
    "electionResultId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "isApproved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "election_comments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "election_comments_electionResultId_idx" ON "election_comments"("electionResultId");

-- CreateIndex
CREATE INDEX "election_comments_isApproved_idx" ON "election_comments"("isApproved");

-- AddForeignKey
ALTER TABLE "election_comments" ADD CONSTRAINT "election_comments_electionResultId_fkey" FOREIGN KEY ("electionResultId") REFERENCES "election_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

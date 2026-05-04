-- AlterTable
ALTER TABLE "election_results" ADD COLUMN     "rank2CandidateName" TEXT,
ADD COLUMN     "rank2Party" TEXT,
ADD COLUMN     "rank2Photo" TEXT,
ADD COLUMN     "rank2Votes" INTEGER;

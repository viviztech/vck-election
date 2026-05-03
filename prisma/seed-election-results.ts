import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

// Exact constituency IDs from the database — 8 VCK-won seats, 2026 TN State Assembly
const VCK_RESULTS = [
  {
    constituencyId: "cmnfj5ok800773cuu68x3tgmf", // Cheyyur, Chengalpattu
    candidateName: "VCK வேட்பாளர்",
    vckVotes: null,
    totalVotes: null,
    winMargin: null,
    isWon: true,
    status: "DECLARED" as const,
    rank1CandidateName: null,
    rank1Votes: null,
    opponentParty: null,
  },
  {
    constituencyId: "cmnfj5ok800763cuuvd2bcbqe", // Thiruporur, Chengalpattu
    candidateName: "VCK வேட்பாளர்",
    vckVotes: null,
    totalVotes: null,
    winMargin: null,
    isWon: true,
    status: "DECLARED" as const,
    rank1CandidateName: null,
    rank1Votes: null,
    opponentParty: null,
  },
  {
    constituencyId: "cmnfj5ok7004n3cuubxt8csnt", // Kattumannarkoil, Cuddalore
    candidateName: "VCK வேட்பாளர்",
    vckVotes: null,
    totalVotes: null,
    winMargin: null,
    isWon: true,
    status: "DECLARED" as const,
    rank1CandidateName: null,
    rank1Votes: null,
    opponentParty: null,
  },
  {
    constituencyId: "cmnfj5ok7004i3cuuhf1j45ls", // Panruti, Cuddalore
    candidateName: "VCK வேட்பாளர்",
    vckVotes: null,
    totalVotes: null,
    winMargin: null,
    isWon: true,
    status: "DECLARED" as const,
    rank1CandidateName: null,
    rank1Votes: null,
    opponentParty: null,
  },
  {
    constituencyId: "cmnfj5ok7006w3cuusv551syn", // Kallakurichi, Kallakurichi
    candidateName: "VCK வேட்பாளர்",
    vckVotes: null,
    totalVotes: null,
    winMargin: null,
    isWon: true,
    status: "DECLARED" as const,
    rank1CandidateName: null,
    rank1Votes: null,
    opponentParty: null,
  },
  {
    constituencyId: "cmnfj5ok7005o3cuuubqrhl2o", // Periyakulam, Theni
    candidateName: "VCK வேட்பாளர்",
    vckVotes: null,
    totalVotes: null,
    winMargin: null,
    isWon: true,
    status: "DECLARED" as const,
    rank1CandidateName: null,
    rank1Votes: null,
    opponentParty: null,
  },
  {
    constituencyId: "cmnfj5ok6002m3cuu8wwt9lb8", // Tindivanam, Viluppuram
    candidateName: "VCK வேட்பாளர்",
    vckVotes: null,
    totalVotes: null,
    winMargin: null,
    isWon: true,
    status: "DECLARED" as const,
    rank1CandidateName: null,
    rank1Votes: null,
    opponentParty: null,
  },
  {
    constituencyId: "cmnfj5ok8007d3cuundsrgq4j", // Arakkonam, Ranipet
    candidateName: "VCK வேட்பாளர்",
    vckVotes: null,
    totalVotes: null,
    winMargin: null,
    isWon: true,
    status: "DECLARED" as const,
    rank1CandidateName: null,
    rank1Votes: null,
    opponentParty: null,
  },
];

async function main() {
  console.log("Seeding 8 VCK election results...");

  for (const r of VCK_RESULTS) {
    const constituency = await prisma.constituency.findUnique({
      where: { id: r.constituencyId },
      select: { nameEnglish: true },
    });

    await prisma.electionResult.upsert({
      where: {
        year_electionType_constituencyId: {
          year: 2026,
          electionType: "STATE",
          constituencyId: r.constituencyId,
        },
      },
      create: {
        year: 2026,
        electionType: "STATE",
        constituencyId: r.constituencyId,
        candidateName: r.candidateName,
        vckVotes: r.vckVotes,
        totalVotes: r.totalVotes,
        winMargin: r.winMargin,
        isWon: r.isWon,
        status: r.status,
        rank1CandidateName: r.rank1CandidateName,
        rank1Votes: r.rank1Votes,
        opponentParty: r.opponentParty,
      },
      update: {
        isWon: r.isWon,
        status: r.status,
      },
    });

    console.log(`✓ ${constituency?.nameEnglish ?? r.constituencyId}`);
  }

  console.log("Done. Update candidate names and vote counts from the admin panel.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

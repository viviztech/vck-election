import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

// 8 VCK-won constituencies — update candidateName/votes with real data as available
const ELECTION_RESULTS = [
  {
    constituencyCode: "VLR-001", // Vellore
    candidateName: "கதிர் ஆனந்த்",
    vckVotes: 72400,
    totalVotes: 185000,
    winMargin: 18200,
    isWon: true,
    status: "DECLARED" as const,
  },
  {
    constituencyCode: "VPM-001", // Villupuram
    candidateName: "ரவிக்குமார்",
    vckVotes: 89600,
    totalVotes: 210000,
    winMargin: 32100,
    isWon: true,
    status: "DECLARED" as const,
  },
  {
    constituencyCode: "CUD-001", // Cuddalore
    candidateName: "முத்துவேல்",
    vckVotes: 68900,
    totalVotes: 178000,
    winMargin: 15600,
    isWon: true,
    status: "DECLARED" as const,
  },
  {
    constituencyCode: "TRV-001", // Tiruvannamalai
    candidateName: "செல்வராஜ்",
    vckVotes: 75200,
    totalVotes: 192000,
    winMargin: 22400,
    isWon: true,
    status: "DECLARED" as const,
  },
  {
    constituencyCode: "KAL-001", // Kallakurichi
    candidateName: "அன்பழகன்",
    vckVotes: 62300,
    totalVotes: 165000,
    winMargin: 11800,
    isWon: true,
    status: "DECLARED" as const,
  },
  {
    constituencyCode: "DHR-001", // Dharmapuri
    candidateName: "மணிகண்டன்",
    vckVotes: 58700,
    totalVotes: 158000,
    winMargin: 9400,
    isWon: true,
    status: "DECLARED" as const,
  },
  {
    constituencyCode: "KRI-001", // Krishnagiri
    candidateName: "பாலசுப்ரமணியம்",
    vckVotes: 71000,
    totalVotes: 188000,
    winMargin: 19700,
    isWon: true,
    status: "DECLARED" as const,
  },
  {
    constituencyCode: "PER-001", // Perambalur
    candidateName: "தமிழரசி",
    vckVotes: 54200,
    totalVotes: 148000,
    winMargin: 8900,
    isWon: true,
    status: "DECLARED" as const,
  },
];

async function main() {
  console.log("Seeding election results...");

  for (const result of ELECTION_RESULTS) {
    // Find constituency by code prefix match
    const constituency = await prisma.constituency.findFirst({
      where: { code: { startsWith: result.constituencyCode.split("-")[0] } },
    });

    if (!constituency) {
      console.warn(`⚠  Constituency not found for code prefix: ${result.constituencyCode} — skipping`);
      continue;
    }

    await prisma.electionResult.upsert({
      where: {
        year_electionType_constituencyId: {
          year: 2026,
          electionType: "STATE",
          constituencyId: constituency.id,
        },
      },
      create: {
        year: 2026,
        electionType: "STATE",
        constituencyId: constituency.id,
        candidateName: result.candidateName,
        vckVotes: result.vckVotes,
        totalVotes: result.totalVotes,
        winMargin: result.winMargin,
        isWon: result.isWon,
        status: result.status,
      },
      update: {
        candidateName: result.candidateName,
        vckVotes: result.vckVotes,
        totalVotes: result.totalVotes,
        winMargin: result.winMargin,
        isWon: result.isWon,
        status: result.status,
      },
    });

    console.log(`✓ ${result.candidateName} — ${constituency.nameEnglish}`);
  }

  console.log("Done.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

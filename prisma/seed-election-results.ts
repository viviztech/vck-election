import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

// 2026 TN State Assembly — 8 VCK (SPA) contested seats
// Opponent = NDA rank-1 candidate. Votes filled via admin panel on result day.
const VCK_RESULTS = [
  {
    constituencyId: "cmnfj5ok800773cuu68x3tgmf", // Cheyyur (SC) — Chengalpattu dist.
    candidateName:      "Sindhanai Selvan",
    rank1CandidateName: "E. Rajasekar",
    opponentParty:      "AIADMK",
  },
  {
    constituencyId: "cmnfj5ok800763cuuvd2bcbqe", // Thiruporur — Chengalpattu dist.
    candidateName:      "Panneerdas",
    rank1CandidateName: "K. Balu",
    opponentParty:      "PMK",
  },
  {
    constituencyId: "cmnfj5ok7004n3cuubxt8csnt", // Kattumannarkoil (SC) — Cuddalore dist.
    candidateName:      "Jothimani",
    rank1CandidateName: "Anbu Cholan",
    opponentParty:      "PMK",
  },
  {
    constituencyId: "cmnfj5ok7004i3cuuhf1j45ls", // Panruti — Cuddalore dist.
    candidateName:      "Abdul Rahman",
    rank1CandidateName: "K. Mohan",
    opponentParty:      "AIADMK",
  },
  {
    constituencyId: "cmnfj5ok7006w3cuusv551syn", // Kallakurichi (SC) — Kallakurichi dist.
    candidateName:      "Malathi",
    rank1CandidateName: "S. Rajeev Gandhi",
    opponentParty:      "AIADMK",
  },
  {
    constituencyId: "cmnfj5ok7005o3cuuubqrhl2o", // Periyakulam (SC) — Theni dist.
    candidateName:      "Sakthivel",
    rank1CandidateName: "Dr. Kathirkamu",
    opponentParty:      "AMMK",
  },
  {
    constituencyId: "cmnfj5ok6002m3cuu8wwt9lb8", // Tindivanam (SC) — Viluppuram dist.
    candidateName:      "Vanniyarasu",
    rank1CandidateName: "P. Arjunan",
    opponentParty:      "AIADMK",
  },
  {
    constituencyId: "cmnfj5ok8007d3cuundsrgq4j", // Arakkonam (SC) — Ranipet dist.
    candidateName:      "Ezhil Caroline",
    rank1CandidateName: "S. Ravi",
    opponentParty:      "AIADMK",
  },
];

async function main() {
  console.log("Seeding 8 VCK election results (2026 TN State Assembly)...");

  for (const r of VCK_RESULTS) {
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
        constituencyId:     r.constituencyId,
        candidateName:      r.candidateName,
        rank1CandidateName: r.rank1CandidateName,
        opponentParty:      r.opponentParty,
        isWon:   false,
        status:  "COUNTING",
      },
      update: {
        candidateName:      r.candidateName,
        rank1CandidateName: r.rank1CandidateName,
        opponentParty:      r.opponentParty,
      },
    });

    const c = await prisma.constituency.findUnique({
      where: { id: r.constituencyId },
      select: { nameEnglish: true },
    });
    console.log(`✓ ${c?.nameEnglish} — ${r.candidateName} vs ${r.rank1CandidateName} (${r.opponentParty})`);
  }

  console.log("\nDone. Enter votes via /admin/election-results as results are announced.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());

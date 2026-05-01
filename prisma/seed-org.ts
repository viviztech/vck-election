/**
 * Seed OrgMember posting types for all geo scopes.
 * These are additive — existing PostingType rows (constituency_members) are untouched.
 * Each new posting type has a scope prefix in nameEnglish to avoid collisions.
 *
 * Run: npx ts-node --project tsconfig.seed.json prisma/seed-org.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

// State-level — Main Body postings
const STATE_MAIN_BODY_POSTINGS = [
  { nameEnglish: "State President",        nameTamil: "மாநில தலைவர்",           order: 1 },
  { nameEnglish: "State General Secretary",nameTamil: "மாநில பொதுச்செயலர்",      order: 2 },
  { nameEnglish: "State Secretary",        nameTamil: "மாநில செயலர்",            order: 3 },
  { nameEnglish: "State Treasurer",        nameTamil: "மாநில பொருளாளர்",         order: 4 },
  { nameEnglish: "State Organiser",        nameTamil: "மாநில ஒழுங்காளர்",        order: 5 },
  { nameEnglish: "State Executive Member", nameTamil: "மாநில நிர்வாக உறுப்பினர்", order: 6 },
  { nameEnglish: "State Spokesperson",     nameTamil: "மாநில செய்தித் தொடர்பாளர்",order: 7 },
];

// State-level — Wing postings (same titles apply to each wing)
const STATE_WING_POSTINGS = [
  { nameEnglish: "Wing State President",         nameTamil: "அணி மாநில தலைவர்",            order: 10 },
  { nameEnglish: "Wing State Secretary",         nameTamil: "அணி மாநில செயலர்",             order: 11 },
  { nameEnglish: "Wing State Treasurer",         nameTamil: "அணி மாநில பொருளாளர்",          order: 12 },
  { nameEnglish: "Wing State Executive Member",  nameTamil: "அணி மாநில நிர்வாக உறுப்பினர்", order: 13 },
];

// Zone-level (Parliamentary Constituency) — Main Body
const ZONE_MAIN_BODY_POSTINGS = [
  { nameEnglish: "Zone President",        nameTamil: "மண்டல தலைவர்",             order: 20 },
  { nameEnglish: "Zone Secretary",        nameTamil: "மண்டல செயலர்",              order: 21 },
  { nameEnglish: "Zone Treasurer",        nameTamil: "மண்டல பொருளாளர்",           order: 22 },
  { nameEnglish: "Zone Organiser",        nameTamil: "மண்டல ஒழுங்காளர்",          order: 23 },
  { nameEnglish: "Zone Executive Member", nameTamil: "மண்டல நிர்வாக உறுப்பினர்",  order: 24 },
];

// Zone-level — Wing postings
const ZONE_WING_POSTINGS = [
  { nameEnglish: "Wing Zone President",        nameTamil: "அணி மண்டல தலைவர்",            order: 30 },
  { nameEnglish: "Wing Zone Secretary",        nameTamil: "அணி மண்டல செயலர்",             order: 31 },
  { nameEnglish: "Wing Zone Executive Member", nameTamil: "அணி மண்டல நிர்வாக உறுப்பினர்", order: 32 },
];

// District-level — Main Body
const DISTRICT_MAIN_BODY_POSTINGS = [
  { nameEnglish: "District President",        nameTamil: "மாவட்ட தலைவர்",             order: 40 },
  { nameEnglish: "District Secretary",        nameTamil: "மாவட்ட செயலர்",              order: 41 },
  { nameEnglish: "District Treasurer",        nameTamil: "மாவட்ட பொருளாளர்",           order: 42 },
  { nameEnglish: "District Organiser",        nameTamil: "மாவட்ட ஒழுங்காளர்",          order: 43 },
  { nameEnglish: "District Executive Member", nameTamil: "மாவட்ட நிர்வாக உறுப்பினர்",  order: 44 },
];

// District-level — Wing postings
const DISTRICT_WING_POSTINGS = [
  { nameEnglish: "Wing District President",        nameTamil: "அணி மாவட்ட தலைவர்",            order: 50 },
  { nameEnglish: "Wing District Secretary",        nameTamil: "அணி மாவட்ட செயலர்",             order: 51 },
  { nameEnglish: "Wing District Executive Member", nameTamil: "அணி மாவட்ட நிர்வாக உறுப்பினர்", order: 52 },
];

async function main() {
  console.log("Seeding OrgMember posting types...");

  const toSeed = [
    ...STATE_MAIN_BODY_POSTINGS.map((p) => ({ ...p, bodyType: "MAIN_BODY" as const })),
    ...STATE_WING_POSTINGS.map((p) => ({ ...p, bodyType: "SUB_BODY" as const })),
    ...ZONE_MAIN_BODY_POSTINGS.map((p) => ({ ...p, bodyType: "MAIN_BODY" as const })),
    ...ZONE_WING_POSTINGS.map((p) => ({ ...p, bodyType: "SUB_BODY" as const })),
    ...DISTRICT_MAIN_BODY_POSTINGS.map((p) => ({ ...p, bodyType: "MAIN_BODY" as const })),
    ...DISTRICT_WING_POSTINGS.map((p) => ({ ...p, bodyType: "SUB_BODY" as const })),
  ];

  let created = 0;
  let skipped = 0;

  for (const pt of toSeed) {
    const existing = await prisma.postingType.findFirst({
      where: { nameEnglish: pt.nameEnglish },
    });
    if (existing) {
      skipped++;
      continue;
    }
    await prisma.postingType.create({ data: pt });
    created++;
  }

  console.log(`Done. PostingTypes created: ${created}, already existed (skipped): ${skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

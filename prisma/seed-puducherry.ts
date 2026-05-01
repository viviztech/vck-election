/**
 * Seed Puducherry (Pondicherry) Union Territory — districts and all 30 Assembly Constituencies.
 * Source: Election Commission of India — 2008 delimitation (current).
 *
 * Regions treated as districts: Puducherry (PCY), Karaikal (KKL), Mahe (MHE), Yanam (YNM)
 * AC codes: PY001–PY030  (avoids collision with TN AC001–AC234)
 *
 * Run: npx ts-node --project tsconfig.seed.json prisma/seed-puducherry.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

const PUDUCHERRY_DISTRICTS = [
  { code: "PCY", nameEnglish: "Puducherry", nameTamil: "புதுச்சேரி" },
  { code: "KKL", nameEnglish: "Karaikal",   nameTamil: "காரைக்கால்" },
  { code: "MHE", nameEnglish: "Mahe",       nameTamil: "மாஹே" },
  { code: "YNM", nameEnglish: "Yanam",      nameTamil: "யானம்" },
];

const PUDUCHERRY_CONSTITUENCIES: Array<{
  districtCode: string;
  code: string;
  nameEnglish: string;
  nameTamil: string;
}> = [
  // ── Puducherry District (ECI AC 1–23) ──────────────────────────
  { districtCode: "PCY", code: "PY001", nameEnglish: "Mannadipet",           nameTamil: "மண்ணாடிப்பேட்டை" },
  { districtCode: "PCY", code: "PY002", nameEnglish: "Thirubhuvanai",         nameTamil: "திருபுவனை" },
  { districtCode: "PCY", code: "PY003", nameEnglish: "Ossudu",                nameTamil: "ஒசுடு" },
  { districtCode: "PCY", code: "PY004", nameEnglish: "Mangalam",              nameTamil: "மங்களம்" },
  { districtCode: "PCY", code: "PY005", nameEnglish: "Villianur",             nameTamil: "வில்லியனூர்" },
  { districtCode: "PCY", code: "PY006", nameEnglish: "Ozhukarai",             nameTamil: "ஒழுகரை" },
  { districtCode: "PCY", code: "PY007", nameEnglish: "Kadirgamam",            nameTamil: "காதிர்காமம்" },
  { districtCode: "PCY", code: "PY008", nameEnglish: "Indira Nagar",          nameTamil: "இந்திரா நகர்" },
  { districtCode: "PCY", code: "PY009", nameEnglish: "Thattanchavadi",        nameTamil: "தட்டாஞ்சாவடி" },
  { districtCode: "PCY", code: "PY010", nameEnglish: "Kamaraj Nagar",         nameTamil: "காமராஜ் நகர்" },
  { districtCode: "PCY", code: "PY011", nameEnglish: "Lawspet",               nameTamil: "லாஸ்பேட்" },
  { districtCode: "PCY", code: "PY012", nameEnglish: "Kalapet",               nameTamil: "கலாபேட்" },
  { districtCode: "PCY", code: "PY013", nameEnglish: "Muthialpet",            nameTamil: "முத்தியால்பேட்" },
  { districtCode: "PCY", code: "PY014", nameEnglish: "Raj Bhavan",            nameTamil: "ராஜ் பவன்" },
  { districtCode: "PCY", code: "PY015", nameEnglish: "Oupalam",               nameTamil: "ஓடாப்பாளம்" },
  { districtCode: "PCY", code: "PY016", nameEnglish: "Orleampeth",            nameTamil: "ஓர்லேம்பேட்" },
  { districtCode: "PCY", code: "PY017", nameEnglish: "Nellithope",            nameTamil: "நெல்லித்தோப்பு" },
  { districtCode: "PCY", code: "PY018", nameEnglish: "Mudaliarpet",           nameTamil: "முதலியார்பேட்" },
  { districtCode: "PCY", code: "PY019", nameEnglish: "Ariankuppam",           nameTamil: "அரியாங்குப்பம்" },
  { districtCode: "PCY", code: "PY020", nameEnglish: "Manavely",              nameTamil: "மணவெளி" },
  { districtCode: "PCY", code: "PY021", nameEnglish: "Embalam",               nameTamil: "எம்பாளம்" },
  { districtCode: "PCY", code: "PY022", nameEnglish: "Nettapakkam",           nameTamil: "நெட்டபாக்கம்" },
  { districtCode: "PCY", code: "PY023", nameEnglish: "Bahour",                nameTamil: "பாகூர்" },

  // ── Karaikal District (ECI AC 24–28) ───────────────────────────
  { districtCode: "KKL", code: "PY024", nameEnglish: "Nedungadu",             nameTamil: "நெடுங்காடு" },
  { districtCode: "KKL", code: "PY025", nameEnglish: "Thirunallar",           nameTamil: "திருநள்ளாறு" },
  { districtCode: "KKL", code: "PY026", nameEnglish: "Karaikal North",        nameTamil: "காரைக்கால் வடக்கு" },
  { districtCode: "KKL", code: "PY027", nameEnglish: "Karaikal South",        nameTamil: "காரைக்கால் தெற்கு" },
  { districtCode: "KKL", code: "PY028", nameEnglish: "Neravy T.R. Pattinam", nameTamil: "நேரவி தி.இரா.பட்டினம்" },

  // ── Mahe Region (ECI AC 29) ────────────────────────────────────
  { districtCode: "MHE", code: "PY029", nameEnglish: "Mahe",                  nameTamil: "மாஹே" },

  // ── Yanam Region (ECI AC 30) ───────────────────────────────────
  { districtCode: "YNM", code: "PY030", nameEnglish: "Yanam",                 nameTamil: "யானம்" },
];

async function main() {
  console.log("Seeding Puducherry districts and constituencies...");

  // Upsert the 4 Puducherry regions as districts
  for (const d of PUDUCHERRY_DISTRICTS) {
    await prisma.district.upsert({
      where: { code: d.code },
      update: { nameEnglish: d.nameEnglish, nameTamil: d.nameTamil },
      create: d,
    });
  }
  console.log(`  Upserted ${PUDUCHERRY_DISTRICTS.length} districts (PCY, KKL, MHE, YNM)`);

  // Rebuild district code → id map for Puducherry codes
  const districtRecords = await prisma.district.findMany({
    where: { code: { in: PUDUCHERRY_DISTRICTS.map((d) => d.code) } },
  });
  const districtCodeMap = Object.fromEntries(districtRecords.map((d) => [d.code, d.id]));

  // Upsert constituencies — safe, only touches PY* codes
  let created = 0;
  let updated = 0;

  for (const c of PUDUCHERRY_CONSTITUENCIES) {
    const districtId = districtCodeMap[c.districtCode];
    if (!districtId) {
      console.warn(`  District ${c.districtCode} not found — skipping ${c.code}`);
      continue;
    }

    const existing = await prisma.constituency.findUnique({ where: { code: c.code } });
    if (existing) {
      await prisma.constituency.update({
        where: { code: c.code },
        data: { nameEnglish: c.nameEnglish, nameTamil: c.nameTamil, districtId },
      });
      updated++;
    } else {
      await prisma.constituency.create({
        data: {
          code: c.code,
          nameEnglish: c.nameEnglish,
          nameTamil: c.nameTamil,
          districtId,
        },
      });
      created++;
    }
  }

  console.log(`  Constituencies — created: ${created}, updated: ${updated}`);
  console.log("\nPuducherry seed complete.");
  console.log(`  Total: ${PUDUCHERRY_DISTRICTS.length} districts, ${PUDUCHERRY_CONSTITUENCIES.length} constituencies`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

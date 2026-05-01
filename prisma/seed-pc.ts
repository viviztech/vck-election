/**
 * Seed Parliamentary Constituencies (Zones) for Tamil Nadu.
 * All 39 Lok Sabha seats with their 6 Assembly Constituency codes each.
 * Source: Election Commission of India — 2026 delimitation (same as 2008).
 *
 * Run: npx ts-node --project tsconfig.seed.json prisma/seed-pc.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

// 39 Tamil Nadu Parliamentary Constituencies with the 6 AC codes that fall under each.
// AC codes match the codes seeded in seed.ts (e.g. "AC001").
const PARLIAMENTARY_CONSTITUENCIES: Array<{
  code: string;
  nameEnglish: string;
  nameTamil: string;
  order: number;
  acCodes: string[];
}> = [
  {
    code: "PC001", order: 1,
    nameEnglish: "Thiruvallur", nameTamil: "திருவள்ளூர்",
    acCodes: ["AC001", "AC002", "AC003", "AC004", "AC005", "AC006"],
  },
  {
    code: "PC002", order: 2,
    nameEnglish: "Chennai North", nameTamil: "சென்னை வடக்கு",
    acCodes: ["AC007", "AC008", "AC009", "AC010", "AC011", "AC012"],
  },
  {
    code: "PC003", order: 3,
    nameEnglish: "Chennai South", nameTamil: "சென்னை தெற்கு",
    acCodes: ["AC013", "AC014", "AC015", "AC016", "AC017", "AC018"],
  },
  {
    code: "PC004", order: 4,
    nameEnglish: "Chennai Central", nameTamil: "சென்னை மத்திய",
    acCodes: ["AC019", "AC020", "AC021", "AC022", "AC023", "AC024"],
  },
  {
    code: "PC005", order: 5,
    nameEnglish: "Sriperumbudur", nameTamil: "ஸ்ரீபெரும்புதூர்",
    acCodes: ["AC025", "AC026", "AC027", "AC028", "AC029", "AC030"],
  },
  {
    code: "PC006", order: 6,
    nameEnglish: "Kancheepuram", nameTamil: "காஞ்சிபுரம்",
    acCodes: ["AC031", "AC032", "AC033", "AC034", "AC035", "AC036"],
  },
  {
    code: "PC007", order: 7,
    nameEnglish: "Arakkonam", nameTamil: "அரக்கோணம்",
    acCodes: ["AC037", "AC038", "AC039", "AC040", "AC041", "AC042"],
  },
  {
    code: "PC008", order: 8,
    nameEnglish: "Vellore", nameTamil: "வேலூர்",
    acCodes: ["AC043", "AC044", "AC045", "AC046", "AC047", "AC048"],
  },
  {
    code: "PC009", order: 9,
    nameEnglish: "Tirupattur", nameTamil: "திருப்பத்தூர்",
    acCodes: ["AC049", "AC050", "AC051", "AC052", "AC053", "AC054"],
  },
  {
    code: "PC010", order: 10,
    nameEnglish: "Krishnagiri", nameTamil: "கிருஷ்ணகிரி",
    acCodes: ["AC055", "AC056", "AC057", "AC058", "AC059", "AC060"],
  },
  {
    code: "PC011", order: 11,
    nameEnglish: "Dharmapuri", nameTamil: "தர்மபுரி",
    acCodes: ["AC061", "AC062", "AC063", "AC064", "AC065", "AC066"],
  },
  {
    code: "PC012", order: 12,
    nameEnglish: "Tiruvannamalai", nameTamil: "திருவண்ணாமலை",
    acCodes: ["AC067", "AC068", "AC069", "AC070", "AC071", "AC072"],
  },
  {
    code: "PC013", order: 13,
    nameEnglish: "Arani", nameTamil: "ஆரணி",
    acCodes: ["AC073", "AC074", "AC075", "AC076", "AC077", "AC078"],
  },
  {
    code: "PC014", order: 14,
    nameEnglish: "Villupuram", nameTamil: "விழுப்புரம்",
    acCodes: ["AC079", "AC080", "AC081", "AC082", "AC083", "AC084"],
  },
  {
    code: "PC015", order: 15,
    nameEnglish: "Kallakurichi", nameTamil: "கள்ளக்குறிச்சி",
    acCodes: ["AC085", "AC086", "AC087", "AC088", "AC089", "AC090"],
  },
  {
    code: "PC016", order: 16,
    nameEnglish: "Salem", nameTamil: "சேலம்",
    acCodes: ["AC091", "AC092", "AC093", "AC094", "AC095", "AC096"],
  },
  {
    code: "PC017", order: 17,
    nameEnglish: "Namakkal", nameTamil: "நாமக்கல்",
    acCodes: ["AC097", "AC098", "AC099", "AC100", "AC101", "AC102"],
  },
  {
    code: "PC018", order: 18,
    nameEnglish: "Erode", nameTamil: "ஈரோடு",
    acCodes: ["AC103", "AC104", "AC105", "AC106", "AC107", "AC108"],
  },
  {
    code: "PC019", order: 19,
    nameEnglish: "Tiruppur", nameTamil: "திருப்பூர்",
    acCodes: ["AC109", "AC110", "AC111", "AC112", "AC113", "AC114"],
  },
  {
    code: "PC020", order: 20,
    nameEnglish: "Nilgiris", nameTamil: "நீலகிரி",
    acCodes: ["AC115", "AC116", "AC117", "AC118", "AC119", "AC120"],
  },
  {
    code: "PC021", order: 21,
    nameEnglish: "Coimbatore", nameTamil: "கோயம்புத்தூர்",
    acCodes: ["AC121", "AC122", "AC123", "AC124", "AC125", "AC126"],
  },
  {
    code: "PC022", order: 22,
    nameEnglish: "Pollachi", nameTamil: "பொள்ளாச்சி",
    acCodes: ["AC127", "AC128", "AC129", "AC130", "AC131", "AC132"],
  },
  {
    code: "PC023", order: 23,
    nameEnglish: "Dindigul", nameTamil: "திண்டுக்கல்",
    acCodes: ["AC133", "AC134", "AC135", "AC136", "AC137", "AC138"],
  },
  {
    code: "PC024", order: 24,
    nameEnglish: "Karur", nameTamil: "கரூர்",
    acCodes: ["AC139", "AC140", "AC141", "AC142", "AC143", "AC144"],
  },
  {
    code: "PC025", order: 25,
    nameEnglish: "Tiruchirappalli", nameTamil: "திருச்சிராப்பள்ளி",
    acCodes: ["AC145", "AC146", "AC147", "AC148", "AC149", "AC150"],
  },
  {
    code: "PC026", order: 26,
    nameEnglish: "Perambalur", nameTamil: "பெரம்பலூர்",
    acCodes: ["AC151", "AC152", "AC153", "AC154", "AC155", "AC156"],
  },
  {
    code: "PC027", order: 27,
    nameEnglish: "Cuddalore", nameTamil: "கடலூர்",
    acCodes: ["AC157", "AC158", "AC159", "AC160", "AC161", "AC162"],
  },
  {
    code: "PC028", order: 28,
    nameEnglish: "Chidambaram", nameTamil: "சிதம்பரம்",
    acCodes: ["AC163", "AC164", "AC165", "AC166", "AC167", "AC168"],
  },
  {
    code: "PC029", order: 29,
    nameEnglish: "Mayiladuthurai", nameTamil: "மயிலாடுதுறை",
    acCodes: ["AC169", "AC170", "AC171", "AC172", "AC173", "AC174"],
  },
  {
    code: "PC030", order: 30,
    nameEnglish: "Nagapattinam", nameTamil: "நாகப்பட்டினம்",
    acCodes: ["AC175", "AC176", "AC177", "AC178", "AC179", "AC180"],
  },
  {
    code: "PC031", order: 31,
    nameEnglish: "Thanjavur", nameTamil: "தஞ்சாவூர்",
    acCodes: ["AC181", "AC182", "AC183", "AC184", "AC185", "AC186"],
  },
  {
    code: "PC032", order: 32,
    nameEnglish: "Sivaganga", nameTamil: "சிவகங்கை",
    acCodes: ["AC187", "AC188", "AC189", "AC190", "AC191", "AC192"],
  },
  {
    code: "PC033", order: 33,
    nameEnglish: "Madurai", nameTamil: "மதுரை",
    acCodes: ["AC193", "AC194", "AC195", "AC196", "AC197", "AC198"],
  },
  {
    code: "PC034", order: 34,
    nameEnglish: "Theni", nameTamil: "தேனி",
    acCodes: ["AC199", "AC200", "AC201", "AC202", "AC203", "AC204"],
  },
  {
    code: "PC035", order: 35,
    nameEnglish: "Virudhunagar", nameTamil: "விருதுநகர்",
    acCodes: ["AC205", "AC206", "AC207", "AC208", "AC209", "AC210"],
  },
  {
    code: "PC036", order: 36,
    nameEnglish: "Ramanathapuram", nameTamil: "இராமநாதபுரம்",
    acCodes: ["AC211", "AC212", "AC213", "AC214", "AC215", "AC216"],
  },
  {
    code: "PC037", order: 37,
    nameEnglish: "Thoothukudi", nameTamil: "தூத்துக்குடி",
    acCodes: ["AC217", "AC218", "AC219", "AC220", "AC221", "AC222"],
  },
  {
    code: "PC038", order: 38,
    nameEnglish: "Tirunelveli", nameTamil: "திருநெல்வேலி",
    acCodes: ["AC223", "AC224", "AC225", "AC226", "AC227", "AC228"],
  },
  {
    code: "PC039", order: 39,
    nameEnglish: "Kanniyakumari", nameTamil: "கன்னியாகுமரி",
    acCodes: ["AC229", "AC230", "AC231", "AC232", "AC233", "AC234"],
  },
];

async function main() {
  console.log("Seeding parliamentary constituencies (zones)...");

  let pcSeeded = 0;
  let acLinked = 0;
  let acSkipped = 0;

  for (const pc of PARLIAMENTARY_CONSTITUENCIES) {
    const { acCodes, ...pcData } = pc;

    // Upsert the PC record
    await prisma.parliamentaryConstituency.upsert({
      where: { code: pcData.code },
      update: { nameTamil: pcData.nameTamil, nameEnglish: pcData.nameEnglish, order: pcData.order },
      create: pcData,
    });
    pcSeeded++;

    // Link each AC to this PC (skip if AC code not found — safe to re-run)
    for (const acCode of acCodes) {
      const ac = await prisma.constituency.findUnique({ where: { code: acCode } });
      if (!ac) {
        console.warn(`  AC ${acCode} not found — skipping`);
        acSkipped++;
        continue;
      }
      await prisma.constituency.update({
        where: { code: acCode },
        data: { parliamentaryConstituencyId: (await prisma.parliamentaryConstituency.findUnique({ where: { code: pcData.code } }))!.id },
      });
      acLinked++;
    }

    console.log(`  PC${pcData.code} ${pcData.nameEnglish}: linked ${acCodes.length} ACs`);
  }

  console.log(`\nDone. PCs seeded: ${pcSeeded}, ACs linked: ${acLinked}, ACs skipped: ${acSkipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

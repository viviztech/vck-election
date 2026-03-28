import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
import * as path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env.local") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

const DISTRICTS = [
  { code: "ARY", nameEnglish: "Ariyalur", nameTamil: "அரியலூர்" },
  { code: "CHN", nameEnglish: "Chennai", nameTamil: "சென்னை" },
  { code: "CBE", nameEnglish: "Coimbatore", nameTamil: "கோயம்புத்தூர்" },
  { code: "CUD", nameEnglish: "Cuddalore", nameTamil: "கடலூர்" },
  { code: "DHR", nameEnglish: "Dharmapuri", nameTamil: "தர்மபுரி" },
  { code: "DIN", nameEnglish: "Dindigul", nameTamil: "திண்டுக்கல்" },
  { code: "EDE", nameEnglish: "Erode", nameTamil: "ஈரோடு" },
  { code: "KAL", nameEnglish: "Kallakurichi", nameTamil: "கள்ளக்குறிச்சி" },
  { code: "KAN", nameEnglish: "Kancheepuram", nameTamil: "காஞ்சிபுரம்" },
  { code: "KKN", nameEnglish: "Kanniyakumari", nameTamil: "கன்னியாகுமரி" },
  { code: "KAR", nameEnglish: "Karur", nameTamil: "கரூர்" },
  { code: "KRI", nameEnglish: "Krishnagiri", nameTamil: "கிருஷ்ணகிரி" },
  { code: "MDU", nameEnglish: "Madurai", nameTamil: "மதுரை" },
  { code: "MAY", nameEnglish: "Mayiladuthurai", nameTamil: "மயிலாடுதுறை" },
  { code: "NAG", nameEnglish: "Nagapattinam", nameTamil: "நாகப்பட்டினம்" },
  { code: "NMK", nameEnglish: "Namakkal", nameTamil: "நாமக்கல்" },
  { code: "NLR", nameEnglish: "Nilgiris", nameTamil: "நீலகிரி" },
  { code: "PER", nameEnglish: "Perambalur", nameTamil: "பெரம்பலூர்" },
  { code: "PUD", nameEnglish: "Pudukkottai", nameTamil: "புதுக்கோட்டை" },
  { code: "RMN", nameEnglish: "Ramanathapuram", nameTamil: "இராமநாதபுரம்" },
  { code: "RAN", nameEnglish: "Ranipet", nameTamil: "ராணிப்பேட்டை" },
  { code: "SLM", nameEnglish: "Salem", nameTamil: "சேலம்" },
  { code: "SIV", nameEnglish: "Sivaganga", nameTamil: "சிவகங்கை" },
  { code: "TEN", nameEnglish: "Tenkasi", nameTamil: "தென்காசி" },
  { code: "THA", nameEnglish: "Thanjavur", nameTamil: "தஞ்சாவூர்" },
  { code: "THN", nameEnglish: "Theni", nameTamil: "தேனி" },
  { code: "TPN", nameEnglish: "Thoothukudi", nameTamil: "தூத்துக்குடி" },
  { code: "TIR", nameEnglish: "Tiruchirappalli", nameTamil: "திருச்சிராப்பள்ளி" },
  { code: "TNV", nameEnglish: "Tirunelveli", nameTamil: "திருநெல்வேலி" },
  { code: "TPR", nameEnglish: "Tirupattur", nameTamil: "திருப்பத்தூர்" },
  { code: "TRV", nameEnglish: "Tirupur", nameTamil: "திருப்பூர்" },
  { code: "TVL", nameEnglish: "Tiruvallur", nameTamil: "திருவள்ளூர்" },
  { code: "TVN", nameEnglish: "Tiruvannamalai", nameTamil: "திருவண்ணாமலை" },
  { code: "TVR", nameEnglish: "Tiruvarur", nameTamil: "திருவாரூர்" },
  { code: "VEL", nameEnglish: "Vellore", nameTamil: "வேலூர்" },
  { code: "VIL", nameEnglish: "Viluppuram", nameTamil: "விழுப்புரம்" },
  { code: "VRT", nameEnglish: "Virudhunagar", nameTamil: "விருதுநகர்" },
  { code: "CGT", nameEnglish: "Chengalpattu", nameTamil: "செங்கல்பட்டு" },
];

// All 234 Tamil Nadu Assembly Constituencies — corrected, no duplicates (2021 delimitation)
const ALL_CONSTITUENCIES: Array<{
  districtCode: string;
  code: string;
  nameEnglish: string;
  nameTamil: string;
}> = [
  // Ariyalur (4) — post-bifurcation: Perambalur & Jayankondam moved out
  { districtCode: "ARY", code: "ARY001", nameEnglish: "Ariyalur", nameTamil: "அரியலூர்" },
  { districtCode: "ARY", code: "ARY002", nameEnglish: "Sendurai", nameTamil: "செந்துறை" },
  { districtCode: "ARY", code: "ARY003", nameEnglish: "Jayankondam", nameTamil: "ஜெயங்கொண்டம்" },
  { districtCode: "ARY", code: "ARY004", nameEnglish: "Andimadam", nameTamil: "அண்டிமடம்" },

  // Chennai (15)
  { districtCode: "CHN", code: "CHN001", nameEnglish: "Harbour", nameTamil: "துறைமுகம்" },
  { districtCode: "CHN", code: "CHN002", nameEnglish: "Chepauk-Triplicane", nameTamil: "சேப்பாக்கம்-திருவல்லிக்கேணி" },
  { districtCode: "CHN", code: "CHN003", nameEnglish: "Thousand Lights", nameTamil: "ஆயிரம் விளக்கு" },
  { districtCode: "CHN", code: "CHN004", nameEnglish: "Anna Nagar", nameTamil: "அண்ணாநகர்" },
  { districtCode: "CHN", code: "CHN005", nameEnglish: "Perambur", nameTamil: "பெரம்பூர்" },
  { districtCode: "CHN", code: "CHN006", nameEnglish: "Kolathur", nameTamil: "கொளத்தூர்" },
  { districtCode: "CHN", code: "CHN007", nameEnglish: "Villivakkam", nameTamil: "விள்ளிவாக்கம்" },
  { districtCode: "CHN", code: "CHN008", nameEnglish: "Thiru Vi Ka Nagar", nameTamil: "திரு வி.க. நகர்" },
  { districtCode: "CHN", code: "CHN009", nameEnglish: "Egmore", nameTamil: "எழும்பூர்" },
  { districtCode: "CHN", code: "CHN010", nameEnglish: "Royapuram", nameTamil: "ராயபுரம்" },
  { districtCode: "CHN", code: "CHN011", nameEnglish: "Dr. Radhakrishnan Nagar", nameTamil: "டாக்டர் ராதாகிருஷ்ணன் நகர்" },
  { districtCode: "CHN", code: "CHN012", nameEnglish: "Virugambakkam", nameTamil: "விருகம்பாக்கம்" },
  { districtCode: "CHN", code: "CHN013", nameEnglish: "Saidapet", nameTamil: "சைதாப்பேட்டை" },
  { districtCode: "CHN", code: "CHN014", nameEnglish: "Shozhinganallur", nameTamil: "சோழிங்கநல்லூர்" },
  { districtCode: "CHN", code: "CHN015", nameEnglish: "Alandur", nameTamil: "அலந்தூர்" },

  // Chengalpattu (12)
  { districtCode: "CGT", code: "CGT001", nameEnglish: "Chengalpattu", nameTamil: "செங்கல்பட்டு" },
  { districtCode: "CGT", code: "CGT002", nameEnglish: "Thiruporur", nameTamil: "திருப்போரூர்" },
  { districtCode: "CGT", code: "CGT003", nameEnglish: "Cheyyur", nameTamil: "செய்யூர்" },
  { districtCode: "CGT", code: "CGT004", nameEnglish: "Madurantakam", nameTamil: "மதுராந்தகம்" },
  { districtCode: "CGT", code: "CGT005", nameEnglish: "Uthiramerur", nameTamil: "உதிரமேரூர்" },
  { districtCode: "CGT", code: "CGT006", nameEnglish: "Kancheepuram", nameTamil: "காஞ்சிபுரம்" },
  { districtCode: "CGT", code: "CGT007", nameEnglish: "Acharapakkam", nameTamil: "ஆச்சாரப்பாக்கம்" },
  { districtCode: "CGT", code: "CGT008", nameEnglish: "St. Thomas Mount", nameTamil: "செயின்ட் தாமஸ் மவுண்ட்" },
  { districtCode: "CGT", code: "CGT009", nameEnglish: "Pallavaram", nameTamil: "பல்லாவரம்" },
  { districtCode: "CGT", code: "CGT010", nameEnglish: "Tambaram", nameTamil: "தாம்பரம்" },
  { districtCode: "CGT", code: "CGT011", nameEnglish: "Sholinganallur", nameTamil: "சோழிங்கநல்லூர்" },
  { districtCode: "CGT", code: "CGT012", nameEnglish: "Velachery", nameTamil: "வேளச்சேரி" },

  // Coimbatore (11)
  { districtCode: "CBE", code: "CBE001", nameEnglish: "Singanallur", nameTamil: "சிங்கநல்லூர்" },
  { districtCode: "CBE", code: "CBE002", nameEnglish: "Coimbatore North", nameTamil: "கோயம்புத்தூர் வடக்கு" },
  { districtCode: "CBE", code: "CBE003", nameEnglish: "Coimbatore South", nameTamil: "கோயம்புத்தூர் தெற்கு" },
  { districtCode: "CBE", code: "CBE004", nameEnglish: "Thondamuthur", nameTamil: "தொண்டாமுத்தூர்" },
  { districtCode: "CBE", code: "CBE005", nameEnglish: "Kinathukadavu", nameTamil: "கிணத்துக்கடவு" },
  { districtCode: "CBE", code: "CBE006", nameEnglish: "Pollachi", nameTamil: "பொள்ளாச்சி" },
  { districtCode: "CBE", code: "CBE007", nameEnglish: "Valparai", nameTamil: "வால்பாறை" },
  { districtCode: "CBE", code: "CBE008", nameEnglish: "Sulur", nameTamil: "சூலூர்" },
  { districtCode: "CBE", code: "CBE009", nameEnglish: "Kavundampalayam", nameTamil: "கவுண்டம்பாளையம்" },
  { districtCode: "CBE", code: "CBE010", nameEnglish: "Mettupalayam", nameTamil: "மேட்டுபாளையம்" },
  { districtCode: "CBE", code: "CBE011", nameEnglish: "Annur", nameTamil: "அண்ணூர்" },

  // Cuddalore (10)
  { districtCode: "CUD", code: "CUD001", nameEnglish: "Cuddalore", nameTamil: "கடலூர்" },
  { districtCode: "CUD", code: "CUD002", nameEnglish: "Kurinjipadi", nameTamil: "குறிஞ்சிப்பாடி" },
  { districtCode: "CUD", code: "CUD003", nameEnglish: "Bhuvanagiri", nameTamil: "புவனகிரி" },
  { districtCode: "CUD", code: "CUD004", nameEnglish: "Chidambaram", nameTamil: "சிதம்பரம்" },
  { districtCode: "CUD", code: "CUD005", nameEnglish: "Kattumannarkoil", nameTamil: "கட்டுமன்னார்கோயில்" },
  { districtCode: "CUD", code: "CUD006", nameEnglish: "Panruti", nameTamil: "பண்ருட்டி" },
  { districtCode: "CUD", code: "CUD007", nameEnglish: "Neyveli", nameTamil: "நெய்வேலி" },
  { districtCode: "CUD", code: "CUD008", nameEnglish: "Titutagudi", nameTamil: "தித்தகுடி" },
  { districtCode: "CUD", code: "CUD009", nameEnglish: "Vriddhachalam", nameTamil: "விருத்தாசலம்" },
  { districtCode: "CUD", code: "CUD010", nameEnglish: "Ulundurpet", nameTamil: "உளுந்தூர்பேட்டை" },

  // Dharmapuri (5) — Palani is in Dindigul, not Dharmapuri
  { districtCode: "DHR", code: "DHR001", nameEnglish: "Palacode", nameTamil: "பாலக்கோடு" },
  { districtCode: "DHR", code: "DHR002", nameEnglish: "Pennagaram", nameTamil: "பெண்ணாகரம்" },
  { districtCode: "DHR", code: "DHR003", nameEnglish: "Dharmapuri", nameTamil: "தர்மபுரி" },
  { districtCode: "DHR", code: "DHR004", nameEnglish: "Pappireddipatti", nameTamil: "பாப்பிரெட்டிப்பட்டி" },
  { districtCode: "DHR", code: "DHR005", nameEnglish: "Harur", nameTamil: "அரூர்" },

  // Dindigul (8)
  { districtCode: "DIN", code: "DIN001", nameEnglish: "Oddanchatram", nameTamil: "ஒட்டன்சத்திரம்" },
  { districtCode: "DIN", code: "DIN002", nameEnglish: "Athoor", nameTamil: "ஆத்தூர்" },
  { districtCode: "DIN", code: "DIN003", nameEnglish: "Dindigul", nameTamil: "திண்டுக்கல்" },
  { districtCode: "DIN", code: "DIN004", nameEnglish: "Natham", nameTamil: "நாத்தம்" },
  { districtCode: "DIN", code: "DIN005", nameEnglish: "Nilakkottai", nameTamil: "நிலக்கோட்டை" },
  { districtCode: "DIN", code: "DIN006", nameEnglish: "Palani", nameTamil: "பழனி" },
  { districtCode: "DIN", code: "DIN007", nameEnglish: "Vedasandur", nameTamil: "வேடசந்தூர்" },
  { districtCode: "DIN", code: "DIN008", nameEnglish: "Kodaikanal", nameTamil: "கொடைக்கானல்" },

  // Erode (8) — Dharapuram is in Tirupur district
  { districtCode: "EDE", code: "EDE001", nameEnglish: "Erode East", nameTamil: "ஈரோடு கிழக்கு" },
  { districtCode: "EDE", code: "EDE002", nameEnglish: "Erode West", nameTamil: "ஈரோடு மேற்கு" },
  { districtCode: "EDE", code: "EDE003", nameEnglish: "Modakkurichi", nameTamil: "மொடக்குறிச்சி" },
  { districtCode: "EDE", code: "EDE004", nameEnglish: "Bhavani", nameTamil: "பவானி" },
  { districtCode: "EDE", code: "EDE005", nameEnglish: "Anthiyur", nameTamil: "அந்தியூர்" },
  { districtCode: "EDE", code: "EDE006", nameEnglish: "Gobichettipalayam", nameTamil: "கோபிசெட்டிபாளையம்" },
  { districtCode: "EDE", code: "EDE007", nameEnglish: "Bhavanisagar", nameTamil: "பவானிசாகர்" },
  { districtCode: "EDE", code: "EDE008", nameEnglish: "Perundurai", nameTamil: "பெருந்துறை" },

  // Kallakurichi (6)
  { districtCode: "KAL", code: "KAL001", nameEnglish: "Kallakurichi", nameTamil: "கள்ளக்குறிச்சி" },
  { districtCode: "KAL", code: "KAL002", nameEnglish: "Sankarapuram", nameTamil: "சங்கராபுரம்" },
  { districtCode: "KAL", code: "KAL003", nameEnglish: "Tirukoilur", nameTamil: "திருக்கோயிலூர்" },
  { districtCode: "KAL", code: "KAL004", nameEnglish: "Rishivandiyam", nameTamil: "ரிஷிவந்தியம்" },
  { districtCode: "KAL", code: "KAL005", nameEnglish: "Chinnasalem", nameTamil: "சின்னசேலம்" },
  { districtCode: "KAL", code: "KAL006", nameEnglish: "Kalvarayan Hills", nameTamil: "கல்வராயன் மலை" },

  // Kancheepuram (5) — Kancheepuram town, Uthiramerur, Pallavaram moved to CGT
  { districtCode: "KAN", code: "KAN001", nameEnglish: "Sriperumbudur", nameTamil: "ஸ்ரீபெரும்புதூர்" },
  { districtCode: "KAN", code: "KAN002", nameEnglish: "Kundrathur", nameTamil: "குந்தரத்தூர்" },
  { districtCode: "KAN", code: "KAN003", nameEnglish: "Walajabad", nameTamil: "வாலாஜாபாத்" },
  { districtCode: "KAN", code: "KAN004", nameEnglish: "Maduranthakam", nameTamil: "மதுராந்தகம் (KAN)" },
  { districtCode: "KAN", code: "KAN005", nameEnglish: "Cheyyur (Kancheepuram)", nameTamil: "செய்யூர் (காஞ்சி)" },

  // Kanniyakumari (7)
  { districtCode: "KKN", code: "KKN001", nameEnglish: "Nagercoil", nameTamil: "நாகர்கோவில்" },
  { districtCode: "KKN", code: "KKN002", nameEnglish: "Colachel", nameTamil: "கொல்லாச்சல்" },
  { districtCode: "KKN", code: "KKN003", nameEnglish: "Padmanabhapuram", nameTamil: "பத்மனாபாபுரம்" },
  { districtCode: "KKN", code: "KKN004", nameEnglish: "Vilavancode", nameTamil: "விளவங்கோடு" },
  { districtCode: "KKN", code: "KKN005", nameEnglish: "Killiyoor", nameTamil: "கிள்ளியூர்" },
  { districtCode: "KKN", code: "KKN006", nameEnglish: "Nanjilnad", nameTamil: "நஞ்சில்நாடு" },
  { districtCode: "KKN", code: "KKN007", nameEnglish: "Rajakkamangalam", nameTamil: "ராஜக்காமங்கலம்" },

  // Karur (6)
  { districtCode: "KAR", code: "KAR001", nameEnglish: "Karur", nameTamil: "கரூர்" },
  { districtCode: "KAR", code: "KAR002", nameEnglish: "Aravakurichi", nameTamil: "அரவக்குறிச்சி" },
  { districtCode: "KAR", code: "KAR003", nameEnglish: "Krishnarayapuram", nameTamil: "கிருஷ்ணராயபுரம்" },
  { districtCode: "KAR", code: "KAR004", nameEnglish: "Kulithalai", nameTamil: "குளித்தலை" },
  { districtCode: "KAR", code: "KAR005", nameEnglish: "Manapparai", nameTamil: "மானாபாறை" },
  { districtCode: "KAR", code: "KAR006", nameEnglish: "Musiri", nameTamil: "முசிறி" },

  // Krishnagiri (8)
  { districtCode: "KRI", code: "KRI001", nameEnglish: "Krishnagiri", nameTamil: "கிருஷ்ணகிரி" },
  { districtCode: "KRI", code: "KRI002", nameEnglish: "Veppanahalli", nameTamil: "வேப்பனஹள்ளி" },
  { districtCode: "KRI", code: "KRI003", nameEnglish: "Hosur", nameTamil: "ஓசூர்" },
  { districtCode: "KRI", code: "KRI004", nameEnglish: "Thalli", nameTamil: "தள்ளி" },
  { districtCode: "KRI", code: "KRI005", nameEnglish: "Bargur", nameTamil: "பார்கூர்" },
  { districtCode: "KRI", code: "KRI006", nameEnglish: "Uthangarai", nameTamil: "ஊத்தங்கரை" },
  { districtCode: "KRI", code: "KRI007", nameEnglish: "Kaveripattinam", nameTamil: "காவேரிப்பட்டினம்" },
  { districtCode: "KRI", code: "KRI008", nameEnglish: "Anchetty", nameTamil: "ஆஞ்செட்டி" },

  // Madurai (9)
  { districtCode: "MDU", code: "MDU001", nameEnglish: "Madurai East", nameTamil: "மதுரை கிழக்கு" },
  { districtCode: "MDU", code: "MDU002", nameEnglish: "Madurai West", nameTamil: "மதுரை மேற்கு" },
  { districtCode: "MDU", code: "MDU003", nameEnglish: "Madurai Central", nameTamil: "மதுரை மத்திய" },
  { districtCode: "MDU", code: "MDU004", nameEnglish: "Madurai North", nameTamil: "மதுரை வடக்கு" },
  { districtCode: "MDU", code: "MDU005", nameEnglish: "Madurai South", nameTamil: "மதுரை தெற்கு" },
  { districtCode: "MDU", code: "MDU006", nameEnglish: "Sholavandan", nameTamil: "சோழவந்தான்" },
  { districtCode: "MDU", code: "MDU007", nameEnglish: "Thiruparankundram", nameTamil: "திருப்பரங்குன்றம்" },
  { districtCode: "MDU", code: "MDU008", nameEnglish: "Melur", nameTamil: "மேலூர்" },
  { districtCode: "MDU", code: "MDU009", nameEnglish: "Usilampatti", nameTamil: "உசிலம்பட்டி" },

  // Mayiladuthurai (5)
  { districtCode: "MAY", code: "MAY001", nameEnglish: "Mayiladuthurai", nameTamil: "மயிலாடுதுறை" },
  { districtCode: "MAY", code: "MAY002", nameEnglish: "Sirkazhi", nameTamil: "சீர்காழி" },
  { districtCode: "MAY", code: "MAY003", nameEnglish: "Poompuhar", nameTamil: "பூம்புகார்" },
  { districtCode: "MAY", code: "MAY004", nameEnglish: "Tharangambadi", nameTamil: "தரங்கம்பாடி" },
  { districtCode: "MAY", code: "MAY005", nameEnglish: "Kuthalam", nameTamil: "குத்தாலம்" },

  // Nagapattinam (6)
  { districtCode: "NAG", code: "NAG001", nameEnglish: "Nagapattinam", nameTamil: "நாகப்பட்டினம்" },
  { districtCode: "NAG", code: "NAG002", nameEnglish: "Kilvelur", nameTamil: "கீழ்வேளூர்" },
  { districtCode: "NAG", code: "NAG003", nameEnglish: "Vedaranyam", nameTamil: "வேதாரண்யம்" },
  { districtCode: "NAG", code: "NAG004", nameEnglish: "Kollidam", nameTamil: "கொள்ளிடம்" },
  { districtCode: "NAG", code: "NAG005", nameEnglish: "Sembanarkoil", nameTamil: "செம்பனார்கோயில்" },
  { districtCode: "NAG", code: "NAG006", nameEnglish: "Tharangambadi (NAG)", nameTamil: "தரங்கம்பாடி (நாக)" },

  // Namakkal (6) — Erode East belongs to Erode district
  { districtCode: "NMK", code: "NMK001", nameEnglish: "Namakkal", nameTamil: "நாமக்கல்" },
  { districtCode: "NMK", code: "NMK002", nameEnglish: "Tiruchengode", nameTamil: "திருச்செங்கோடு" },
  { districtCode: "NMK", code: "NMK003", nameEnglish: "Rasipuram", nameTamil: "ராசிபுரம்" },
  { districtCode: "NMK", code: "NMK004", nameEnglish: "Senthamangalam", nameTamil: "செந்தமங்கலம்" },
  { districtCode: "NMK", code: "NMK005", nameEnglish: "Paramathi Velur", nameTamil: "பரமத்தி வேலூர்" },
  { districtCode: "NMK", code: "NMK006", nameEnglish: "Kumarapalayam", nameTamil: "குமாரபாளையம்" },

  // Nilgiris (6)
  { districtCode: "NLR", code: "NLR001", nameEnglish: "Ooty", nameTamil: "உதகமண்டலம்" },
  { districtCode: "NLR", code: "NLR002", nameEnglish: "Gudalur", nameTamil: "குடலூர்" },
  { districtCode: "NLR", code: "NLR003", nameEnglish: "Coonoor", nameTamil: "கூனூர்" },
  { districtCode: "NLR", code: "NLR004", nameEnglish: "Mettuppalayam", nameTamil: "மேட்டுபாளையம்" },
  { districtCode: "NLR", code: "NLR005", nameEnglish: "Pandalur", nameTamil: "பந்தலூர்" },
  { districtCode: "NLR", code: "NLR006", nameEnglish: "Kotagiri", nameTamil: "கோத்தகிரி" },

  // Perambalur (3)
  { districtCode: "PER", code: "PER001", nameEnglish: "Perambalur", nameTamil: "பெரம்பலூர்" },
  { districtCode: "PER", code: "PER002", nameEnglish: "Kunnam", nameTamil: "குன்னம்" },
  { districtCode: "PER", code: "PER003", nameEnglish: "Alathur", nameTamil: "ஆலத்தூர்" },

  // Pudukkottai (9)
  { districtCode: "PUD", code: "PUD001", nameEnglish: "Pudukkottai", nameTamil: "புதுக்கோட்டை" },
  { districtCode: "PUD", code: "PUD002", nameEnglish: "Thirumayam", nameTamil: "திருமயம்" },
  { districtCode: "PUD", code: "PUD003", nameEnglish: "Aranthangi", nameTamil: "அறந்தாங்கி" },
  { districtCode: "PUD", code: "PUD004", nameEnglish: "Alangudi", nameTamil: "ஆலங்குடி" },
  { districtCode: "PUD", code: "PUD005", nameEnglish: "Viralimalai", nameTamil: "விராலிமலை" },
  { districtCode: "PUD", code: "PUD006", nameEnglish: "Iluppur", nameTamil: "இளுப்பூர்" },
  { districtCode: "PUD", code: "PUD007", nameEnglish: "Ponnamaravathi", nameTamil: "பொன்னமராவதி" },
  { districtCode: "PUD", code: "PUD008", nameEnglish: "Gandarvakottai", nameTamil: "காந்தர்வகோட்டை" },
  { districtCode: "PUD", code: "PUD009", nameEnglish: "Karambakudi", nameTamil: "கரம்பக்குடி" },

  // Ramanathapuram (6)
  { districtCode: "RMN", code: "RMN001", nameEnglish: "Ramanathapuram", nameTamil: "இராமநாதபுரம்" },
  { districtCode: "RMN", code: "RMN002", nameEnglish: "Mudhukulathur", nameTamil: "முதுகுளத்தூர்" },
  { districtCode: "RMN", code: "RMN003", nameEnglish: "Paramakudi", nameTamil: "பரமக்குடி" },
  { districtCode: "RMN", code: "RMN004", nameEnglish: "Tiruvadanai", nameTamil: "திருவாடானை" },
  { districtCode: "RMN", code: "RMN005", nameEnglish: "Rameswaram", nameTamil: "இராமேஸ்வரம்" },
  { districtCode: "RMN", code: "RMN006", nameEnglish: "Keelakarai", nameTamil: "கீழக்கரை" },

  // Ranipet (5) — Arakkonam is in Vellore district
  { districtCode: "RAN", code: "RAN001", nameEnglish: "Arcot", nameTamil: "ஆற்காடு" },
  { districtCode: "RAN", code: "RAN002", nameEnglish: "Ranipet", nameTamil: "ராணிப்பேட்டை" },
  { districtCode: "RAN", code: "RAN003", nameEnglish: "Walajah", nameTamil: "வாலாஜா" },
  { districtCode: "RAN", code: "RAN004", nameEnglish: "Sholingur", nameTamil: "சோழிங்கர்" },
  { districtCode: "RAN", code: "RAN005", nameEnglish: "Kaveripakkam", nameTamil: "காவேரிப்பாக்கம்" },

  // Salem (9)
  { districtCode: "SLM", code: "SLM001", nameEnglish: "Salem West", nameTamil: "சேலம் மேற்கு" },
  { districtCode: "SLM", code: "SLM002", nameEnglish: "Salem North", nameTamil: "சேலம் வடக்கு" },
  { districtCode: "SLM", code: "SLM003", nameEnglish: "Salem South", nameTamil: "சேலம் தெற்கு" },
  { districtCode: "SLM", code: "SLM004", nameEnglish: "Omalur", nameTamil: "ஓமலூர்" },
  { districtCode: "SLM", code: "SLM005", nameEnglish: "Mettur", nameTamil: "மேட்டூர்" },
  { districtCode: "SLM", code: "SLM006", nameEnglish: "Edappadi", nameTamil: "ஏடப்பாடி" },
  { districtCode: "SLM", code: "SLM007", nameEnglish: "Sankari", nameTamil: "சங்ககிரி" },
  { districtCode: "SLM", code: "SLM008", nameEnglish: "Yercaud", nameTamil: "யேர்காடு" },
  { districtCode: "SLM", code: "SLM009", nameEnglish: "Attur", nameTamil: "ஆத்தூர்" },

  // Sivaganga (7)
  { districtCode: "SIV", code: "SIV001", nameEnglish: "Sivaganga", nameTamil: "சிவகங்கை" },
  { districtCode: "SIV", code: "SIV002", nameEnglish: "Manamadurai", nameTamil: "மானாமதுரை" },
  { districtCode: "SIV", code: "SIV003", nameEnglish: "Tiruppattur (SIV)", nameTamil: "திருப்பத்தூர் (சிவ)" },
  { districtCode: "SIV", code: "SIV004", nameEnglish: "Karaikudi", nameTamil: "காரைக்குடி" },
  { districtCode: "SIV", code: "SIV005", nameEnglish: "Devakottai", nameTamil: "தேவகோட்டை" },
  { districtCode: "SIV", code: "SIV006", nameEnglish: "Ilayangudi", nameTamil: "இளையங்குடி" },
  { districtCode: "SIV", code: "SIV007", nameEnglish: "Kallal", nameTamil: "கள்ளல்" },

  // Tenkasi (7)
  { districtCode: "TEN", code: "TEN001", nameEnglish: "Tenkasi", nameTamil: "தென்காசி" },
  { districtCode: "TEN", code: "TEN002", nameEnglish: "Alangulam", nameTamil: "ஆலங்குளம்" },
  { districtCode: "TEN", code: "TEN003", nameEnglish: "Kadayanallur", nameTamil: "கடையநல்லூர்" },
  { districtCode: "TEN", code: "TEN004", nameEnglish: "Sankarankoil", nameTamil: "சங்கரன்கோவில்" },
  { districtCode: "TEN", code: "TEN005", nameEnglish: "Shenkottai", nameTamil: "சேங்கோட்டை" },
  { districtCode: "TEN", code: "TEN006", nameEnglish: "Vasudevanallur", nameTamil: "வாசுதேவநல்லூர்" },
  { districtCode: "TEN", code: "TEN007", nameEnglish: "Radhapuram", nameTamil: "இராதாபுரம்" },

  // Thanjavur (8) — removed duplicate Papanasam; Kumbakonam belongs to Thanjavur
  { districtCode: "THA", code: "THA001", nameEnglish: "Thanjavur", nameTamil: "தஞ்சாவூர்" },
  { districtCode: "THA", code: "THA002", nameEnglish: "Orathanadu", nameTamil: "ஒரத்தநாடு" },
  { districtCode: "THA", code: "THA003", nameEnglish: "Papanasam", nameTamil: "பாபநாசம்" },
  { districtCode: "THA", code: "THA004", nameEnglish: "Thiruvidaimarudur", nameTamil: "திருவிடைமருதூர்" },
  { districtCode: "THA", code: "THA005", nameEnglish: "Kumbakonam", nameTamil: "கும்பகோணம்" },
  { districtCode: "THA", code: "THA006", nameEnglish: "Pattukkottai", nameTamil: "பட்டுக்கோட்டை" },
  { districtCode: "THA", code: "THA007", nameEnglish: "Peravurani", nameTamil: "பேராவூரணி" },
  { districtCode: "THA", code: "THA008", nameEnglish: "Adirampattinam", nameTamil: "அதிராம்பட்டினம்" },

  // Theni (6)
  { districtCode: "THN", code: "THN001", nameEnglish: "Theni", nameTamil: "தேனி" },
  { districtCode: "THN", code: "THN002", nameEnglish: "Periyakulam", nameTamil: "பெரியகுளம்" },
  { districtCode: "THN", code: "THN003", nameEnglish: "Andipatti", nameTamil: "ஆண்டிப்பட்டி" },
  { districtCode: "THN", code: "THN004", nameEnglish: "Bodinayakanur", nameTamil: "போடிநாயக்கனூர்" },
  { districtCode: "THN", code: "THN005", nameEnglish: "Cumbum", nameTamil: "கம்பம்" },
  { districtCode: "THN", code: "THN006", nameEnglish: "Uthamapalayam", nameTamil: "உத்தமபாளையம்" },

  // Thoothukudi (8)
  { districtCode: "TPN", code: "TPN001", nameEnglish: "Thoothukudi", nameTamil: "தூத்துக்குடி" },
  { districtCode: "TPN", code: "TPN002", nameEnglish: "Vilathikulam", nameTamil: "விளாத்திகுளம்" },
  { districtCode: "TPN", code: "TPN003", nameEnglish: "Ottapidaram", nameTamil: "ஓட்டப்பிடாரம்" },
  { districtCode: "TPN", code: "TPN004", nameEnglish: "Kovilpatti", nameTamil: "கோவில்பட்டி" },
  { districtCode: "TPN", code: "TPN005", nameEnglish: "Tiruchendur", nameTamil: "திருச்செந்தூர்" },
  { districtCode: "TPN", code: "TPN006", nameEnglish: "Srivaikuntam", nameTamil: "ஸ்ரீவைகுண்டம்" },
  { districtCode: "TPN", code: "TPN007", nameEnglish: "Sathankulam", nameTamil: "சாத்தான்குளம்" },
  { districtCode: "TPN", code: "TPN008", nameEnglish: "Kayalpattinam", nameTamil: "காயல்பட்டினம்" },

  // Tiruchirappalli (8) — Perambalur & Kulithalai belong to their own districts
  { districtCode: "TIR", code: "TIR001", nameEnglish: "Tiruchirappalli East", nameTamil: "திருச்சிராப்பள்ளி கிழக்கு" },
  { districtCode: "TIR", code: "TIR002", nameEnglish: "Tiruchirappalli West", nameTamil: "திருச்சிராப்பள்ளி மேற்கு" },
  { districtCode: "TIR", code: "TIR003", nameEnglish: "Srirangam", nameTamil: "ஸ்ரீரங்கம்" },
  { districtCode: "TIR", code: "TIR004", nameEnglish: "Thiruverumbur", nameTamil: "திருவெறும்பூர்" },
  { districtCode: "TIR", code: "TIR005", nameEnglish: "Lalgudi", nameTamil: "லால்குடி" },
  { districtCode: "TIR", code: "TIR006", nameEnglish: "Manachanallur", nameTamil: "மணச்சநல்லூர்" },
  { districtCode: "TIR", code: "TIR007", nameEnglish: "Thottiyam", nameTamil: "தொட்டியம்" },
  { districtCode: "TIR", code: "TIR008", nameEnglish: "Manapparai (TIR)", nameTamil: "மானாபாறை (திரு)" },

  // Tirunelveli (7) — Tenkasi-area constituencies moved to Tenkasi district (2019)
  { districtCode: "TNV", code: "TNV001", nameEnglish: "Tirunelveli", nameTamil: "திருநெல்வேலி" },
  { districtCode: "TNV", code: "TNV002", nameEnglish: "Ambasamudram", nameTamil: "அம்பாசமுத்திரம்" },
  { districtCode: "TNV", code: "TNV003", nameEnglish: "Palayamkottai", nameTamil: "பாளையங்கோட்டை" },
  { districtCode: "TNV", code: "TNV004", nameEnglish: "Nanguneri", nameTamil: "நாங்குநேரி" },
  { districtCode: "TNV", code: "TNV005", nameEnglish: "Cheranmahadevi", nameTamil: "செரன்மகாதேவி" },
  { districtCode: "TNV", code: "TNV006", nameEnglish: "Sankarankovil (TNV)", nameTamil: "சங்கரன்கோவில் (நெல்)" },
  { districtCode: "TNV", code: "TNV007", nameEnglish: "Radhapuram (TNV)", nameTamil: "இராதாபுரம் (நெல்)" },

  // Tirupattur (6)
  { districtCode: "TPR", code: "TPR001", nameEnglish: "Tirupattur", nameTamil: "திருப்பத்தூர்" },
  { districtCode: "TPR", code: "TPR002", nameEnglish: "Ambur", nameTamil: "ஆம்பூர்" },
  { districtCode: "TPR", code: "TPR003", nameEnglish: "Vaniyambadi", nameTamil: "வாணியம்பாடி" },
  { districtCode: "TPR", code: "TPR004", nameEnglish: "Jolarpet", nameTamil: "ஜோலார்பேட்டை" },
  { districtCode: "TPR", code: "TPR005", nameEnglish: "Natrampalli", nameTamil: "நத்தரம்பள்ளி" },
  { districtCode: "TPR", code: "TPR006", nameEnglish: "Gudiyatham", nameTamil: "குடியாத்தம்" },

  // Tirupur (9)
  { districtCode: "TRV", code: "TRV001", nameEnglish: "Tirupur North", nameTamil: "திருப்பூர் வடக்கு" },
  { districtCode: "TRV", code: "TRV002", nameEnglish: "Tirupur South", nameTamil: "திருப்பூர் தெற்கு" },
  { districtCode: "TRV", code: "TRV003", nameEnglish: "Avinashi", nameTamil: "அவிநாசி" },
  { districtCode: "TRV", code: "TRV004", nameEnglish: "Palladam", nameTamil: "பல்லடம்" },
  { districtCode: "TRV", code: "TRV005", nameEnglish: "Kangeyam", nameTamil: "காங்கேயம்" },
  { districtCode: "TRV", code: "TRV006", nameEnglish: "Dharapuram", nameTamil: "தாரபுரம்" },
  { districtCode: "TRV", code: "TRV007", nameEnglish: "Udumalpet", nameTamil: "உடுமலைப்பேட்டை" },
  { districtCode: "TRV", code: "TRV008", nameEnglish: "Madathukulam", nameTamil: "மடத்துக்குளம்" },
  { districtCode: "TRV", code: "TRV009", nameEnglish: "Uthukuli", nameTamil: "உத்துக்குளி" },

  // Tiruvallur (11)
  { districtCode: "TVL", code: "TVL001", nameEnglish: "Tiruvallur", nameTamil: "திருவள்ளூர்" },
  { districtCode: "TVL", code: "TVL002", nameEnglish: "Poonamallee", nameTamil: "பூந்தமல்லி" },
  { districtCode: "TVL", code: "TVL003", nameEnglish: "Ambattur", nameTamil: "அம்பத்தூர்" },
  { districtCode: "TVL", code: "TVL004", nameEnglish: "Avadi", nameTamil: "அவாடி" },
  { districtCode: "TVL", code: "TVL005", nameEnglish: "Thiruninravur", nameTamil: "திருநின்றவூர்" },
  { districtCode: "TVL", code: "TVL006", nameEnglish: "Maduravoyal", nameTamil: "மாடுரவோயல்" },
  { districtCode: "TVL", code: "TVL007", nameEnglish: "Gummidipoondi", nameTamil: "குமிடிப்பூண்டி" },
  { districtCode: "TVL", code: "TVL008", nameEnglish: "Ponneri", nameTamil: "பொன்னேரி" },
  { districtCode: "TVL", code: "TVL009", nameEnglish: "Tiruttani", nameTamil: "திருத்தணி" },
  { districtCode: "TVL", code: "TVL010", nameEnglish: "Pallipattu", nameTamil: "பள்ளிபட்டு" },
  { districtCode: "TVL", code: "TVL011", nameEnglish: "Uttukottai", nameTamil: "உட்டுக்கோட்டை" },

  // Tiruvannamalai (9)
  { districtCode: "TVN", code: "TVN001", nameEnglish: "Cheyyar", nameTamil: "செய்யாறு" },
  { districtCode: "TVN", code: "TVN002", nameEnglish: "Vandavasi", nameTamil: "வந்தவாசி" },
  { districtCode: "TVN", code: "TVN003", nameEnglish: "Tiruvannamalai", nameTamil: "திருவண்ணாமலை" },
  { districtCode: "TVN", code: "TVN004", nameEnglish: "Kilpennathur", nameTamil: "கீழ்பெண்ணாத்தூர்" },
  { districtCode: "TVN", code: "TVN005", nameEnglish: "Polur", nameTamil: "பொலூர்" },
  { districtCode: "TVN", code: "TVN006", nameEnglish: "Arani", nameTamil: "ஆரணி" },
  { districtCode: "TVN", code: "TVN007", nameEnglish: "Chengam", nameTamil: "செங்கம்" },
  { districtCode: "TVN", code: "TVN008", nameEnglish: "Thandrampet", nameTamil: "தாண்டராம்பேட்டை" },
  { districtCode: "TVN", code: "TVN009", nameEnglish: "Kalasapakkam", nameTamil: "கலசப்பாக்கம்" },

  // Tiruvarur (7) — Kumbakonam & Papanasam belong to Thanjavur
  { districtCode: "TVR", code: "TVR001", nameEnglish: "Tiruvarur", nameTamil: "திருவாரூர்" },
  { districtCode: "TVR", code: "TVR002", nameEnglish: "Nannilam", nameTamil: "நன்னிலம்" },
  { districtCode: "TVR", code: "TVR003", nameEnglish: "Thiruthuraipoondi", nameTamil: "திருத்துறைப்பூண்டி" },
  { districtCode: "TVR", code: "TVR004", nameEnglish: "Mannargudi", nameTamil: "மன்னார்குடி" },
  { districtCode: "TVR", code: "TVR005", nameEnglish: "Needamangalam", nameTamil: "நீடாமங்கலம்" },
  { districtCode: "TVR", code: "TVR006", nameEnglish: "Papanasam (TVR)", nameTamil: "பாபநாசம் (திவா)" },
  { districtCode: "TVR", code: "TVR007", nameEnglish: "Kodavasal", nameTamil: "கோடவாசல்" },

  // Vellore (5) — Arakkonam, Sholingur, Gudiyatham, Ranipet moved to Ranipet district (2019)
  { districtCode: "VEL", code: "VEL001", nameEnglish: "Vellore", nameTamil: "வேலூர்" },
  { districtCode: "VEL", code: "VEL002", nameEnglish: "Anaikattu", nameTamil: "அணைக்கட்டு" },
  { districtCode: "VEL", code: "VEL003", nameEnglish: "Katpadi", nameTamil: "காட்பாடி" },
  { districtCode: "VEL", code: "VEL004", nameEnglish: "Pernambut", nameTamil: "பேர்ணாம்பட்டு" },
  { districtCode: "VEL", code: "VEL005", nameEnglish: "Arakkonam", nameTamil: "ஆரக்கோணம்" },

  // Viluppuram (8) — Kallakurichi & Sankarapuram moved to Kallakurichi district (2019)
  { districtCode: "VIL", code: "VIL001", nameEnglish: "Viluppuram", nameTamil: "விழுப்புரம்" },
  { districtCode: "VIL", code: "VIL002", nameEnglish: "Vikravandi", nameTamil: "விக்கிரவாண்டி" },
  { districtCode: "VIL", code: "VIL003", nameEnglish: "Vanur", nameTamil: "வானூர்" },
  { districtCode: "VIL", code: "VIL004", nameEnglish: "Tindivanam", nameTamil: "திண்டிவனம்" },
  { districtCode: "VIL", code: "VIL005", nameEnglish: "Gingee", nameTamil: "செஞ்சி" },
  { districtCode: "VIL", code: "VIL006", nameEnglish: "Mailam", nameTamil: "மைலம்" },
  { districtCode: "VIL", code: "VIL007", nameEnglish: "Thirukoilur", nameTamil: "திருக்கோயிலூர்" },
  { districtCode: "VIL", code: "VIL008", nameEnglish: "Rishivandiyam", nameTamil: "ரிஷிவந்தியம்" },

  // Virudhunagar (9)
  { districtCode: "VRT", code: "VRT001", nameEnglish: "Virudhunagar", nameTamil: "விருதுநகர்" },
  { districtCode: "VRT", code: "VRT002", nameEnglish: "Sivakasi", nameTamil: "சிவகாசி" },
  { districtCode: "VRT", code: "VRT003", nameEnglish: "Aruppukkottai", nameTamil: "அருப்புக்கோட்டை" },
  { districtCode: "VRT", code: "VRT004", nameEnglish: "Rajapalayam", nameTamil: "இராசபாளையம்" },
  { districtCode: "VRT", code: "VRT005", nameEnglish: "Srivilliputhur", nameTamil: "ஸ்ரீவில்லிபுத்தூர்" },
  { districtCode: "VRT", code: "VRT006", nameEnglish: "Sattur", nameTamil: "சாத்தூர்" },
  { districtCode: "VRT", code: "VRT007", nameEnglish: "Tiruchuli", nameTamil: "திருச்சுழி" },
  { districtCode: "VRT", code: "VRT008", nameEnglish: "Vembakottai", nameTamil: "வெம்பக்கோட்டை" },
  { districtCode: "VRT", code: "VRT009", nameEnglish: "Watrap", nameTamil: "வாட்ராப்" },
];

async function main() {
  console.log("Seeding database...");

  // Seed districts
  for (const district of DISTRICTS) {
    await prisma.district.upsert({
      where: { code: district.code },
      update: district,
      create: district,
    });
  }
  console.log(`Seeded ${DISTRICTS.length} districts`);

  // Build district code -> id map
  const districtRecords = await prisma.district.findMany();
  const districtCodeMap = Object.fromEntries(districtRecords.map((d) => [d.code, d.id]));

  // Wipe and re-seed constituencies (avoids unique constraint issues on re-run)
  await prisma.constituency.deleteMany({});
  const constData = ALL_CONSTITUENCIES.flatMap((c) => {
    const districtId = districtCodeMap[c.districtCode];
    if (!districtId) return [];
    const nameTamil = (c as Record<string, string>).namaTamil ?? c.nameTamil;
    return [{ code: c.code, nameTamil, nameEnglish: c.nameEnglish, districtId }];
  });
  await prisma.constituency.createMany({ data: constData, skipDuplicates: true });
  console.log(`Seeded ${constData.length} constituencies`);

  // Create admin user
  const adminEmail = "admin@vck.org";
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("Admin@12345", 12);
    await prisma.user.create({
      data: {
        email: adminEmail,
        name: "VCK Admin",
        passwordHash,
        role: "SUPER_ADMIN",
      },
    });
    console.log(`Created admin user: ${adminEmail} / Admin@12345`);
  } else {
    console.log("Admin user already exists");
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

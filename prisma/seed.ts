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

// All 234 Tamil Nadu Assembly Constituencies — official 2021 delimitation
const ALL_CONSTITUENCIES: Array<{
  districtCode: string;
  code: string;
  nameEnglish: string;
  nameTamil: string;
}> = [
  // Thiruvallur (6)
  { districtCode: "TVL", code: "TVL001", nameEnglish: "Gummidipoondi", nameTamil: "குமிடிப்பூண்டி" },
  { districtCode: "TVL", code: "TVL002", nameEnglish: "Ponneri", nameTamil: "பொன்னேரி" },
  { districtCode: "TVL", code: "TVL003", nameEnglish: "Tiruttani", nameTamil: "திருத்தணி" },
  { districtCode: "TVL", code: "TVL004", nameEnglish: "Thiruvallur", nameTamil: "திருவள்ளூர்" },
  { districtCode: "TVL", code: "TVL005", nameEnglish: "Poonamallee", nameTamil: "பூந்தமல்லி" },
  { districtCode: "TVL", code: "TVL006", nameEnglish: "Avadi", nameTamil: "அவாடி" },

  // Chennai (22)
  { districtCode: "CHN", code: "CHN001", nameEnglish: "Maduravoyal", nameTamil: "மாடுரவோயல்" },
  { districtCode: "CHN", code: "CHN002", nameEnglish: "Ambattur", nameTamil: "அம்பத்தூர்" },
  { districtCode: "CHN", code: "CHN003", nameEnglish: "Madhavaram", nameTamil: "மாதவரம்" },
  { districtCode: "CHN", code: "CHN004", nameEnglish: "Thiruvottiyur", nameTamil: "திருவொற்றியூர்" },
  { districtCode: "CHN", code: "CHN005", nameEnglish: "Dr. Radhakrishnan Nagar", nameTamil: "டாக்டர் ராதாகிருஷ்ணன் நகர்" },
  { districtCode: "CHN", code: "CHN006", nameEnglish: "Perambur", nameTamil: "பெரம்பூர்" },
  { districtCode: "CHN", code: "CHN007", nameEnglish: "Kolathur", nameTamil: "கொளத்தூர்" },
  { districtCode: "CHN", code: "CHN008", nameEnglish: "Villivakkam", nameTamil: "விள்ளிவாக்கம்" },
  { districtCode: "CHN", code: "CHN009", nameEnglish: "Thiru-Vi-Ka-Nagar", nameTamil: "திரு வி.க. நகர்" },
  { districtCode: "CHN", code: "CHN010", nameEnglish: "Egmore", nameTamil: "எழும்பூர்" },
  { districtCode: "CHN", code: "CHN011", nameEnglish: "Royapuram", nameTamil: "ராயபுரம்" },
  { districtCode: "CHN", code: "CHN012", nameEnglish: "Harbour", nameTamil: "துறைமுகம்" },
  { districtCode: "CHN", code: "CHN013", nameEnglish: "Chepauk-Thiruvallikeni", nameTamil: "சேப்பாக்கம்-திருவல்லிக்கேணி" },
  { districtCode: "CHN", code: "CHN014", nameEnglish: "Thousand Lights", nameTamil: "ஆயிரம் விளக்கு" },
  { districtCode: "CHN", code: "CHN015", nameEnglish: "Anna Nagar", nameTamil: "அண்ணாநகர்" },
  { districtCode: "CHN", code: "CHN016", nameEnglish: "Virugambakkam", nameTamil: "விருகம்பாக்கம்" },
  { districtCode: "CHN", code: "CHN017", nameEnglish: "Saidapet", nameTamil: "சைதாப்பேட்டை" },
  { districtCode: "CHN", code: "CHN018", nameEnglish: "Thiyagarayanagar", nameTamil: "தியாகராயநகர்" },
  { districtCode: "CHN", code: "CHN019", nameEnglish: "Mylapore", nameTamil: "மயிலாப்பூர்" },
  { districtCode: "CHN", code: "CHN020", nameEnglish: "Velachery", nameTamil: "வேளச்சேரி" },
  { districtCode: "CHN", code: "CHN021", nameEnglish: "Sholinganallur", nameTamil: "சோழிங்கநல்லூர்" },
  { districtCode: "CHN", code: "CHN022", nameEnglish: "Alandur", nameTamil: "அலந்தூர்" },

  // Kancheepuram (2)
  { districtCode: "KAN", code: "KAN001", nameEnglish: "Sriperumbudur", nameTamil: "ஸ்ரீபெரும்புதூர்" },
  { districtCode: "KAN", code: "KAN002", nameEnglish: "Kancheepuram", nameTamil: "காஞ்சிபுரம்" },

  // Chengalpattu (6)
  { districtCode: "CGT", code: "CGT001", nameEnglish: "Pallavaram", nameTamil: "பல்லாவரம்" },
  { districtCode: "CGT", code: "CGT002", nameEnglish: "Tambaram", nameTamil: "தாம்பரம்" },
  { districtCode: "CGT", code: "CGT003", nameEnglish: "Chengalpattu", nameTamil: "செங்கல்பட்டு" },
  { districtCode: "CGT", code: "CGT004", nameEnglish: "Thiruporur", nameTamil: "திருப்போரூர்" },
  { districtCode: "CGT", code: "CGT005", nameEnglish: "Cheyyur", nameTamil: "செய்யூர்" },
  { districtCode: "CGT", code: "CGT006", nameEnglish: "Madurantakam", nameTamil: "மதுராந்தகம்" },

  // Ranipet (5)
  { districtCode: "RAN", code: "RAN001", nameEnglish: "Arakkonam", nameTamil: "ஆரக்கோணம்" },
  { districtCode: "RAN", code: "RAN002", nameEnglish: "Sholingur", nameTamil: "சோழிங்கர்" },
  { districtCode: "RAN", code: "RAN003", nameEnglish: "Ranipet", nameTamil: "ராணிப்பேட்டை" },
  { districtCode: "RAN", code: "RAN004", nameEnglish: "Arcot", nameTamil: "ஆற்காடு" },
  { districtCode: "RAN", code: "RAN005", nameEnglish: "Walajah", nameTamil: "வாலாஜா" },

  // Vellore (5)
  { districtCode: "VEL", code: "VEL001", nameEnglish: "Katpadi", nameTamil: "காட்பாடி" },
  { districtCode: "VEL", code: "VEL002", nameEnglish: "Vellore", nameTamil: "வேலூர்" },
  { districtCode: "VEL", code: "VEL003", nameEnglish: "Anaikattu", nameTamil: "அணைக்கட்டு" },
  { districtCode: "VEL", code: "VEL004", nameEnglish: "Kilvaithinankuppam", nameTamil: "கீழ்வைத்தீனன்குப்பம்" },
  { districtCode: "VEL", code: "VEL005", nameEnglish: "Gudiyatham", nameTamil: "குடியாத்தம்" },

  // Tirupattur (4)
  { districtCode: "TPR", code: "TPR001", nameEnglish: "Vaniyambadi", nameTamil: "வாணியம்பாடி" },
  { districtCode: "TPR", code: "TPR002", nameEnglish: "Ambur", nameTamil: "ஆம்பூர்" },
  { districtCode: "TPR", code: "TPR003", nameEnglish: "Jolarpet", nameTamil: "ஜோலார்பேட்டை" },
  { districtCode: "TPR", code: "TPR004", nameEnglish: "Tirupattur", nameTamil: "திருப்பத்தூர்" },

  // Krishnagiri (6)
  { districtCode: "KRI", code: "KRI001", nameEnglish: "Uthangarai", nameTamil: "ஊத்தங்கரை" },
  { districtCode: "KRI", code: "KRI002", nameEnglish: "Bargur", nameTamil: "பார்கூர்" },
  { districtCode: "KRI", code: "KRI003", nameEnglish: "Krishnagiri", nameTamil: "கிருஷ்ணகிரி" },
  { districtCode: "KRI", code: "KRI004", nameEnglish: "Veppanahalli", nameTamil: "வேப்பனஹள்ளி" },
  { districtCode: "KRI", code: "KRI005", nameEnglish: "Hosur", nameTamil: "ஓசூர்" },
  { districtCode: "KRI", code: "KRI006", nameEnglish: "Thalli", nameTamil: "தள்ளி" },

  // Dharmapuri (5)
  { districtCode: "DHR", code: "DHR001", nameEnglish: "Palacode", nameTamil: "பாலக்கோடு" },
  { districtCode: "DHR", code: "DHR002", nameEnglish: "Pennagaram", nameTamil: "பெண்ணாகரம்" },
  { districtCode: "DHR", code: "DHR003", nameEnglish: "Dharmapuri", nameTamil: "தர்மபுரி" },
  { districtCode: "DHR", code: "DHR004", nameEnglish: "Pappireddipatti", nameTamil: "பாப்பிரெட்டிப்பட்டி" },
  { districtCode: "DHR", code: "DHR005", nameEnglish: "Harur", nameTamil: "அரூர்" },

  // Tiruvannamalai (8)
  { districtCode: "TVN", code: "TVN001", nameEnglish: "Chengam", nameTamil: "செங்கம்" },
  { districtCode: "TVN", code: "TVN002", nameEnglish: "Tiruvannamalai", nameTamil: "திருவண்ணாமலை" },
  { districtCode: "TVN", code: "TVN003", nameEnglish: "Kilpennathur", nameTamil: "கீழ்பெண்ணாத்தூர்" },
  { districtCode: "TVN", code: "TVN004", nameEnglish: "Kalasapakkam", nameTamil: "கலசப்பாக்கம்" },
  { districtCode: "TVN", code: "TVN005", nameEnglish: "Polur", nameTamil: "பொலூர்" },
  { districtCode: "TVN", code: "TVN006", nameEnglish: "Arani", nameTamil: "ஆரணி" },
  { districtCode: "TVN", code: "TVN007", nameEnglish: "Cheyyar", nameTamil: "செய்யாறு" },
  { districtCode: "TVN", code: "TVN008", nameEnglish: "Vandavasi", nameTamil: "வந்தவாசி" },

  // Viluppuram (7)
  { districtCode: "VIL", code: "VIL001", nameEnglish: "Gingee", nameTamil: "செஞ்சி" },
  { districtCode: "VIL", code: "VIL002", nameEnglish: "Mailam", nameTamil: "மைலம்" },
  { districtCode: "VIL", code: "VIL003", nameEnglish: "Tindivanam", nameTamil: "திண்டிவனம்" },
  { districtCode: "VIL", code: "VIL004", nameEnglish: "Vanur", nameTamil: "வானூர்" },
  { districtCode: "VIL", code: "VIL005", nameEnglish: "Viluppuram", nameTamil: "விழுப்புரம்" },
  { districtCode: "VIL", code: "VIL006", nameEnglish: "Vikravandi", nameTamil: "விக்கிரவாண்டி" },
  { districtCode: "VIL", code: "VIL007", nameEnglish: "Tirukoilur", nameTamil: "திருக்கோயிலூர்" },

  // Kallakurichi (4)
  { districtCode: "KAL", code: "KAL001", nameEnglish: "Ulundurpet", nameTamil: "உளுந்தூர்பேட்டை" },
  { districtCode: "KAL", code: "KAL002", nameEnglish: "Rishivandiyam", nameTamil: "ரிஷிவந்தியம்" },
  { districtCode: "KAL", code: "KAL003", nameEnglish: "Sankarapuram", nameTamil: "சங்கராபுரம்" },
  { districtCode: "KAL", code: "KAL004", nameEnglish: "Kallakurichi", nameTamil: "கள்ளக்குறிச்சி" },

  // Salem (11)
  { districtCode: "SLM", code: "SLM001", nameEnglish: "Gangavalli", nameTamil: "காங்கவல்லி" },
  { districtCode: "SLM", code: "SLM002", nameEnglish: "Attur", nameTamil: "ஆத்தூர்" },
  { districtCode: "SLM", code: "SLM003", nameEnglish: "Yercaud", nameTamil: "யேர்காடு" },
  { districtCode: "SLM", code: "SLM004", nameEnglish: "Omalur", nameTamil: "ஓமலூர்" },
  { districtCode: "SLM", code: "SLM005", nameEnglish: "Mettur", nameTamil: "மேட்டூர்" },
  { districtCode: "SLM", code: "SLM006", nameEnglish: "Edappadi", nameTamil: "ஏடப்பாடி" },
  { districtCode: "SLM", code: "SLM007", nameEnglish: "Sankari", nameTamil: "சங்ககிரி" },
  { districtCode: "SLM", code: "SLM008", nameEnglish: "Salem West", nameTamil: "சேலம் மேற்கு" },
  { districtCode: "SLM", code: "SLM009", nameEnglish: "Salem North", nameTamil: "சேலம் வடக்கு" },
  { districtCode: "SLM", code: "SLM010", nameEnglish: "Salem South", nameTamil: "சேலம் தெற்கு" },
  { districtCode: "SLM", code: "SLM011", nameEnglish: "Veerapandi", nameTamil: "வீரபாண்டி" },

  // Namakkal (6)
  { districtCode: "NMK", code: "NMK001", nameEnglish: "Rasipuram", nameTamil: "ராசிபுரம்" },
  { districtCode: "NMK", code: "NMK002", nameEnglish: "Senthamangalam", nameTamil: "செந்தமங்கலம்" },
  { districtCode: "NMK", code: "NMK003", nameEnglish: "Namakkal", nameTamil: "நாமக்கல்" },
  { districtCode: "NMK", code: "NMK004", nameEnglish: "Paramathi Velur", nameTamil: "பரமத்தி வேலூர்" },
  { districtCode: "NMK", code: "NMK005", nameEnglish: "Tiruchengode", nameTamil: "திருச்செங்கோடு" },
  { districtCode: "NMK", code: "NMK006", nameEnglish: "Kumarapalayam", nameTamil: "குமாரபாளையம்" },

  // Erode (3)
  { districtCode: "EDE", code: "EDE001", nameEnglish: "Erode East", nameTamil: "ஈரோடு கிழக்கு" },
  { districtCode: "EDE", code: "EDE002", nameEnglish: "Erode West", nameTamil: "ஈரோடு மேற்கு" },
  { districtCode: "EDE", code: "EDE003", nameEnglish: "Modakkurichi", nameTamil: "மொடக்குறிச்சி" },

  // Tirupur (13)
  { districtCode: "TRV", code: "TRV001", nameEnglish: "Dharapuram", nameTamil: "தாரபுரம்" },
  { districtCode: "TRV", code: "TRV002", nameEnglish: "Kangeyam", nameTamil: "காங்கேயம்" },
  { districtCode: "TRV", code: "TRV003", nameEnglish: "Perundurai", nameTamil: "பெருந்துறை" },
  { districtCode: "TRV", code: "TRV004", nameEnglish: "Bhavani", nameTamil: "பவானி" },
  { districtCode: "TRV", code: "TRV005", nameEnglish: "Anthiyur", nameTamil: "அந்தியூர்" },
  { districtCode: "TRV", code: "TRV006", nameEnglish: "Gobichettipalayam", nameTamil: "கோபிசெட்டிபாளையம்" },
  { districtCode: "TRV", code: "TRV007", nameEnglish: "Bhavanisagar", nameTamil: "பவானிசாகர்" },
  { districtCode: "TRV", code: "TRV008", nameEnglish: "Avinashi", nameTamil: "அவிநாசி" },
  { districtCode: "TRV", code: "TRV009", nameEnglish: "Tirupur North", nameTamil: "திருப்பூர் வடக்கு" },
  { districtCode: "TRV", code: "TRV010", nameEnglish: "Tirupur South", nameTamil: "திருப்பூர் தெற்கு" },
  { districtCode: "TRV", code: "TRV011", nameEnglish: "Palladam", nameTamil: "பல்லடம்" },
  { districtCode: "TRV", code: "TRV012", nameEnglish: "Udumalpet", nameTamil: "உடுமலைப்பேட்டை" },
  { districtCode: "TRV", code: "TRV013", nameEnglish: "Madathukulam", nameTamil: "மடத்துக்குளம்" },

  // Nilgiris (3)
  { districtCode: "NLR", code: "NLR001", nameEnglish: "Udhagamandalam", nameTamil: "உதகமண்டலம்" },
  { districtCode: "NLR", code: "NLR002", nameEnglish: "Gudalur", nameTamil: "குடலூர்" },
  { districtCode: "NLR", code: "NLR003", nameEnglish: "Coonoor", nameTamil: "கூனூர்" },

  // Coimbatore (10)
  { districtCode: "CBE", code: "CBE001", nameEnglish: "Mettupalayam", nameTamil: "மேட்டுபாளையம்" },
  { districtCode: "CBE", code: "CBE002", nameEnglish: "Sulur", nameTamil: "சூலூர்" },
  { districtCode: "CBE", code: "CBE003", nameEnglish: "Kavundampalayam", nameTamil: "கவுண்டம்பாளையம்" },
  { districtCode: "CBE", code: "CBE004", nameEnglish: "Coimbatore North", nameTamil: "கோயம்புத்தூர் வடக்கு" },
  { districtCode: "CBE", code: "CBE005", nameEnglish: "Thondamuthur", nameTamil: "தொண்டாமுத்தூர்" },
  { districtCode: "CBE", code: "CBE006", nameEnglish: "Coimbatore South", nameTamil: "கோயம்புத்தூர் தெற்கு" },
  { districtCode: "CBE", code: "CBE007", nameEnglish: "Singanallur", nameTamil: "சிங்கநல்லூர்" },
  { districtCode: "CBE", code: "CBE008", nameEnglish: "Kinathukadavu", nameTamil: "கிணத்துக்கடவு" },
  { districtCode: "CBE", code: "CBE009", nameEnglish: "Pollachi", nameTamil: "பொள்ளாச்சி" },
  { districtCode: "CBE", code: "CBE010", nameEnglish: "Valparai", nameTamil: "வால்பாறை" },

  // Dindigul (7)
  { districtCode: "DIN", code: "DIN001", nameEnglish: "Palani", nameTamil: "பழனி" },
  { districtCode: "DIN", code: "DIN002", nameEnglish: "Oddanchatram", nameTamil: "ஒட்டன்சத்திரம்" },
  { districtCode: "DIN", code: "DIN003", nameEnglish: "Athoor", nameTamil: "ஆத்தூர்" },
  { districtCode: "DIN", code: "DIN004", nameEnglish: "Nilakottai", nameTamil: "நிலக்கோட்டை" },
  { districtCode: "DIN", code: "DIN005", nameEnglish: "Natham", nameTamil: "நாத்தம்" },
  { districtCode: "DIN", code: "DIN006", nameEnglish: "Dindigul", nameTamil: "திண்டுக்கல்" },
  { districtCode: "DIN", code: "DIN007", nameEnglish: "Vedasandur", nameTamil: "வேடசந்தூர்" },

  // Karur (4)
  { districtCode: "KAR", code: "KAR001", nameEnglish: "Aravakurichi", nameTamil: "அரவக்குறிச்சி" },
  { districtCode: "KAR", code: "KAR002", nameEnglish: "Karur", nameTamil: "கரூர்" },
  { districtCode: "KAR", code: "KAR003", nameEnglish: "Krishnarayapuram", nameTamil: "கிருஷ்ணராயபுரம்" },
  { districtCode: "KAR", code: "KAR004", nameEnglish: "Kulithalai", nameTamil: "குளித்தலை" },

  // Tiruchirappalli (9)
  { districtCode: "TIR", code: "TIR001", nameEnglish: "Manapparai", nameTamil: "மானாபாறை" },
  { districtCode: "TIR", code: "TIR002", nameEnglish: "Srirangam", nameTamil: "ஸ்ரீரங்கம்" },
  { districtCode: "TIR", code: "TIR003", nameEnglish: "Tiruchirappalli West", nameTamil: "திருச்சிராப்பள்ளி மேற்கு" },
  { districtCode: "TIR", code: "TIR004", nameEnglish: "Tiruchirappalli East", nameTamil: "திருச்சிராப்பள்ளி கிழக்கு" },
  { districtCode: "TIR", code: "TIR005", nameEnglish: "Thiruverumbur", nameTamil: "திருவெறும்பூர்" },
  { districtCode: "TIR", code: "TIR006", nameEnglish: "Lalgudi", nameTamil: "லால்குடி" },
  { districtCode: "TIR", code: "TIR007", nameEnglish: "Manachanallur", nameTamil: "மணச்சநல்லூர்" },
  { districtCode: "TIR", code: "TIR008", nameEnglish: "Musiri", nameTamil: "முசிறி" },
  { districtCode: "TIR", code: "TIR009", nameEnglish: "Thuraiyur", nameTamil: "துறையூர்" },

  // Perambalur (2)
  { districtCode: "PER", code: "PER001", nameEnglish: "Perambalur", nameTamil: "பெரம்பலூர்" },
  { districtCode: "PER", code: "PER002", nameEnglish: "Kunnam", nameTamil: "குன்னம்" },

  // Ariyalur (2)
  { districtCode: "ARY", code: "ARY001", nameEnglish: "Ariyalur", nameTamil: "அரியலூர்" },
  { districtCode: "ARY", code: "ARY002", nameEnglish: "Jayankondam", nameTamil: "ஜெயங்கொண்டம்" },

  // Cuddalore (9)
  { districtCode: "CUD", code: "CUD001", nameEnglish: "Tittakudi", nameTamil: "தித்தகுடி" },
  { districtCode: "CUD", code: "CUD002", nameEnglish: "Vriddhachalam", nameTamil: "விருத்தாசலம்" },
  { districtCode: "CUD", code: "CUD003", nameEnglish: "Neyveli", nameTamil: "நெய்வேலி" },
  { districtCode: "CUD", code: "CUD004", nameEnglish: "Panruti", nameTamil: "பண்ருட்டி" },
  { districtCode: "CUD", code: "CUD005", nameEnglish: "Cuddalore", nameTamil: "கடலூர்" },
  { districtCode: "CUD", code: "CUD006", nameEnglish: "Kurinjipadi", nameTamil: "குறிஞ்சிப்பாடி" },
  { districtCode: "CUD", code: "CUD007", nameEnglish: "Bhuvanagiri", nameTamil: "புவனகிரி" },
  { districtCode: "CUD", code: "CUD008", nameEnglish: "Chidambaram", nameTamil: "சிதம்பரம்" },
  { districtCode: "CUD", code: "CUD009", nameEnglish: "Kattumannarkoil", nameTamil: "கட்டுமன்னார்கோயில்" },

  // Mayiladuthurai (3)
  { districtCode: "MAY", code: "MAY001", nameEnglish: "Sirkazhi", nameTamil: "சீர்காழி" },
  { districtCode: "MAY", code: "MAY002", nameEnglish: "Mayiladuthurai", nameTamil: "மயிலாடுதுறை" },
  { districtCode: "MAY", code: "MAY003", nameEnglish: "Poompuhar", nameTamil: "பூம்புகார்" },

  // Nagapattinam (3)
  { districtCode: "NAG", code: "NAG001", nameEnglish: "Nagapattinam", nameTamil: "நாகப்பட்டினம்" },
  { districtCode: "NAG", code: "NAG002", nameEnglish: "Kilvelur", nameTamil: "கீழ்வேளூர்" },
  { districtCode: "NAG", code: "NAG003", nameEnglish: "Vedaranyam", nameTamil: "வேதாரண்யம்" },

  // Tiruvarur (4)
  { districtCode: "TVR", code: "TVR001", nameEnglish: "Thiruthuraipoondi", nameTamil: "திருத்துறைப்பூண்டி" },
  { districtCode: "TVR", code: "TVR002", nameEnglish: "Mannargudi", nameTamil: "மன்னார்குடி" },
  { districtCode: "TVR", code: "TVR003", nameEnglish: "Tiruvarur", nameTamil: "திருவாரூர்" },
  { districtCode: "TVR", code: "TVR004", nameEnglish: "Nannilam", nameTamil: "நன்னிலம்" },

  // Thanjavur (8)
  { districtCode: "THA", code: "THA001", nameEnglish: "Thiruvidaimarudur", nameTamil: "திருவிடைமருதூர்" },
  { districtCode: "THA", code: "THA002", nameEnglish: "Kumbakonam", nameTamil: "கும்பகோணம்" },
  { districtCode: "THA", code: "THA003", nameEnglish: "Papanasam", nameTamil: "பாபநாசம்" },
  { districtCode: "THA", code: "THA004", nameEnglish: "Thiruvaiyaru", nameTamil: "திருவையாறு" },
  { districtCode: "THA", code: "THA005", nameEnglish: "Thanjavur", nameTamil: "தஞ்சாவூர்" },
  { districtCode: "THA", code: "THA006", nameEnglish: "Orathanadu", nameTamil: "ஒரத்தநாடு" },
  { districtCode: "THA", code: "THA007", nameEnglish: "Pattukkottai", nameTamil: "பட்டுக்கோட்டை" },
  { districtCode: "THA", code: "THA008", nameEnglish: "Peravurani", nameTamil: "பேராவூரணி" },

  // Pudukkottai (6)
  { districtCode: "PUD", code: "PUD001", nameEnglish: "Gandharvakottai", nameTamil: "காந்தர்வகோட்டை" },
  { districtCode: "PUD", code: "PUD002", nameEnglish: "Viralimalai", nameTamil: "விராலிமலை" },
  { districtCode: "PUD", code: "PUD003", nameEnglish: "Pudukkottai", nameTamil: "புதுக்கோட்டை" },
  { districtCode: "PUD", code: "PUD004", nameEnglish: "Thirumayam", nameTamil: "திருமயம்" },
  { districtCode: "PUD", code: "PUD005", nameEnglish: "Alangudi", nameTamil: "ஆலங்குடி" },
  { districtCode: "PUD", code: "PUD006", nameEnglish: "Aranthangi", nameTamil: "அறந்தாங்கி" },

  // Sivaganga (4)
  { districtCode: "SIV", code: "SIV001", nameEnglish: "Karaikudi", nameTamil: "காரைக்குடி" },
  { districtCode: "SIV", code: "SIV002", nameEnglish: "Tiruppattur", nameTamil: "திருப்பத்தூர்" },
  { districtCode: "SIV", code: "SIV003", nameEnglish: "Sivaganga", nameTamil: "சிவகங்கை" },
  { districtCode: "SIV", code: "SIV004", nameEnglish: "Manamadurai", nameTamil: "மானாமதுரை" },

  // Madurai (10)
  { districtCode: "MDU", code: "MDU001", nameEnglish: "Melur", nameTamil: "மேலூர்" },
  { districtCode: "MDU", code: "MDU002", nameEnglish: "Madurai East", nameTamil: "மதுரை கிழக்கு" },
  { districtCode: "MDU", code: "MDU003", nameEnglish: "Sholavandan", nameTamil: "சோழவந்தான்" },
  { districtCode: "MDU", code: "MDU004", nameEnglish: "Madurai North", nameTamil: "மதுரை வடக்கு" },
  { districtCode: "MDU", code: "MDU005", nameEnglish: "Madurai South", nameTamil: "மதுரை தெற்கு" },
  { districtCode: "MDU", code: "MDU006", nameEnglish: "Madurai Central", nameTamil: "மதுரை மத்திய" },
  { districtCode: "MDU", code: "MDU007", nameEnglish: "Madurai West", nameTamil: "மதுரை மேற்கு" },
  { districtCode: "MDU", code: "MDU008", nameEnglish: "Thiruparankundram", nameTamil: "திருப்பரங்குன்றம்" },
  { districtCode: "MDU", code: "MDU009", nameEnglish: "Tirumangalam", nameTamil: "திருமங்கலம்" },
  { districtCode: "MDU", code: "MDU010", nameEnglish: "Usilampatti", nameTamil: "உசிலம்பட்டி" },

  // Theni (4)
  { districtCode: "THN", code: "THN001", nameEnglish: "Andipatti", nameTamil: "ஆண்டிப்பட்டி" },
  { districtCode: "THN", code: "THN002", nameEnglish: "Periyakulam", nameTamil: "பெரியகுளம்" },
  { districtCode: "THN", code: "THN003", nameEnglish: "Bodinayakanur", nameTamil: "போடிநாயக்கனூர்" },
  { districtCode: "THN", code: "THN004", nameEnglish: "Cumbum", nameTamil: "கம்பம்" },

  // Virudhunagar (7)
  { districtCode: "VRT", code: "VRT001", nameEnglish: "Rajapalayam", nameTamil: "இராசபாளையம்" },
  { districtCode: "VRT", code: "VRT002", nameEnglish: "Srivilliputhur", nameTamil: "ஸ்ரீவில்லிபுத்தூர்" },
  { districtCode: "VRT", code: "VRT003", nameEnglish: "Sattur", nameTamil: "சாத்தூர்" },
  { districtCode: "VRT", code: "VRT004", nameEnglish: "Sivakasi", nameTamil: "சிவகாசி" },
  { districtCode: "VRT", code: "VRT005", nameEnglish: "Virudhunagar", nameTamil: "விருதுநகர்" },
  { districtCode: "VRT", code: "VRT006", nameEnglish: "Aruppukkottai", nameTamil: "அருப்புக்கோட்டை" },
  { districtCode: "VRT", code: "VRT007", nameEnglish: "Tiruchuli", nameTamil: "திருச்சுழி" },

  // Ramanathapuram (4)
  { districtCode: "RMN", code: "RMN001", nameEnglish: "Paramakudi", nameTamil: "பரமக்குடி" },
  { districtCode: "RMN", code: "RMN002", nameEnglish: "Tiruvadanai", nameTamil: "திருவாடானை" },
  { districtCode: "RMN", code: "RMN003", nameEnglish: "Ramanathapuram", nameTamil: "இராமநாதபுரம்" },
  { districtCode: "RMN", code: "RMN004", nameEnglish: "Mudhukulathur", nameTamil: "முதுகுளத்தூர்" },

  // Thoothukudi (6)
  { districtCode: "TPN", code: "TPN001", nameEnglish: "Vilathikulam", nameTamil: "விளாத்திகுளம்" },
  { districtCode: "TPN", code: "TPN002", nameEnglish: "Thoothukudi", nameTamil: "தூத்துக்குடி" },
  { districtCode: "TPN", code: "TPN003", nameEnglish: "Tiruchendur", nameTamil: "திருச்செந்தூர்" },
  { districtCode: "TPN", code: "TPN004", nameEnglish: "Srivaikuntam", nameTamil: "ஸ்ரீவைகுண்டம்" },
  { districtCode: "TPN", code: "TPN005", nameEnglish: "Ottapidaram", nameTamil: "ஓட்டப்பிடாரம்" },
  { districtCode: "TPN", code: "TPN006", nameEnglish: "Kovilpatti", nameTamil: "கோவில்பட்டி" },

  // Tenkasi (5)
  { districtCode: "TEN", code: "TEN001", nameEnglish: "Sankarankovil", nameTamil: "சங்கரன்கோவில்" },
  { districtCode: "TEN", code: "TEN002", nameEnglish: "Vasudevanallur", nameTamil: "வாசுதேவநல்லூர்" },
  { districtCode: "TEN", code: "TEN003", nameEnglish: "Kadayanallur", nameTamil: "கடையநல்லூர்" },
  { districtCode: "TEN", code: "TEN004", nameEnglish: "Tenkasi", nameTamil: "தென்காசி" },
  { districtCode: "TEN", code: "TEN005", nameEnglish: "Alangulam", nameTamil: "ஆலங்குளம்" },

  // Tirunelveli (5)
  { districtCode: "TNV", code: "TNV001", nameEnglish: "Tirunelveli", nameTamil: "திருநெல்வேலி" },
  { districtCode: "TNV", code: "TNV002", nameEnglish: "Ambasamudram", nameTamil: "அம்பாசமுத்திரம்" },
  { districtCode: "TNV", code: "TNV003", nameEnglish: "Palayamkottai", nameTamil: "பாளையங்கோட்டை" },
  { districtCode: "TNV", code: "TNV004", nameEnglish: "Nanguneri", nameTamil: "நாங்குநேரி" },
  { districtCode: "TNV", code: "TNV005", nameEnglish: "Radhapuram", nameTamil: "இராதாபுரம்" },

  // Kanniyakumari (6)
  { districtCode: "KKN", code: "KKN001", nameEnglish: "Kanyakumari", nameTamil: "கன்னியாகுமரி" },
  { districtCode: "KKN", code: "KKN002", nameEnglish: "Nagercoil", nameTamil: "நாகர்கோவில்" },
  { districtCode: "KKN", code: "KKN003", nameEnglish: "Colachel", nameTamil: "கொல்லாச்சல்" },
  { districtCode: "KKN", code: "KKN004", nameEnglish: "Padmanabhapuram", nameTamil: "பத்மனாபாபுரம்" },
  { districtCode: "KKN", code: "KKN005", nameEnglish: "Vilavancode", nameTamil: "விளவங்கோடு" },
  { districtCode: "KKN", code: "KKN006", nameEnglish: "Killiyoor", nameTamil: "கிள்ளியூர்" },
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

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

// All 234 Tamil Nadu Assembly Constituencies — official order (Election Commission GELS 2024)
const ALL_CONSTITUENCIES: Array<{
  districtCode: string;
  code: string;
  nameEnglish: string;
  nameTamil: string;
}> = [
  { districtCode: "TVL", code: "AC001", nameEnglish: "Gummidipoondi", nameTamil: "குமிடிப்பூண்டி" },
  { districtCode: "TVL", code: "AC002", nameEnglish: "Ponneri", nameTamil: "பொன்னேரி" },
  { districtCode: "TVL", code: "AC003", nameEnglish: "Tiruttani", nameTamil: "திருத்தணி" },
  { districtCode: "TVL", code: "AC004", nameEnglish: "Thiruvallur", nameTamil: "திருவள்ளூர்" },
  { districtCode: "TVL", code: "AC005", nameEnglish: "Poonamallee", nameTamil: "பூந்தமல்லி" },
  { districtCode: "TVL", code: "AC006", nameEnglish: "Avadi", nameTamil: "அவாடி" },
  { districtCode: "TVL", code: "AC007", nameEnglish: "Maduravoyal", nameTamil: "மாடுரவோயல்" },
  { districtCode: "TVL", code: "AC008", nameEnglish: "Ambattur", nameTamil: "அம்பத்தூர்" },
  { districtCode: "TVL", code: "AC009", nameEnglish: "Madhavaram", nameTamil: "மாதவரம்" },
  { districtCode: "CHN", code: "AC010", nameEnglish: "Thiruvottiyur", nameTamil: "திருவொற்றியூர்" },
  { districtCode: "CHN", code: "AC011", nameEnglish: "Dr. Radhakrishnan Nagar", nameTamil: "டாக்டர் ராதாகிருஷ்ணன் நகர்" },
  { districtCode: "CHN", code: "AC012", nameEnglish: "Perambur", nameTamil: "பெரம்பூர்" },
  { districtCode: "CHN", code: "AC013", nameEnglish: "Kolathur", nameTamil: "கொளத்தூர்" },
  { districtCode: "CHN", code: "AC014", nameEnglish: "Villivakkam", nameTamil: "விள்ளிவாக்கம்" },
  { districtCode: "CHN", code: "AC015", nameEnglish: "Thiru-Vi-Ka-Nagar", nameTamil: "திரு வி.க. நகர்" },
  { districtCode: "CHN", code: "AC016", nameEnglish: "Egmore", nameTamil: "எழும்பூர்" },
  { districtCode: "CHN", code: "AC017", nameEnglish: "Royapuram", nameTamil: "ராயபுரம்" },
  { districtCode: "CHN", code: "AC018", nameEnglish: "Harbour", nameTamil: "துறைமுகம்" },
  { districtCode: "CHN", code: "AC019", nameEnglish: "Chepauk-Thiruvallikeni", nameTamil: "சேப்பாக்கம்-திருவல்லிக்கேணி" },
  { districtCode: "CHN", code: "AC020", nameEnglish: "Thousand Lights", nameTamil: "ஆயிரம் விளக்கு" },
  { districtCode: "CHN", code: "AC021", nameEnglish: "Anna Nagar", nameTamil: "அண்ணாநகர்" },
  { districtCode: "CHN", code: "AC022", nameEnglish: "Virugambakkam", nameTamil: "விருகம்பாக்கம்" },
  { districtCode: "CHN", code: "AC023", nameEnglish: "Saidapet", nameTamil: "சைதாப்பேட்டை" },
  { districtCode: "CHN", code: "AC024", nameEnglish: "Thiyagarayanagar", nameTamil: "தியாகராயநகர்" },
  { districtCode: "CHN", code: "AC025", nameEnglish: "Mylapore", nameTamil: "மயிலாப்பூர்" },
  { districtCode: "CHN", code: "AC026", nameEnglish: "Velachery", nameTamil: "வேளச்சேரி" },
  { districtCode: "CHN", code: "AC027", nameEnglish: "Sholinganallur", nameTamil: "சோழிங்கநல்லூர்" },
  { districtCode: "CGT", code: "AC028", nameEnglish: "Alandur", nameTamil: "அலந்தூர்" },
  { districtCode: "KAN", code: "AC029", nameEnglish: "Sriperumbudur", nameTamil: "ஸ்ரீபெரும்புதூர்" },
  { districtCode: "CGT", code: "AC030", nameEnglish: "Pallavaram", nameTamil: "பல்லாவரம்" },
  { districtCode: "CGT", code: "AC031", nameEnglish: "Tambaram", nameTamil: "தாம்பரம்" },
  { districtCode: "CGT", code: "AC032", nameEnglish: "Chengalpattu", nameTamil: "செங்கல்பட்டு" },
  { districtCode: "CGT", code: "AC033", nameEnglish: "Thiruporur", nameTamil: "திருப்போரூர்" },
  { districtCode: "CGT", code: "AC034", nameEnglish: "Cheyyur", nameTamil: "செய்யூர்" },
  { districtCode: "CGT", code: "AC035", nameEnglish: "Madurantakam", nameTamil: "மதுராந்தகம்" },
  { districtCode: "KAN", code: "AC036", nameEnglish: "Uthiramerur", nameTamil: "உத்தரமேரூர்" },
  { districtCode: "KAN", code: "AC037", nameEnglish: "Kancheepuram", nameTamil: "காஞ்சிபுரம்" },
  { districtCode: "RAN", code: "AC038", nameEnglish: "Arakkonam", nameTamil: "ஆரக்கோணம்" },
  { districtCode: "RAN", code: "AC039", nameEnglish: "Sholingur", nameTamil: "சோழிங்கர்" },
  { districtCode: "VEL", code: "AC040", nameEnglish: "Katpadi", nameTamil: "காட்பாடி" },
  { districtCode: "RAN", code: "AC041", nameEnglish: "Ranipet", nameTamil: "ராணிப்பேட்டை" },
  { districtCode: "RAN", code: "AC042", nameEnglish: "Arcot", nameTamil: "ஆற்காடு" },
  { districtCode: "VEL", code: "AC043", nameEnglish: "Vellore", nameTamil: "வேலூர்" },
  { districtCode: "VEL", code: "AC044", nameEnglish: "Anaikattu", nameTamil: "அணைக்கட்டு" },
  { districtCode: "VEL", code: "AC045", nameEnglish: "Kilvaithinankuppam", nameTamil: "கீழ்வைத்தீனன்குப்பம்" },
  { districtCode: "VEL", code: "AC046", nameEnglish: "Gudiyatham", nameTamil: "குடியாத்தம்" },
  { districtCode: "TPR", code: "AC047", nameEnglish: "Vaniyambadi", nameTamil: "வாணியம்பாடி" },
  { districtCode: "TPR", code: "AC048", nameEnglish: "Ambur", nameTamil: "ஆம்பூர்" },
  { districtCode: "TPR", code: "AC049", nameEnglish: "Jolarpet", nameTamil: "ஜோலார்பேட்டை" },
  { districtCode: "TPR", code: "AC050", nameEnglish: "Tirupattur", nameTamil: "திருப்பத்தூர்" },
  { districtCode: "KRI", code: "AC051", nameEnglish: "Uthangarai", nameTamil: "ஊத்தங்கரை" },
  { districtCode: "KRI", code: "AC052", nameEnglish: "Bargur", nameTamil: "பார்கூர்" },
  { districtCode: "KRI", code: "AC053", nameEnglish: "Krishnagiri", nameTamil: "கிருஷ்ணகிரி" },
  { districtCode: "KRI", code: "AC054", nameEnglish: "Veppanahalli", nameTamil: "வேப்பனஹள்ளி" },
  { districtCode: "KRI", code: "AC055", nameEnglish: "Hosur", nameTamil: "ஓசூர்" },
  { districtCode: "KRI", code: "AC056", nameEnglish: "Thalli", nameTamil: "தள்ளி" },
  { districtCode: "DHR", code: "AC057", nameEnglish: "Palacode", nameTamil: "பாலக்கோடு" },
  { districtCode: "DHR", code: "AC058", nameEnglish: "Pennagaram", nameTamil: "பெண்ணாகரம்" },
  { districtCode: "DHR", code: "AC059", nameEnglish: "Dharmapuri", nameTamil: "தர்மபுரி" },
  { districtCode: "DHR", code: "AC060", nameEnglish: "Pappireddipatti", nameTamil: "பாப்பிரெட்டிப்பட்டி" },
  { districtCode: "DHR", code: "AC061", nameEnglish: "Harur", nameTamil: "அரூர்" },
  { districtCode: "TVN", code: "AC062", nameEnglish: "Chengam", nameTamil: "செங்கம்" },
  { districtCode: "TVN", code: "AC063", nameEnglish: "Tiruvannamalai", nameTamil: "திருவண்ணாமலை" },
  { districtCode: "TVN", code: "AC064", nameEnglish: "Kilpennathur", nameTamil: "கீழ்பெண்ணாத்தூர்" },
  { districtCode: "TVN", code: "AC065", nameEnglish: "Kalasapakkam", nameTamil: "கலசப்பாக்கம்" },
  { districtCode: "TVN", code: "AC066", nameEnglish: "Polur", nameTamil: "பொலூர்" },
  { districtCode: "TVN", code: "AC067", nameEnglish: "Arani", nameTamil: "ஆரணி" },
  { districtCode: "TVN", code: "AC068", nameEnglish: "Cheyyar", nameTamil: "செய்யாறு" },
  { districtCode: "TVN", code: "AC069", nameEnglish: "Vandavasi", nameTamil: "வந்தவாசி" },
  { districtCode: "VIL", code: "AC070", nameEnglish: "Gingee", nameTamil: "செஞ்சி" },
  { districtCode: "VIL", code: "AC071", nameEnglish: "Mailam", nameTamil: "மைலம்" },
  { districtCode: "VIL", code: "AC072", nameEnglish: "Tindivanam", nameTamil: "திண்டிவனம்" },
  { districtCode: "VIL", code: "AC073", nameEnglish: "Vanur", nameTamil: "வானூர்" },
  { districtCode: "VIL", code: "AC074", nameEnglish: "Viluppuram", nameTamil: "விழுப்புரம்" },
  { districtCode: "VIL", code: "AC075", nameEnglish: "Vikravandi", nameTamil: "விக்கிரவாண்டி" },
  { districtCode: "VIL", code: "AC076", nameEnglish: "Tirukoilur", nameTamil: "திருக்கோயிலூர்" },
  { districtCode: "KAL", code: "AC077", nameEnglish: "Ulundurpet", nameTamil: "உளுந்தூர்பேட்டை" },
  { districtCode: "KAL", code: "AC078", nameEnglish: "Rishivandiyam", nameTamil: "ரிஷிவந்தியம்" },
  { districtCode: "KAL", code: "AC079", nameEnglish: "Sankarapuram", nameTamil: "சங்கராபுரம்" },
  { districtCode: "KAL", code: "AC080", nameEnglish: "Kallakurichi", nameTamil: "கள்ளக்குறிச்சி" },
  { districtCode: "SLM", code: "AC081", nameEnglish: "Gangavalli", nameTamil: "காங்கவல்லி" },
  { districtCode: "SLM", code: "AC082", nameEnglish: "Attur", nameTamil: "ஆத்தூர்" },
  { districtCode: "SLM", code: "AC083", nameEnglish: "Yercaud", nameTamil: "யேர்காடு" },
  { districtCode: "SLM", code: "AC084", nameEnglish: "Omalur", nameTamil: "ஓமலூர்" },
  { districtCode: "SLM", code: "AC085", nameEnglish: "Mettur", nameTamil: "மேட்டூர்" },
  { districtCode: "SLM", code: "AC086", nameEnglish: "Edappadi", nameTamil: "ஏடப்பாடி" },
  { districtCode: "SLM", code: "AC087", nameEnglish: "Sankari", nameTamil: "சங்ககிரி" },
  { districtCode: "SLM", code: "AC088", nameEnglish: "Salem West", nameTamil: "சேலம் மேற்கு" },
  { districtCode: "SLM", code: "AC089", nameEnglish: "Salem North", nameTamil: "சேலம் வடக்கு" },
  { districtCode: "SLM", code: "AC090", nameEnglish: "Salem South", nameTamil: "சேலம் தெற்கு" },
  { districtCode: "SLM", code: "AC091", nameEnglish: "Veerapandi", nameTamil: "வீரபாண்டி" },
  { districtCode: "NMK", code: "AC092", nameEnglish: "Rasipuram", nameTamil: "ராசிபுரம்" },
  { districtCode: "NMK", code: "AC093", nameEnglish: "Senthamangalam", nameTamil: "செந்தமங்கலம்" },
  { districtCode: "NMK", code: "AC094", nameEnglish: "Namakkal", nameTamil: "நாமக்கல்" },
  { districtCode: "NMK", code: "AC095", nameEnglish: "Paramathi Velur", nameTamil: "பரமத்தி வேலூர்" },
  { districtCode: "NMK", code: "AC096", nameEnglish: "Tiruchengode", nameTamil: "திருச்செங்கோடு" },
  { districtCode: "NMK", code: "AC097", nameEnglish: "Kumarapalayam", nameTamil: "குமாரபாளையம்" },
  { districtCode: "EDE", code: "AC098", nameEnglish: "Erode East", nameTamil: "ஈரோடு கிழக்கு" },
  { districtCode: "EDE", code: "AC099", nameEnglish: "Erode West", nameTamil: "ஈரோடு மேற்கு" },
  { districtCode: "EDE", code: "AC100", nameEnglish: "Modakkurichi", nameTamil: "மொடக்குறிச்சி" },
  { districtCode: "TRV", code: "AC101", nameEnglish: "Dharapuram", nameTamil: "தாரபுரம்" },
  { districtCode: "TRV", code: "AC102", nameEnglish: "Kangeyam", nameTamil: "காங்கேயம்" },
  { districtCode: "EDE", code: "AC103", nameEnglish: "Perundurai", nameTamil: "பெருந்துறை" },
  { districtCode: "EDE", code: "AC104", nameEnglish: "Bhavani", nameTamil: "பவானி" },
  { districtCode: "EDE", code: "AC105", nameEnglish: "Anthiyur", nameTamil: "அந்தியூர்" },
  { districtCode: "EDE", code: "AC106", nameEnglish: "Gobichettipalayam", nameTamil: "கோபிசெட்டிபாளையம்" },
  { districtCode: "EDE", code: "AC107", nameEnglish: "Bhavanisagar", nameTamil: "பவானிசாகர்" },
  { districtCode: "NLR", code: "AC108", nameEnglish: "Udhagamandalam", nameTamil: "உதகமண்டலம்" },
  { districtCode: "NLR", code: "AC109", nameEnglish: "Gudalur", nameTamil: "குடலூர்" },
  { districtCode: "NLR", code: "AC110", nameEnglish: "Coonoor", nameTamil: "கூனூர்" },
  { districtCode: "CBE", code: "AC111", nameEnglish: "Mettupalayam", nameTamil: "மேட்டுபாளையம்" },
  { districtCode: "TRV", code: "AC112", nameEnglish: "Avinashi", nameTamil: "அவிநாசி" },
  { districtCode: "TRV", code: "AC113", nameEnglish: "Tirupur North", nameTamil: "திருப்பூர் வடக்கு" },
  { districtCode: "TRV", code: "AC114", nameEnglish: "Tirupur South", nameTamil: "திருப்பூர் தெற்கு" },
  { districtCode: "TRV", code: "AC115", nameEnglish: "Palladam", nameTamil: "பல்லடம்" },
  { districtCode: "CBE", code: "AC116", nameEnglish: "Sulur", nameTamil: "சூலூர்" },
  { districtCode: "CBE", code: "AC117", nameEnglish: "Kavundampalayam", nameTamil: "கவுண்டம்பாளையம்" },
  { districtCode: "CBE", code: "AC118", nameEnglish: "Coimbatore North", nameTamil: "கோயம்புத்தூர் வடக்கு" },
  { districtCode: "CBE", code: "AC119", nameEnglish: "Thondamuthur", nameTamil: "தொண்டாமுத்தூர்" },
  { districtCode: "CBE", code: "AC120", nameEnglish: "Coimbatore South", nameTamil: "கோயம்புத்தூர் தெற்கு" },
  { districtCode: "CBE", code: "AC121", nameEnglish: "Singanallur", nameTamil: "சிங்கநல்லூர்" },
  { districtCode: "CBE", code: "AC122", nameEnglish: "Kinathukadavu", nameTamil: "கிணத்துக்கடவு" },
  { districtCode: "CBE", code: "AC123", nameEnglish: "Pollachi", nameTamil: "பொள்ளாச்சி" },
  { districtCode: "CBE", code: "AC124", nameEnglish: "Valparai", nameTamil: "வால்பாறை" },
  { districtCode: "TRV", code: "AC125", nameEnglish: "Udumalpet", nameTamil: "உடுமலைப்பேட்டை" },
  { districtCode: "TRV", code: "AC126", nameEnglish: "Madathukulam", nameTamil: "மடத்துக்குளம்" },
  { districtCode: "DIN", code: "AC127", nameEnglish: "Palani", nameTamil: "பழனி" },
  { districtCode: "DIN", code: "AC128", nameEnglish: "Oddanchatram", nameTamil: "ஒட்டன்சத்திரம்" },
  { districtCode: "DIN", code: "AC129", nameEnglish: "Athoor", nameTamil: "ஆத்தூர்" },
  { districtCode: "DIN", code: "AC130", nameEnglish: "Nilakottai", nameTamil: "நிலக்கோட்டை" },
  { districtCode: "DIN", code: "AC131", nameEnglish: "Natham", nameTamil: "நாத்தம்" },
  { districtCode: "DIN", code: "AC132", nameEnglish: "Dindigul", nameTamil: "திண்டுக்கல்" },
  { districtCode: "DIN", code: "AC133", nameEnglish: "Vedasandur", nameTamil: "வேடசந்தூர்" },
  { districtCode: "KAR", code: "AC134", nameEnglish: "Aravakurichi", nameTamil: "அரவக்குறிச்சி" },
  { districtCode: "KAR", code: "AC135", nameEnglish: "Karur", nameTamil: "கரூர்" },
  { districtCode: "KAR", code: "AC136", nameEnglish: "Krishnarayapuram", nameTamil: "கிருஷ்ணராயபுரம்" },
  { districtCode: "KAR", code: "AC137", nameEnglish: "Kulithalai", nameTamil: "குளித்தலை" },
  { districtCode: "TIR", code: "AC138", nameEnglish: "Manapparai", nameTamil: "மானாபாறை" },
  { districtCode: "TIR", code: "AC139", nameEnglish: "Srirangam", nameTamil: "ஸ்ரீரங்கம்" },
  { districtCode: "TIR", code: "AC140", nameEnglish: "Tiruchirappalli West", nameTamil: "திருச்சிராப்பள்ளி மேற்கு" },
  { districtCode: "TIR", code: "AC141", nameEnglish: "Tiruchirappalli East", nameTamil: "திருச்சிராப்பள்ளி கிழக்கு" },
  { districtCode: "TIR", code: "AC142", nameEnglish: "Thiruverumbur", nameTamil: "திருவெறும்பூர்" },
  { districtCode: "TIR", code: "AC143", nameEnglish: "Lalgudi", nameTamil: "லால்குடி" },
  { districtCode: "TIR", code: "AC144", nameEnglish: "Manachanallur", nameTamil: "மணச்சநல்லூர்" },
  { districtCode: "TIR", code: "AC145", nameEnglish: "Musiri", nameTamil: "முசிறி" },
  { districtCode: "TIR", code: "AC146", nameEnglish: "Thuraiyur", nameTamil: "துறையூர்" },
  { districtCode: "PER", code: "AC147", nameEnglish: "Perambalur", nameTamil: "பெரம்பலூர்" },
  { districtCode: "PER", code: "AC148", nameEnglish: "Kunnam", nameTamil: "குன்னம்" },
  { districtCode: "ARY", code: "AC149", nameEnglish: "Ariyalur", nameTamil: "அரியலூர்" },
  { districtCode: "ARY", code: "AC150", nameEnglish: "Jayankondam", nameTamil: "ஜெயங்கொண்டம்" },
  { districtCode: "CUD", code: "AC151", nameEnglish: "Tittakudi", nameTamil: "தித்தகுடி" },
  { districtCode: "CUD", code: "AC152", nameEnglish: "Vriddhachalam", nameTamil: "விருத்தாசலம்" },
  { districtCode: "CUD", code: "AC153", nameEnglish: "Neyveli", nameTamil: "நெய்வேலி" },
  { districtCode: "CUD", code: "AC154", nameEnglish: "Panruti", nameTamil: "பண்ருட்டி" },
  { districtCode: "CUD", code: "AC155", nameEnglish: "Cuddalore", nameTamil: "கடலூர்" },
  { districtCode: "CUD", code: "AC156", nameEnglish: "Kurinjipadi", nameTamil: "குறிஞ்சிப்பாடி" },
  { districtCode: "CUD", code: "AC157", nameEnglish: "Bhuvanagiri", nameTamil: "புவனகிரி" },
  { districtCode: "CUD", code: "AC158", nameEnglish: "Chidambaram", nameTamil: "சிதம்பரம்" },
  { districtCode: "CUD", code: "AC159", nameEnglish: "Kattumannarkoil", nameTamil: "கட்டுமன்னார்கோயில்" },
  { districtCode: "MAY", code: "AC160", nameEnglish: "Sirkazhi", nameTamil: "சீர்காழி" },
  { districtCode: "MAY", code: "AC161", nameEnglish: "Mayiladuthurai", nameTamil: "மயிலாடுதுறை" },
  { districtCode: "MAY", code: "AC162", nameEnglish: "Poompuhar", nameTamil: "பூம்புகார்" },
  { districtCode: "NAG", code: "AC163", nameEnglish: "Nagapattinam", nameTamil: "நாகப்பட்டினம்" },
  { districtCode: "NAG", code: "AC164", nameEnglish: "Kilvelur", nameTamil: "கீழ்வேளூர்" },
  { districtCode: "NAG", code: "AC165", nameEnglish: "Vedaranyam", nameTamil: "வேதாரண்யம்" },
  { districtCode: "TVR", code: "AC166", nameEnglish: "Thiruthuraipoondi", nameTamil: "திருத்துறைப்பூண்டி" },
  { districtCode: "TVR", code: "AC167", nameEnglish: "Mannargudi", nameTamil: "மன்னார்குடி" },
  { districtCode: "TVR", code: "AC168", nameEnglish: "Thiruvarur", nameTamil: "திருவாரூர்" },
  { districtCode: "TVR", code: "AC169", nameEnglish: "Nannilam", nameTamil: "நன்னிலம்" },
  { districtCode: "THA", code: "AC170", nameEnglish: "Thiruvidaimarudur", nameTamil: "திருவிடைமருதூர்" },
  { districtCode: "THA", code: "AC171", nameEnglish: "Kumbakonam", nameTamil: "கும்பகோணம்" },
  { districtCode: "THA", code: "AC172", nameEnglish: "Papanasam", nameTamil: "பாபநாசம்" },
  { districtCode: "THA", code: "AC173", nameEnglish: "Thiruvaiyaru", nameTamil: "திருவையாறு" },
  { districtCode: "THA", code: "AC174", nameEnglish: "Thanjavur", nameTamil: "தஞ்சாவூர்" },
  { districtCode: "THA", code: "AC175", nameEnglish: "Orathanadu", nameTamil: "ஒரத்தநாடு" },
  { districtCode: "THA", code: "AC176", nameEnglish: "Pattukkottai", nameTamil: "பட்டுக்கோட்டை" },
  { districtCode: "THA", code: "AC177", nameEnglish: "Peravurani", nameTamil: "பேராவூரணி" },
  { districtCode: "PUD", code: "AC178", nameEnglish: "Gandharvakottai", nameTamil: "காந்தர்வகோட்டை" },
  { districtCode: "PUD", code: "AC179", nameEnglish: "Viralimalai", nameTamil: "விராலிமலை" },
  { districtCode: "PUD", code: "AC180", nameEnglish: "Pudukkottai", nameTamil: "புதுக்கோட்டை" },
  { districtCode: "PUD", code: "AC181", nameEnglish: "Thirumayam", nameTamil: "திருமயம்" },
  { districtCode: "PUD", code: "AC182", nameEnglish: "Alangudi", nameTamil: "ஆலங்குடி" },
  { districtCode: "PUD", code: "AC183", nameEnglish: "Aranthangi", nameTamil: "அறந்தாங்கி" },
  { districtCode: "SIV", code: "AC184", nameEnglish: "Karaikudi", nameTamil: "காரைக்குடி" },
  { districtCode: "SIV", code: "AC185", nameEnglish: "Tiruppattur", nameTamil: "திருப்பத்தூர்" },
  { districtCode: "SIV", code: "AC186", nameEnglish: "Sivaganga", nameTamil: "சிவகங்கை" },
  { districtCode: "SIV", code: "AC187", nameEnglish: "Manamadurai", nameTamil: "மானாமதுரை" },
  { districtCode: "MDU", code: "AC188", nameEnglish: "Melur", nameTamil: "மேலூர்" },
  { districtCode: "MDU", code: "AC189", nameEnglish: "Madurai East", nameTamil: "மதுரை கிழக்கு" },
  { districtCode: "MDU", code: "AC190", nameEnglish: "Sholavandan", nameTamil: "சோழவந்தான்" },
  { districtCode: "MDU", code: "AC191", nameEnglish: "Madurai North", nameTamil: "மதுரை வடக்கு" },
  { districtCode: "MDU", code: "AC192", nameEnglish: "Madurai South", nameTamil: "மதுரை தெற்கு" },
  { districtCode: "MDU", code: "AC193", nameEnglish: "Madurai Central", nameTamil: "மதுரை மத்திய" },
  { districtCode: "MDU", code: "AC194", nameEnglish: "Madurai West", nameTamil: "மதுரை மேற்கு" },
  { districtCode: "MDU", code: "AC195", nameEnglish: "Thiruparankundram", nameTamil: "திருப்பரங்குன்றம்" },
  { districtCode: "MDU", code: "AC196", nameEnglish: "Thirumangalam", nameTamil: "திருமங்கலம்" },
  { districtCode: "MDU", code: "AC197", nameEnglish: "Usilampatti", nameTamil: "உசிலம்பட்டி" },
  { districtCode: "THN", code: "AC198", nameEnglish: "Andipatti", nameTamil: "ஆண்டிப்பட்டி" },
  { districtCode: "THN", code: "AC199", nameEnglish: "Periyakulam", nameTamil: "பெரியகுளம்" },
  { districtCode: "THN", code: "AC200", nameEnglish: "Bodinayakanur", nameTamil: "போடிநாயக்கனூர்" },
  { districtCode: "THN", code: "AC201", nameEnglish: "Cumbum", nameTamil: "கம்பம்" },
  { districtCode: "VRT", code: "AC202", nameEnglish: "Rajapalayam", nameTamil: "இராசபாளையம்" },
  { districtCode: "VRT", code: "AC203", nameEnglish: "Srivilliputhur", nameTamil: "ஸ்ரீவில்லிபுத்தூர்" },
  { districtCode: "VRT", code: "AC204", nameEnglish: "Sattur", nameTamil: "சாத்தூர்" },
  { districtCode: "VRT", code: "AC205", nameEnglish: "Sivakasi", nameTamil: "சிவகாசி" },
  { districtCode: "VRT", code: "AC206", nameEnglish: "Virudhunagar", nameTamil: "விருதுநகர்" },
  { districtCode: "VRT", code: "AC207", nameEnglish: "Aruppukkottai", nameTamil: "அருப்புக்கோட்டை" },
  { districtCode: "VRT", code: "AC208", nameEnglish: "Tiruchuli", nameTamil: "திருச்சுழி" },
  { districtCode: "RMN", code: "AC209", nameEnglish: "Paramakudi", nameTamil: "பரமக்குடி" },
  { districtCode: "RMN", code: "AC210", nameEnglish: "Tiruvadanai", nameTamil: "திருவாடானை" },
  { districtCode: "RMN", code: "AC211", nameEnglish: "Ramanathapuram", nameTamil: "இராமநாதபுரம்" },
  { districtCode: "RMN", code: "AC212", nameEnglish: "Mudhukulathur", nameTamil: "முதுகுளத்தூர்" },
  { districtCode: "TPN", code: "AC213", nameEnglish: "Vilathikulam", nameTamil: "விளாத்திகுளம்" },
  { districtCode: "TPN", code: "AC214", nameEnglish: "Thoothukudi", nameTamil: "தூத்துக்குடி" },
  { districtCode: "TPN", code: "AC215", nameEnglish: "Tiruchendur", nameTamil: "திருச்செந்தூர்" },
  { districtCode: "TPN", code: "AC216", nameEnglish: "Srivaikuntam", nameTamil: "ஸ்ரீவைகுண்டம்" },
  { districtCode: "TPN", code: "AC217", nameEnglish: "Ottapidaram", nameTamil: "ஓட்டப்பிடாரம்" },
  { districtCode: "TPN", code: "AC218", nameEnglish: "Kovilpatti", nameTamil: "கோவில்பட்டி" },
  { districtCode: "TEN", code: "AC219", nameEnglish: "Sankarankovil", nameTamil: "சங்கரன்கோவில்" },
  { districtCode: "TEN", code: "AC220", nameEnglish: "Vasudevanallur", nameTamil: "வாசுதேவநல்லூர்" },
  { districtCode: "TEN", code: "AC221", nameEnglish: "Kadayanallur", nameTamil: "கடையநல்லூர்" },
  { districtCode: "TEN", code: "AC222", nameEnglish: "Tenkasi", nameTamil: "தென்காசி" },
  { districtCode: "TEN", code: "AC223", nameEnglish: "Alangulam", nameTamil: "ஆலங்குளம்" },
  { districtCode: "TNV", code: "AC224", nameEnglish: "Tirunelveli", nameTamil: "திருநெல்வேலி" },
  { districtCode: "TNV", code: "AC225", nameEnglish: "Ambasamudram", nameTamil: "அம்பாசமுத்திரம்" },
  { districtCode: "TNV", code: "AC226", nameEnglish: "Palayamkottai", nameTamil: "பாளையங்கோட்டை" },
  { districtCode: "TNV", code: "AC227", nameEnglish: "Nanguneri", nameTamil: "நாங்குநேரி" },
  { districtCode: "TNV", code: "AC228", nameEnglish: "Radhapuram", nameTamil: "இராதாபுரம்" },
  { districtCode: "KKN", code: "AC229", nameEnglish: "Kanniyakumari", nameTamil: "கன்னியாகுமரி" },
  { districtCode: "KKN", code: "AC230", nameEnglish: "Nagercoil", nameTamil: "நாகர்கோவில்" },
  { districtCode: "KKN", code: "AC231", nameEnglish: "Colachel", nameTamil: "கொல்லாச்சல்" },
  { districtCode: "KKN", code: "AC232", nameEnglish: "Padmanabhapuram", nameTamil: "பத்மனாபாபுரம்" },
  { districtCode: "KKN", code: "AC233", nameEnglish: "Vilavancode", nameTamil: "விளவங்கோடு" },
  { districtCode: "KKN", code: "AC234", nameEnglish: "Killiyoor", nameTamil: "கிள்ளியூர்" },
];

// All 234 Tamil Nadu Assembly Constituencies — official 2021 delimitation

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

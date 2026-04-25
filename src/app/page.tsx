import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Motion / premium client components
import SpotlightHero from "@/components/public/motion/SpotlightHero";
import TextReveal from "@/components/public/motion/TextReveal";
import MissionSection from "@/components/public/motion/MissionSection";
import CandidateCard3D from "@/components/public/motion/CandidateCard3D";
import SupportersSection from "@/components/public/motion/SupportersSection";
import MagneticButton from "@/components/public/motion/MagneticButton";

// Server-renderable legacy sections (no client boundary needed)
import FlagDecoded from "@/components/public/home/FlagDecoded";
import NewsTeaserSection from "@/components/public/home/NewsTeaserSection";

// ─── static data ────────────────────────────────────────────────────────────

const REVEAL_SENTENCES: string[] = [
  "நாங்கள் சாதி ஒழிப்புக்காக போராடுகிறோம்.",
  "உழைக்கும் மக்களின் உரிமைகளை காப்பாற்றுகிறோம்.",
  "பெண் விடுதலையை உறுதி செய்கிறோம்.",
  "தமிழ் மக்களின் அடையாளத்தை பாதுகாக்கிறோம்.",
  "34 ஆண்டுகளாக நாங்கள் களத்தில் இருக்கிறோம்.",
];

type Leader = {
  name: string;
  nameTA: string;
  role: string;
  constituency: string;
  gradient: string;
};

const LEADERS: Leader[] = [
  {
    name: "Thol. Thirumavalavan",
    nameTA: "தொல். திருமாவளவன்",
    role: "தலைவர்",
    constituency: "சிதம்பரம்",
    gradient: "bg-gradient-to-br from-[#0A1628] to-[#1B3A6B]",
  },
  {
    name: "D. Ravikumar",
    nameTA: "து. ரவிக்குமார்",
    role: "பொதுச் செயலாளர்",
    constituency: "விழுப்புரம்",
    gradient: "bg-gradient-to-br from-[#1B3A6B] to-[#C41E1E]",
  },
  {
    name: "Sinthanai Selvan",
    nameTA: "சிந்தனைச் செல்வன்",
    role: "சட்டமன்ற உறுப்பினர்",
    constituency: "காட்டுமன்னார்கோவில்",
    gradient: "bg-gradient-to-br from-[#C41E1E] to-[#0A1628]",
  },
  {
    name: "Aloor Sha Navas",
    nameTA: "ஆளூர் ஷாநவாஸ்",
    role: "சட்டமன்ற உறுப்பினர்",
    constituency: "நாகப்பட்டினம்",
    gradient: "bg-gradient-to-br from-[#0A1628] to-[#C41E1E]",
  },
];

// ─── page ────────────────────────────────────────────────────────────────────

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/dashboard");
  }

  return (
    <>
      {/* 1. Spotlight Hero */}
      <SpotlightHero />

      {/* 2. Text Reveal — Tamil manifesto sentences */}
      <TextReveal sentences={REVEAL_SENTENCES} />

      {/* 3. Mission Section — GSAP horizontal scroll panels */}
      <MissionSection />

      {/* 4. Leaders grid — server-rendered wrapper */}
      <section className="bg-[#F5F0E8] py-24 px-6">
        <h2 className="text-4xl font-black text-[#0A1628] mb-12 text-center">
          கட்சியின் தலைவர்கள்
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {LEADERS.map((leader) => (
            <CandidateCard3D
              key={leader.name}
              name={leader.name}
              nameTA={leader.nameTA}
              role={leader.role}
              constituency={leader.constituency}
              gradient={leader.gradient}
            />
          ))}
        </div>
      </section>

      {/* 5. Supporters / social proof */}
      <SupportersSection />

      {/* 6. Flag Decoded — server component */}
      <FlagDecoded />

      {/* 7. News teaser — server component */}
      <NewsTeaserSection />

      {/* 8. Join CTA with MagneticButton replacements */}
      <section className="bg-[#0A1628] py-24 px-6 text-center">
        <h2 className="text-4xl font-black text-white mb-4">
          விசிக-வோடு இணையுங்கள்
        </h2>
        <p className="text-[#A0AEC0] text-lg mb-10 max-w-xl mx-auto">
          சமத்துவம், சமூக நீதி, தமிழர் உரிமை — ஒரே கொடியின் கீழ்.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <MagneticButton variant="primary" href="/join">
            விசிக-வில் இணைய
          </MagneticButton>
          <MagneticButton variant="secondary" href="/donate">
            நன்கொடை அளியுங்கள்
          </MagneticButton>
        </div>
      </section>
    </>
  );
}

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

import SpotlightHero from "@/components/public/motion/SpotlightHero";
import TextReveal from "@/components/public/motion/TextReveal";
import MissionSection from "@/components/public/motion/MissionSection";
import SupportersSection from "@/components/public/motion/SupportersSection";
import FiveBeliefs from "@/components/public/home/FiveBeliefs";
import FlagDecoded from "@/components/public/home/FlagDecoded";
import Representatives from "@/components/public/home/Representatives";
import HistoryTeaser from "@/components/public/home/HistoryTeaser";
import NewsTeaserSection from "@/components/public/home/NewsTeaserSection";
import JoinCTA from "@/components/public/home/JoinCTA";
import LeadersSection from "@/components/public/home/LeadersSection";
import SocialFeedsSection from "@/components/public/home/SocialFeedsSection";

const REVEAL_SENTENCES: string[] = [
  "நாங்கள் சாதி ஒழிப்புக்காக போராடுகிறோம்.",
  "உழைக்கும் மக்களின் உரிமைகளை காப்பாற்றுகிறோம்.",
  "பெண் விடுதலையை உறுதி செய்கிறோம்.",
  "தமிழ் மக்களின் அடையாளத்தை பாதுகாக்கிறோம்.",
  "34 ஆண்டுகளாக நாங்கள் களத்தில் இருக்கிறோம்.",
];

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <main>
      {/* Fixed navbar spacer */}
      <div className="h-14" aria-hidden="true" />

      {/* 1 — Hero */}
      <SpotlightHero />

      {/* 2 — Manifesto text reveal */}
      <TextReveal sentences={REVEAL_SENTENCES} />

      {/* 3 — Core beliefs */}
      <FiveBeliefs />

      {/* 4 — GSAP horizontal mission panels */}
      <MissionSection />

      {/* 5 — Leaders 3D cards */}
      <LeadersSection />

      {/* 6 — Elected representatives */}
      <Representatives />

      {/* 7 — History milestones */}
      <HistoryTeaser />

      {/* 8 — Stats + marquee */}
      <SupportersSection />

      {/* 9 — Flag explained */}
      <FlagDecoded />

      {/* 10 — News */}
      <NewsTeaserSection />

      {/* 11 — Social feeds */}
      <SocialFeedsSection />

      {/* 12 — Join CTA */}
      <JoinCTA />
    </main>
  );
}

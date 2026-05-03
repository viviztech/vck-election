import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

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

      {/* 2 — Election results live banner */}
      <div className="bg-[#0A1628] border-y border-[#C41E1E]/30 px-4 py-5">
        <Link
          href="/elections/results"
          className="max-w-4xl mx-auto flex items-center justify-between gap-4 group"
        >
          <div className="flex items-center gap-4">
            {/* Pulsing dot */}
            <span className="relative flex h-4 w-4 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C41E1E] opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-[#C41E1E]" />
            </span>
            <div>
              <p
                className="text-white font-black text-base sm:text-xl leading-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                தேர்தல் முடிவுகள் 2026 — LIVE
              </p>
              <p className="text-white/50 text-xs sm:text-sm mt-0.5">
                8 தொகுதிகளில் விசிக நிலை · முடிவுகளை இப்போது பாருங்கள்
              </p>
            </div>
          </div>
          <span
            className="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#C41E1E] text-white text-sm font-bold group-hover:bg-[#a81818] transition-colors"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            முடிவுகள் பார்க்க
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      </div>

      {/* 3 — Manifesto text reveal */}
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

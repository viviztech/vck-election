"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Platform = "facebook" | "instagram" | "twitter" | "youtube";

interface Tab {
  id: Platform;
  label: string;
  color: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  {
    id: "facebook",
    label: "Facebook",
    color: "#1877F2",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88v-6.99H7.9v-2.89h2.54V9.84c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.77l-.44 2.89h-2.33v6.99C18.34 21.12 22 17 22 12z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    label: "Instagram",
    color: "#E1306C",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.333-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.333-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 5.775.131 4.602.44 3.635 1.408 2.667 2.375 2.358 3.548 2.3 4.826 2.241 6.107 2.227 6.515 2.227 12s.014 5.893.073 7.174c.058 1.278.367 2.451 1.335 3.418.967.968 2.14 1.277 3.418 1.335C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.073c1.278-.058 2.451-.367 3.418-1.335.968-.967 1.277-2.14 1.335-3.418.059-1.281.073-1.689.073-7.174s-.014-5.893-.073-7.174c-.058-1.278-.367-2.451-1.335-3.418C19.398.44 18.225.131 16.947.072 15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    id: "twitter",
    label: "X (Twitter)",
    color: "#000000",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: "youtube",
    label: "YouTube",
    color: "#FF0000",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

// Embed URLs — update these with real VCK handles when available
const EMBED_CONFIG: Record<Platform, { src: string; label: string }> = {
  facebook: {
    src: "https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2FVCKofficial&tabs=timeline&width=500&height=600&small_header=true&adapt_container_width=true&hide_cover=false&show_facepile=false&appId",
    label: "VCK Facebook பக்கம்",
  },
  instagram: {
    src: "https://www.instagram.com/vck_official/embed",
    label: "VCK Instagram பக்கம்",
  },
  twitter: {
    src: "https://syndication.twitter.com/srv/timeline-profile/screen-name/thirumavalavan?dnt=true&embedId=twitter-widget-0&lang=ta",
    label: "VCK X (Twitter) பக்கம்",
  },
  youtube: {
    src: "https://www.youtube.com/embed?listType=user_uploads&list=VCKvelichamtv&autoplay=0",
    label: "VCK YouTube சேனல்",
  },
};

const SOCIAL_LINKS: Record<Platform, string> = {
  facebook: "https://www.facebook.com/VCKofficial",
  instagram: "https://www.instagram.com/vck_official",
  twitter: "https://x.com/thirumavalavan",
  youtube: "https://www.youtube.com/@VCKvelichamtv",
};

export default function SocialFeedsSection() {
  const [active, setActive] = useState<Platform>("facebook");

  const activeTab = TABS.find((t) => t.id === active)!;

  return (
    <section className="bg-[#0A1628] py-24 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <p
          className="text-[#C41E1E] text-xs font-semibold uppercase tracking-widest text-center mb-4"
          style={{ fontFamily: "var(--font-body)" }}
        >
          சமூக வலைதளங்கள்
        </p>
        <h2
          className="text-white font-black text-4xl lg:text-5xl text-center mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          நம்முடன் இணையுங்கள்
        </h2>
        <p
          className="text-white/40 text-base text-center mb-12"
          style={{ fontFamily: "var(--font-body)" }}
        >
          விசிகவின் சமீபத்திய செய்திகள், நிகழ்வுகள் மற்றும் அறிவிப்புகளை பின்தொடருங்கள்
        </p>

        {/* Tab bar */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActive(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${
                active === tab.id
                  ? "text-white shadow-lg scale-105"
                  : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
              }`}
              style={{
                backgroundColor: active === tab.id ? tab.color : undefined,
                fontFamily: "var(--font-body)",
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Embed panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative rounded-2xl overflow-hidden border border-white/10 bg-white/5"
            style={{ minHeight: 560 }}
          >
            {/* Colored top bar */}
            <div
              className="h-1 w-full"
              style={{ backgroundColor: activeTab.color }}
            />

            {/* Platform label bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-white/70">
                <span style={{ color: activeTab.color }}>{activeTab.icon}</span>
                <span
                  className="text-sm font-semibold"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {EMBED_CONFIG[active].label}
                </span>
              </div>
              <a
                href={SOCIAL_LINKS[active]}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold px-4 py-1.5 rounded-full transition-colors duration-200 text-white"
                style={{
                  backgroundColor: activeTab.color,
                  fontFamily: "var(--font-body)",
                }}
              >
                பின்தொடர்க →
              </a>
            </div>

            {/* iFrame embed */}
            <iframe
              src={EMBED_CONFIG[active].src}
              title={EMBED_CONFIG[active].label}
              className="w-full"
              style={{ height: 500, border: "none" }}
              loading="lazy"
              allow="autoplay; encrypted-media"
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
            />
          </motion.div>
        </AnimatePresence>

        {/* Follow links row */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          {TABS.map((tab) => (
            <a
              key={tab.id}
              href={SOCIAL_LINKS[tab.id]}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all duration-200 text-sm font-semibold"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <span style={{ color: tab.color }}>{tab.icon}</span>
              {tab.label}
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}

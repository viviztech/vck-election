"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NavLink {
  href: string;
  label: string;
}

interface NavGroup {
  group: string;
  links: NavLink[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    group: "முகப்பு",
    links: [{ href: "/", label: "முகப்பு" }],
  },
  {
    group: "இயக்கம்",
    links: [
      { href: "/history", label: "இயக்க வரலாறு" },
      { href: "/ideology", label: "கொள்கைகள்" },
      { href: "/flag", label: "கொடி விளக்கம்" },
      { href: "/conferences", label: "மாநாடுகள்" },
      { href: "/elections", label: "தேர்தல்கள்" },
    ],
  },
  {
    group: "இயக்க அமைப்பு",
    links: [
      { href: "/leadership", label: "தலைமை" },
      { href: "/state-admin", label: "மாநில நிர்வாகம்" },
      { href: "/district-admin", label: "மாவட்ட நிர்வாகம்" },
      { href: "/party-wings", label: "அணிகள்" },
    ],
  },
  {
    group: "மக்கள் பிரதிநிதிகள்",
    links: [
      { href: "/elected-members/mp", label: "நாடாளுமன்ற உறுப்பினர்கள்" },
      { href: "/elected-members/mla", label: "முன்னாள் சட்டமன்ற உறுப்பினர்கள்" },
      { href: "/elected-members/local", label: "உள்ளாட்சி பிரதிநிதிகள்" },
    ],
  },
  {
    group: "வெளியீடுகள்",
    links: [
      { href: "/publications/tamilmann", label: "நமது தமிழ்மண்" },
      { href: "/publications/songs", label: "கொள்கைப் பாடல்கள்" },
      { href: "/publications/photos", label: "புகைப்படம்" },
    ],
  },
];

const menuOverlayVariants = {
  hidden: { opacity: 0, y: "-100%" },
  visible: {
    opacity: 1,
    y: "0%",
    transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
  },
  exit: {
    opacity: 0,
    y: "-100%",
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as const },
  },
};

const linkStagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } },
};

const linkItem = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { ease: [0.16, 1, 0.3, 1] as const, duration: 0.5 },
  },
};


export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "h-16 bg-[#0A1628]/95 backdrop-blur-md shadow-lg shadow-black/30"
            : "h-14 bg-[#0A1628]"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 shrink-0 group"
            aria-label="VCK முகப்பு"
          >
            <Image
              src="/logo.png"
              alt="விடுதலைச் சிறுத்தைகள் கட்சி"
              width={36}
              height={36}
              className="rounded-full object-cover"
              priority
            />
            <div className="flex flex-col leading-tight">
              <span
                className="text-white text-sm font-black"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                விடுதலைச் சிறுத்தைகள் கட்சி
              </span>
              <span className="text-white/40 text-[10px] tracking-widest uppercase font-medium">
                VCK
              </span>
            </div>
          </Link>

          {/* Desktop nav — grouped with dropdowns */}
          <div className="hidden xl:flex items-center gap-1">
            {NAV_GROUPS.map(({ group, links }) => {
              const isSingle = links.length === 1;
              const isGroupActive = links.some((l) => isActive(l.href));

              if (isSingle) {
                const { href, label } = links[0];
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative px-3 py-1.5 text-sm transition-colors duration-200 group ${
                      isActive(href) ? "text-white" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {label}
                    <span className={`absolute bottom-0 left-3 right-3 h-0.5 bg-[#C41E1E] rounded-full transition-transform duration-200 origin-left ${isActive(href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                  </Link>
                );
              }

              return (
                <div
                  key={group}
                  className="relative"
                  onMouseEnter={() => setOpenGroup(group)}
                  onMouseLeave={() => setOpenGroup(null)}
                >
                  <button
                    className={`relative flex items-center gap-1 px-3 py-1.5 text-sm transition-colors duration-200 group ${
                      isGroupActive ? "text-white" : "text-white/70 hover:text-white"
                    }`}
                  >
                    {group}
                    <svg className={`w-3 h-3 transition-transform duration-200 ${openGroup === group ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                    <span className={`absolute bottom-0 left-3 right-3 h-0.5 bg-[#C41E1E] rounded-full transition-transform duration-200 origin-left ${isGroupActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                  </button>

                  <AnimatePresence>
                    {openGroup === group && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className="absolute top-full left-0 mt-1 min-w-[200px] bg-[#0A1628] border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50"
                      >
                        {links.map(({ href, label }) => (
                          <Link
                            key={href}
                            href={href}
                            className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors duration-150 border-b border-white/5 last:border-b-0 ${
                              isActive(href)
                                ? "text-[#C41E1E] bg-white/5"
                                : "text-white/70 hover:text-white hover:bg-white/5"
                            }`}
                            style={{ fontFamily: "var(--font-body)" }}
                          >
                            {isActive(href) && <span className="w-1.5 h-1.5 rounded-full bg-[#C41E1E] shrink-0" />}
                            {label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Election results — highlighted live link */}
            <Link
              href="/elections/results"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold text-white whitespace-nowrap relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #C41E1E 0%, #8B0000 100%)",
                boxShadow: "0 0 16px rgba(196,30,30,0.6)",
                fontFamily: "var(--font-heading)",
              }}
            >
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
              </span>
              தேர்தல் முடிவுகள்
            </Link>


            {/* Hamburger — hidden at xl+ */}
            <button
              className="xl:hidden p-2 text-white focus:outline-none"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label={menuOpen ? "பட்டியல் மூடு" : "பட்டியல் திற"}
              aria-expanded={menuOpen}
            >
              <motion.svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={menuOpen ? "open" : "closed"}
              >
                <motion.path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  variants={{
                    closed: { d: "M4 6h16M4 12h16M4 18h16" },
                    open: { d: "M6 18L18 6M6 6l12 12" },
                  }}
                  transition={{ duration: 0.25 }}
                />
              </motion.svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            variants={menuOverlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 bg-[#0A1628] z-40 flex flex-col xl:hidden"
          >
            {/* Top spacer for nav height */}
            <div className="h-14 shrink-0" />

            <div className="flex-1 overflow-y-auto px-6 pt-8 pb-12 flex flex-col justify-between">
              {/* Election results — top CTA in mobile menu */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="mb-6"
              >
                <Link
                  href="/elections/results"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl text-white text-lg font-black"
                  style={{
                    background: "linear-gradient(135deg, #C41E1E 0%, #7f0000 100%)",
                    boxShadow: "0 0 24px rgba(196,30,30,0.5)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  <span className="relative flex h-3 w-3 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white" />
                  </span>
                  தேர்தல் முடிவுகள் 2026
                </Link>
              </motion.div>

              {/* Nav links — grouped */}
              <motion.nav
                variants={linkStagger}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-6"
              >
                {NAV_GROUPS.map(({ group, links }) => (
                  <motion.div key={group} variants={linkItem}>
                    {/* Group label — hidden when group has only one link */}
                    {links.length > 1 && (
                      <p
                        className="text-[#C41E1E] text-xs uppercase tracking-widest font-semibold mb-2"
                        style={{ fontFamily: "var(--font-body)" }}
                      >
                        {group}
                      </p>
                    )}
                    {/* Group links */}
                    {links.map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className={`block py-3 text-xl font-bold border-b border-white/10 transition-colors duration-200 ${
                          isActive(href) ? "text-[#C41E1E]" : "text-white hover:text-[#C41E1E]"
                        }`}
                        style={{ fontFamily: "var(--font-heading)" }}
                      >
                        {label}
                      </Link>
                    ))}
                  </motion.div>
                ))}
              </motion.nav>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

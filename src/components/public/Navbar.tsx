"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/ideology", label: "கொள்கைகள்" },
  { href: "/history", label: "வரலாற்று மைல்கற்கள்" },
  { href: "/leadership", label: "கட்சியின் அமைப்பு" },
  { href: "/elected-members", label: "மக்கள் பிரதிநிதிகள்" },
  { href: "/party-wings", label: "கட்சியின் உட்பிரிவுகள்" },
  { href: "/news", label: "செய்திகள்" },
  { href: "/contact", label: "தொடர்புக்கு" },
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

function PantherIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 28 28"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      {/* Geometric panther silhouette */}
      <path
        d="M14 2L18 6L22 5L20 10L24 14L20 16L22 22L17 20L14 24L11 20L6 22L8 16L4 14L8 10L6 5L10 6L14 2Z"
        fill="#C41E1E"
        opacity="0.9"
      />
      <circle cx="14" cy="13" r="4" fill="#0A1628" />
      <circle cx="12.5" cy="12" r="1.2" fill="white" />
      <circle cx="15.5" cy="12" r="1.2" fill="white" />
    </svg>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
            <PantherIcon />
            <div className="flex flex-col leading-none">
              <span
                className="text-white text-lg tracking-tight"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                <span className="font-black">விசி</span>
                <span className="font-light opacity-80">கட்சி</span>
              </span>
              <span className="text-white/40 text-[10px] tracking-widest uppercase font-medium">
                VCK
              </span>
            </div>
          </Link>

          {/* Desktop nav — visible only at xl+ */}
          <div className="hidden xl:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-3 py-1.5 text-sm transition-colors duration-200 group ${
                  isActive(href)
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {label}
                {/* Active indicator */}
                {isActive(href) && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#C41E1E] rounded-full" />
                )}
                {/* Hover underline slide */}
                {!isActive(href) && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#C41E1E]/60 rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left" />
                )}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/join"
              className="hidden sm:inline-flex items-center px-5 py-2 bg-[#C41E1E] text-white text-sm font-bold rounded-full hover:bg-[#a81818] transition-colors duration-200 whitespace-nowrap"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              விசிக-வில் இணைய
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
              {/* Nav links */}
              <motion.nav
                variants={linkStagger}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-0"
              >
                {NAV_LINKS.map(({ href, label }) => (
                  <motion.div key={href} variants={linkItem}>
                    <Link
                      href={href}
                      onClick={() => setMenuOpen(false)}
                      className={`block py-4 text-2xl font-bold border-b border-white/10 transition-colors duration-200 ${
                        isActive(href) ? "text-[#C41E1E]" : "text-white hover:text-[#C41E1E]"
                      }`}
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {label}
                    </Link>
                  </motion.div>
                ))}
              </motion.nav>

              {/* CTA at bottom */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mt-10"
              >
                <Link
                  href="/join"
                  onClick={() => setMenuOpen(false)}
                  className="flex justify-center items-center w-full py-4 bg-[#C41E1E] text-white text-lg font-bold rounded-full hover:bg-[#a81818] transition-colors duration-200"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  விசிக-வில் இணைய
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

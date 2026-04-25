"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "முகப்பு" },
  { href: "/ideology", label: "கொள்கைகள்" },
  { href: "/history", label: "வரலாற்று மைல்கற்கள்" },
  { href: "/leadership", label: "கட்சியின் அமைப்பு" },
  { href: "/elected-members", label: "மக்கள் பிரதிநிதிகள்" },
  { href: "/party-wings", label: "கட்சியின் உட்பிரிவுகள்" },
  { href: "/news", label: "செய்திகள்" },
  { href: "/contact", label: "தொடர்புக்கு" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <nav className="sticky top-0 z-50 bg-[#0A1628] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-tight">
            <span className="text-white text-xs font-medium opacity-80">
              விடுதலைச் சிறுத்தைகள்
            </span>
            <span className="text-white text-2xl font-bold tracking-widest">
              VCK
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 text-sm rounded transition-colors ${
                  isActive(href)
                    ? "bg-[#1B3A6B] text-white font-semibold"
                    : "text-gray-300 hover:text-white hover:bg-[#1B3A6B]/60"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right: Join button + hamburger */}
          <div className="flex items-center gap-3">
            <Link
              href="/join"
              className="hidden sm:inline-flex items-center px-4 py-2 bg-[#C41E1E] text-white text-sm font-semibold rounded hover:bg-[#a81818] transition-colors"
            >
              விசிக-வில் இணைய
            </Link>

            {/* Hamburger */}
            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="பட்டியல் திற"
            >
              {menuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-[#0A1628] z-40 flex flex-col p-6 gap-4 overflow-y-auto">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`text-lg py-3 border-b border-white/10 transition-colors ${
                isActive(href)
                  ? "text-white font-semibold"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/join"
            onClick={() => setMenuOpen(false)}
            className="mt-4 inline-flex justify-center items-center px-4 py-3 bg-[#C41E1E] text-white font-semibold rounded hover:bg-[#a81818] transition-colors"
          >
            விசிக-வில் இணைய
          </Link>
        </div>
      )}
    </nav>
  );
}

import Link from "next/link";

const PARTY_LINKS = [
  { href: "/leadership", label: "கட்சியின் அமைப்பு" },
  { href: "/party-wings", label: "கட்சியின் உட்பிரிவுகள்" },
  { href: "/statements", label: "அறிக்கைகள்" },
  { href: "/elected-members", label: "மக்கள் பிரதிநிதிகள்" },
];

const QUICK_LINKS = [
  { href: "/join", label: "விசிக-வில் இணைய" },
  { href: "/news", label: "செய்திகள்" },
  { href: "/contact", label: "தொடர்புக்கு" },
];

const CONTACT_LINKS = [
  { href: "/ideology", label: "கொள்கைகள்" },
  { href: "/history", label: "வரலாற்று மைல்கற்கள்" },
  { href: "mailto:info@vckitwing.com", label: "info@vckitwing.com", external: true },
];

export default function Footer() {
  return (
    <footer className="text-white">
      {/* Top red strip */}
      <div className="bg-[#C41E1E] py-8 text-center px-4">
        <p
          className="text-4xl font-black text-white leading-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          போராட்டம் தொடர்கிறது
        </p>
        <p className="mt-2 text-white/80 text-sm tracking-wide">
          34 ஆண்டுகளாக... இன்றும் களத்தில்
        </p>
      </div>

      {/* Main footer */}
      <div className="bg-[#0A1628] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-12 lg:gap-16">
            {/* Left: Brand + description + social */}
            <div className="flex flex-col gap-5">
              {/* Logo */}
              <div>
                <p className="text-white/50 text-xs font-medium tracking-widest uppercase mb-1">
                  விடுதலைச் சிறுத்தைகள்
                </p>
                <p
                  className="text-3xl font-black tracking-widest text-white"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  VCK
                </p>
              </div>

              {/* Description */}
              <p className="text-sm text-white/60 leading-relaxed max-w-sm">
                விடுதலைச் சிறுத்தைகள் கட்சி — தமிழ்நாட்டின் ஒடுக்கப்பட்ட
                மக்களின் உரிமைகளுக்காகவும் மரியாதைக்காகவும் 1992 முதல்
                இடைவிடாது போராடி வருகிறோம். தெருவிலிருந்து
                பாராளுமன்றம் வரை — இது ஒரு இயக்கம்.
              </p>

              {/* Social icons */}
              <div className="flex items-center gap-5 mt-1">
                {/* Facebook */}
                <a
                  href="https://facebook.com"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88v-6.99H7.9v-2.89h2.54V9.84c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.77l-.44 2.89h-2.33v6.99C18.34 21.12 22 17 22 12z" />
                  </svg>
                </a>
                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.333-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.333-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 5.775.131 4.602.44 3.635 1.408 2.667 2.375 2.358 3.548 2.3 4.826 2.241 6.107 2.227 6.515 2.227 12s.014 5.893.073 7.174c.058 1.278.367 2.451 1.335 3.418.967.968 2.14 1.277 3.418 1.335C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.073c1.278-.058 2.451-.367 3.418-1.335.968-.967 1.277-2.14 1.335-3.418.059-1.281.073-1.689.073-7.174s-.014-5.893-.073-7.174c-.058-1.278-.367-2.451-1.335-3.418C19.398.44 18.225.131 16.947.072 15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
                  </svg>
                </a>
                {/* X / Twitter */}
                <a
                  href="https://x.com"
                  aria-label="X"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                {/* YouTube */}
                <a
                  href="https://youtube.com"
                  aria-label="YouTube"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/40 hover:text-white transition-colors duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right: 3 link columns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {/* Column: கட்சி */}
              <div>
                <h3
                  className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  கட்சி
                </h3>
                <ul className="flex flex-col gap-3">
                  {PARTY_LINKS.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-sm text-white/60 hover:text-white transition-colors duration-200 leading-snug block"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column: விரைவு இணைப்புகள் */}
              <div>
                <h3
                  className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  விரைவு இணைப்புகள்
                </h3>
                <ul className="flex flex-col gap-3">
                  {QUICK_LINKS.map(({ href, label }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="text-sm text-white/60 hover:text-white transition-colors duration-200 leading-snug block"
                      >
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Column: தொடர்புக்கு */}
              <div>
                <h3
                  className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-5"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  தொடர்புக்கு
                </h3>
                <ul className="flex flex-col gap-3">
                  {CONTACT_LINKS.map(({ href, label, external }) => (
                    <li key={href}>
                      {external ? (
                        <a
                          href={href}
                          className="text-sm text-white/60 hover:text-white transition-colors duration-200 leading-snug block break-all"
                        >
                          {label}
                        </a>
                      ) : (
                        <Link
                          href={href}
                          className="text-sm text-white/60 hover:text-white transition-colors duration-200 leading-snug block"
                        >
                          {label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="bg-black/30 py-4">
        <p className="text-center text-xs text-white/30">
          விடுதலைச் சிறுத்தைகள் கட்சி &copy; 2026 — எல்லா உரிமைகளும்
          பாதுகாக்கப்பட்டவை
        </p>
      </div>
    </footer>
  );
}

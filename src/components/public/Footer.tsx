import Link from "next/link";
import Image from "next/image";

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
              <div className="flex items-center gap-3">
                <Image
                  src="/logo.png"
                  alt="விடுதலைச் சிறுத்தைகள் கட்சி"
                  width={56}
                  height={56}
                  className="rounded-full object-cover"
                />
                <div className="flex flex-col leading-tight">
                  <span
                    className="text-white font-black text-base"
                    style={{ fontFamily: "var(--font-heading)" }}
                  >
                    விடுதலைச் சிறுத்தைகள் கட்சி
                  </span>
                  <span className="text-white/40 text-[10px] tracking-widest uppercase font-medium mt-0.5">
                    VCK
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-3 max-w-sm">
                <p className="text-xs font-semibold uppercase tracking-widest text-[#C41E1E]"
                  style={{ fontFamily: "var(--font-body)" }}>
                  விசிக பற்றி
                </p>
                <p className="text-sm text-white/60 leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}>
                  விசிக தமிழ்நாட்டில் மறுக்க முடியாத அரசியல் இயக்கமாக இருந்து வருகிறது. இது சாதி ஒழிப்பு, சமூக நீதி, மதச்சார்பின்மை ஆகிய தளங்களில் உழைக்கும் மக்களின் விடுதலைக்காகவும் அவர்களின் சமூக பொருளாதார மற்றும் அரசியல் உரிமைகளுக்காக அர்ப்பணித்து இயங்கி வருகிறது.
                </p>
                <p className="text-sm text-white/40 leading-relaxed"
                  style={{ fontFamily: "var(--font-body)" }}>
                  ஒடுக்கப்பட்ட தலித் மற்றும் விளிம்பு நிலை மக்கள் அரசியல் நீரோட்டத்தில் பங்குபெறச் செய்து அனைத்து மக்களையும் ஒன்றிணைத்து அவர்களை சமூக அதிகாரம் உள்ள மக்களாக மாற்ற பாடுபட்டு வருகிறது.
                </p>
              </div>

              {/* Social icons */}
              <div className="flex flex-wrap items-center gap-4 mt-1">
                {[
                  { href: "https://www.facebook.com/Itwingvckofficials", label: "Facebook", path: "M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.99 3.66 9.12 8.44 9.88v-6.99H7.9v-2.89h2.54V9.84c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.77l-.44 2.89h-2.33v6.99C18.34 21.12 22 17 22 12z" },
                  { href: "https://www.instagram.com/vckitwingofficial", label: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.333 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.333-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.333-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 5.775.131 4.602.44 3.635 1.408 2.667 2.375 2.358 3.548 2.3 4.826 2.241 6.107 2.227 6.515 2.227 12s.014 5.893.073 7.174c.058 1.278.367 2.451 1.335 3.418.967.968 2.14 1.277 3.418 1.335C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.073c1.278-.058 2.451-.367 3.418-1.335.968-.967 1.277-2.14 1.335-3.418.059-1.281.073-1.689.073-7.174s-.014-5.893-.073-7.174c-.058-1.278-.367-2.451-1.335-3.418C19.398.44 18.225.131 16.947.072 15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" },
                  { href: "https://x.com/vckitwingoffi", label: "X", path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" },
                  { href: "https://www.youtube.com/@itwingvck", label: "YouTube", path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" },
                  { href: "https://whatsapp.com/channel/0029Va4yTZ67z4kY7A9IL33y", label: "WhatsApp", path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" },
                  { href: "https://t.me/vckitwing", label: "Telegram", path: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" },
                ].map(({ href, label, path }) => (
                  <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer"
                    className="text-white/40 hover:text-white transition-colors duration-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={path} />
                    </svg>
                  </a>
                ))}
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

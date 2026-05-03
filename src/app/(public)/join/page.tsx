import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "விசிக-வில் இணைய | விடுதலைச் சிறுத்தைகள் கட்சி",
};

export default function JoinPage() {
  return (
    <>
      <div className="h-14" aria-hidden="true" />
      <section className="bg-[#0A1628] min-h-[90vh] flex items-center justify-center px-6 py-24">
        <div className="max-w-lg w-full text-center">
          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-[#C41E1E]/15 border border-[#C41E1E]/30 flex items-center justify-center mx-auto mb-8">
            <span className="text-3xl">✊</span>
          </div>

          <p
            className="text-[#C41E1E] text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            விடுதலைச் சிறுத்தைகள் கட்சி
          </p>

          <h1
            className="text-white font-black text-4xl lg:text-5xl mb-4 leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            விசிக-வில் இணைய
          </h1>

          <p
            className="text-white/50 text-base leading-relaxed mb-10"
            style={{ fontFamily: "var(--font-body)" }}
          >
            உறுப்பினர் சேர்க்கை விரைவில் தொடங்கும். தொடர்புக்கு கீழே உள்ள முகவரியில் எங்களை அணுகவும்.
          </p>

          {/* Contact card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-[#C41E1E] text-lg mt-0.5">📍</span>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-body)" }}>முகவரி</p>
                <p className="text-white/80 text-sm leading-relaxed" style={{ fontFamily: "var(--font-body)" }}>
                  விடுதலைச் சிறுத்தைகள் கட்சி தலைமையகம், தமிழ்நாடு
                </p>
              </div>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex items-start gap-3">
              <span className="text-[#C41E1E] text-lg mt-0.5">✉️</span>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-1" style={{ fontFamily: "var(--font-body)" }}>மின்னஞ்சல்</p>
                <a
                  href="mailto:info@vckitwing.com"
                  className="text-white/80 text-sm hover:text-white transition-colors"
                >
                  info@vckitwing.com
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C41E1E] text-white font-bold rounded-full hover:bg-[#a81818] transition-colors"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              தொடர்பு கொள்ள
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 border border-white/20 text-white/70 font-medium rounded-full hover:border-white/40 hover:text-white transition-colors"
              style={{ fontFamily: "var(--font-body)" }}
            >
              முகப்புக்கு திரும்ப
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

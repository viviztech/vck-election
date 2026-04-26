import Link from "next/link";

export default function JoinCTA() {
  return (
    <section className="bg-[#C41E1E] py-28 px-6 relative overflow-hidden">
      {/* Background watermark */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden="true"
      >
        <span
          className="text-white/5 font-black leading-none"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(10rem,35vw,32rem)",
          }}
        >
          VCK
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <h2
          className="text-white font-black leading-tight"
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(2.2rem,5vw,4.5rem)",
          }}
        >
          போராட்டம் தொடர்கிறது.
        </h2>

        <p
          className="text-white/70 text-xl mt-4"
          style={{ fontFamily: "var(--font-body)" }}
        >
          நீங்களும் பங்காளியாகுங்கள்.
        </p>

        {/* Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/join"
            className="bg-white text-[#C41E1E] font-bold px-8 py-4 rounded-lg hover:bg-[#F5F0E8] transition-colors text-base"
          >
            விசிக-வில் இணைய
          </Link>
          <Link
            href="/donate"
            className="border-2 border-white/40 text-white font-bold px-8 py-4 rounded-lg hover:bg-white/10 hover:border-white/70 transition-colors text-base"
          >
            நன்கொடை அளியுங்கள்
          </Link>
        </div>
      </div>
    </section>
  );
}

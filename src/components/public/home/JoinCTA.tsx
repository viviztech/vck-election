import Link from "next/link";

export default function JoinCTA() {
  return (
    <section className="bg-[#C41E1E] text-white py-24 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-10">
          போராட்டம் தொடர்கிறது. நீங்களும் பங்காளியாகுங்கள்.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/join"
            className="px-8 py-3 bg-white text-[#C41E1E] rounded font-bold hover:bg-white/90 transition-colors"
          >
            விசிக-வில் இணைய
          </Link>
          <Link
            href="/donate"
            className="px-8 py-3 border-2 border-white text-white rounded font-bold hover:bg-white hover:text-[#C41E1E] transition-colors"
          >
            நன்கொடை அளியுங்கள்
          </Link>
        </div>
      </div>
    </section>
  );
}

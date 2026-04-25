export default function HistoryHero() {
  return (
    <section className="relative flex items-center justify-center min-h-svh bg-[#0A1628] overflow-hidden">
      {/* Faded decorative year */}
      <span
        aria-hidden="true"
        className="absolute select-none font-black text-white opacity-5 pointer-events-none"
        style={{
          fontSize: "clamp(8rem, 30vw, 28rem)",
          letterSpacing: "-0.05em",
          userSelect: "none",
        }}
      >
        1990
      </span>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-white leading-tight mb-6">
          எங்கள் வரலாறு
        </h1>
        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto">
          விடுதலைச் சிறுத்தைகள் கட்சி — வரலாற்று மைல்கற்கள்
        </p>
      </div>
    </section>
  );
}

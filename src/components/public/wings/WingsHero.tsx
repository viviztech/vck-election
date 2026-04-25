export default function WingsHero() {
  return (
    <section className="relative flex items-center justify-center min-h-[50vh] bg-[#0A1628] overflow-hidden">
      {/* Decorative faded background text */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center text-white opacity-5 font-black text-[20vw] leading-none select-none pointer-events-none whitespace-nowrap"
      >
        உட்பிரிவுகள்
      </span>

      {/* Decorative left accent bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-[#C41E1E] opacity-60" aria-hidden="true" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="text-[#C41E1E] font-semibold tracking-widest uppercase text-sm mb-4">
          விடுதலைச் சிறுத்தைகள் கட்சி
        </p>
        <h1 className="font-serif text-5xl sm:text-7xl text-white leading-tight mb-6">
          கட்சியின் உட்பிரிவுகள்
        </h1>
        <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto">
          சமூக நீதி மற்றும் முன்னேற்றத்திற்காக செயல்படும் பல்வேறு உட்பிரிவுகள்
        </p>
      </div>
    </section>
  );
}

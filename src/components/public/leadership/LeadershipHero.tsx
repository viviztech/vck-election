export default function LeadershipHero() {
  return (
    <section className="relative bg-[#0A1628] text-white min-h-screen flex items-center justify-center overflow-hidden">
      {/* Decorative background text */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center text-[clamp(5rem,18vw,14rem)] font-black tracking-widest text-white opacity-5 select-none pointer-events-none whitespace-nowrap"
      >
        தலைவர்கள்
      </span>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          கட்சியின் அமைப்பு
        </h1>
        <p className="text-lg md:text-2xl text-white/70 max-w-2xl mx-auto">
          விடுதலைச் சிறுத்தைகள் கட்சியின் தலைவர்கள்
        </p>
      </div>
    </section>
  );
}

export default function IdeologyHero() {
  return (
    <section className="relative flex items-center justify-center min-h-svh bg-[#0A1628] overflow-hidden">
      {/* Decorative faded background text */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center text-white opacity-5 font-black text-[20vw] leading-none select-none pointer-events-none whitespace-nowrap"
      >
        கொள்கைகள்
      </span>

      {/* Decorative top-left accent bar */}
      <div className="absolute top-0 left-0 w-1 h-full bg-[#C41E1E] opacity-60" aria-hidden="true" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="text-[#C41E1E] font-semibold tracking-widest uppercase text-sm mb-4">
          விடுதலைச் சிறுத்தைகள் கட்சி
        </p>
        <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl text-white leading-tight mb-6">
          கட்சியின் பிரதான கொள்கைகள்
        </h1>
        <p className="text-lg sm:text-xl text-white/60 italic max-w-2xl mx-auto">
          சாதி ஒழிப்பு, சமூக நீதி மற்றும் தமிழ்த் தேசியத்தின் அடிப்படையில் கட்டமைக்கப்பட்ட இயக்கம்
        </p>
      </div>
    </section>
  );
}

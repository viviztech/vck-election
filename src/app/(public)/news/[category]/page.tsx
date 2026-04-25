type Props = {
  params: Promise<{ category: string }>;
};

export default async function NewsCategoryPage({ params }: Props) {
  const { category } = await params;
  const label = decodeURIComponent(category)
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <>
      {/* Hero */}
      <section className="relative flex items-center justify-center min-h-[40vh] bg-[#0A1628] overflow-hidden px-6">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#C41E1E] opacity-60" aria-hidden="true" />
        <div className="relative z-10 text-center max-w-3xl mx-auto">
          <p className="text-[#C41E1E] font-semibold tracking-widest uppercase text-sm mb-4">
            செய்திகள்
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl text-white leading-tight mb-6">
            {label}
          </h1>
          <p className="text-lg text-white/60">
            விடுதலைச் சிறுத்தைகள் கட்சியின் செய்திகள், அறிக்கைகள் மற்றும் நிகழ்வுகள்
          </p>
        </div>
      </section>

      {/* Placeholder */}
      <section className="bg-[#F5F0E8] min-h-[50vh] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="text-[#1A1A1A]/40 text-lg">விரைவில் வருகிறது</p>
        </div>
      </section>
    </>
  );
}

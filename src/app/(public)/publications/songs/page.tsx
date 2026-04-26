import type { Metadata } from "next";

export const metadata: Metadata = { title: "கொள்கைப் பாடல்கள் | விடுதலைச் சிறுத்தைகள் கட்சி" };

export default function Page() {
  return (
    <>
      <div className="h-14" aria-hidden="true" />
      <section className="bg-[#0A1628] min-h-[50vh] flex items-center justify-center px-6 py-24">
        <div className="text-center">
          <p
            className="text-[#C41E1E] text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            விடுதலைச் சிறுத்தைகள் கட்சி
          </p>
          <h1
            className="text-white font-black text-4xl lg:text-6xl mb-6"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            கொள்கைப் பாடல்கள்
          </h1>
          <p className="text-white/40 text-lg" style={{ fontFamily: "var(--font-body)" }}>
            விரைவில் வருகிறது
          </p>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import ElectedHero from "@/components/public/elected-members/ElectedHero";
import ElectedMembers from "@/components/public/elected-members/ElectedMembers";

export const metadata: Metadata = { title: "நா.உ. | விடுதலைச் சிறுத்தைகள் கட்சி" };

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
            நாடாளுமன்ற உறுப்பினர்கள்
          </h1>
        </div>
      </section>
      <ElectedHero />
      <ElectedMembers />
    </>
  );
}

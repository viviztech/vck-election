import CandidateCard3D from "@/components/public/motion/CandidateCard3D";

interface Leader {
  name: string;
  nameTA: string;
  role: string;
  constituency: string;
  gradient: string;
}

const LEADERS: Leader[] = [
  {
    name: "Thol. Thirumavalavan",
    nameTA: "தொல். திருமாவளவன்",
    role: "தலைவர்",
    constituency: "சிதம்பரம்",
    gradient: "bg-gradient-to-br from-[#0A1628] to-[#1B3A6B]",
  },
  {
    name: "D. Ravikumar",
    nameTA: "து. ரவிக்குமார்",
    role: "பொதுச் செயலாளர்",
    constituency: "விழுப்புரம்",
    gradient: "bg-gradient-to-br from-[#1B3A6B] to-[#C41E1E]",
  },
  {
    name: "Sinthanai Selvan",
    nameTA: "சிந்தனைச் செல்வன்",
    role: "சட்டமன்ற உறுப்பினர்",
    constituency: "காட்டுமன்னார்கோவில்",
    gradient: "bg-gradient-to-br from-[#C41E1E] to-[#0A1628]",
  },
  {
    name: "Aloor Sha Navas",
    nameTA: "ஆளூர் ஷாநவாஸ்",
    role: "சட்டமன்ற உறுப்பினர்",
    constituency: "நாகப்பட்டினம்",
    gradient: "bg-gradient-to-br from-[#0A1628] to-[#C41E1E]",
  },
];

export default function LeadersSection() {
  return (
    <section className="bg-[#0A1628] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Label */}
        <p
          className="text-[#C41E1E] text-xs font-semibold uppercase tracking-widest text-center mb-4"
          style={{ fontFamily: "var(--font-body)" }}
        >
          தலைமை
        </p>

        {/* Heading */}
        <h2
          className="text-white font-black text-4xl lg:text-5xl text-center mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          கட்சியின் தலைவர்கள்
        </h2>

        {/* Sub */}
        <p
          className="text-white/40 text-base text-center mb-16"
          style={{ fontFamily: "var(--font-body)" }}
        >
          இயக்கத்தை வழிநடத்தும் முகங்கள்
        </p>

        {/* 3D cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {LEADERS.map((leader) => (
            <CandidateCard3D
              key={leader.name}
              name={leader.name}
              nameTA={leader.nameTA}
              role={leader.role}
              constituency={leader.constituency}
              gradient={leader.gradient}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

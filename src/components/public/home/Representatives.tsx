interface Rep {
  name: string;
  role: string;
  constituency: string;
}

const MPs: Rep[] = [
  {
    name: "தொல். திருமாவளவன்",
    role: "நா.உ. (மக்களவை)",
    constituency: "சிதம்பரம் தொகுதி",
  },
  {
    name: "து. ரவிக்குமார்",
    role: "நா.உ. (மக்களவை)",
    constituency: "விழுப்புரம் தொகுதி",
  },
];

const MLAs: Rep[] = [
  {
    name: "சிந்தனைச் செல்வன்",
    role: "ச.உ.",
    constituency: "காட்டுமன்னார்கோவில்",
  },
  {
    name: "ஆளூர் ஷாநவாஸ்",
    role: "ச.உ.",
    constituency: "நாகப்பட்டினம்",
  },
  {
    name: "பனையூர் மு. பாபு",
    role: "ச.உ.",
    constituency: "செய்யூர்",
  },
  {
    name: "எஸ்.எஸ். பாலாஜி",
    role: "ச.உ.",
    constituency: "திருப்போரூர்",
  },
];

function PersonCard({ rep }: { rep: Rep }) {
  const initial = rep.name.charAt(0);
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-[#E8E0D0] p-5 flex items-center gap-4">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#0A1628] to-[#1B3A6B] flex items-center justify-center text-white font-black text-base shrink-0">
        {initial}
      </div>
      {/* Info */}
      <div>
        <p
          className="font-bold text-[#0A1628] text-sm"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {rep.name}
        </p>
        <p
          className="text-[#C41E1E] text-[10px] font-bold uppercase tracking-wide mt-0.5"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {rep.role}
        </p>
        <p
          className="text-gray-400 text-xs mt-0.5"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {rep.constituency}
        </p>
      </div>
    </div>
  );
}

export default function Representatives() {
  return (
    <section className="bg-[#F5F0E8] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <p className="text-[#C41E1E] text-xs font-semibold uppercase tracking-widest text-center mb-4">
          மக்களுக்கு சேவை
        </p>

        {/* Heading */}
        <h2
          className="font-black text-[#0A1628] text-4xl lg:text-5xl text-center mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          மக்களுக்கு சேவை
        </h2>

        {/* Sub */}
        <p
          className="text-gray-500 text-base text-center mb-16"
          style={{ fontFamily: "var(--font-body)" }}
        >
          நாடாளுமன்றம் மற்றும் சட்டமன்றத்தில் விசி பிரதிநிதிகள்
        </p>

        {/* MPs */}
        <div className="max-w-2xl mx-auto mb-16">
          <p
            className="text-[#C41E1E] text-xs uppercase tracking-widest font-semibold mb-6"
            style={{ fontFamily: "var(--font-body)" }}
          >
            நாடாளுமன்ற உறுப்பினர்கள்
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MPs.map((rep) => (
              <PersonCard key={rep.name} rep={rep} />
            ))}
          </div>
        </div>

        {/* MLAs */}
        <div className="max-w-4xl mx-auto">
          <p
            className="text-[#C41E1E] text-xs uppercase tracking-widest font-semibold mb-6"
            style={{ fontFamily: "var(--font-body)" }}
          >
            சட்டமன்ற உறுப்பினர்கள்
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MLAs.map((rep) => (
              <PersonCard key={rep.name} rep={rep} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

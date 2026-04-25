type Rep = { name: string; role: string; constituency: string };

const MPs: Rep[] = [
  { name: "தொல். திருமாவளவன்", role: "நாடாளுமன்ற உறுப்பினர் (மக்களவை)", constituency: "சிதம்பரம் தொகுதி" },
  { name: "து. ரவிக்குமார்", role: "நாடாளுமன்ற உறுப்பினர் (மக்களவை)", constituency: "விழுப்புரம் தொகுதி" },
];

const MLAs: Rep[] = [
  { name: "சிந்தனைச் செல்வன்", role: "சட்டமன்ற உறுப்பினர்", constituency: "காட்டுமன்னார்கோவில் தொகுதி" },
  { name: "ஆளூர் ஷாநவாஸ்", role: "சட்டமன்ற உறுப்பினர்", constituency: "நாகப்பட்டினம் தொகுதி" },
  { name: "பனையூர் மு. பாபு", role: "சட்டமன்ற உறுப்பினர்", constituency: "செய்யூர் தொகுதி" },
  { name: "எஸ்.எஸ். பாலாஜி", role: "சட்டமன்ற உறுப்பினர்", constituency: "திருப்போரூர் தொகுதி" },
];

function RepCard({ rep }: { rep: Rep }) {
  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-[#e0d9ce] flex gap-4 items-center">
      <div className="shrink-0 w-16 h-16 bg-gray-200 rounded-lg" aria-hidden="true" />
      <div>
        <p className="font-bold text-[#0A1628] text-sm">{rep.name}</p>
        <p className="text-xs text-gray-500 mt-0.5">{rep.role}</p>
        <p className="text-xs text-[#C41E1E] font-medium mt-1">{rep.constituency}</p>
      </div>
    </div>
  );
}

function RepRow({ title, reps }: { title: string; reps: Rep[] }) {
  return (
    <div className="mb-12">
      <h3 className="text-base font-bold text-[#0A1628] mb-5 uppercase tracking-wide">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {reps.map((r) => <RepCard key={r.name} rep={r} />)}
      </div>
    </div>
  );
}

export default function Representatives() {
  return (
    <section className="bg-[#F5F0E8] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] text-center mb-14">
          மக்கள் பிரதிநிதிகள்
        </h2>
        <RepRow title="நாடாளுமன்ற உறுப்பினர்கள்" reps={MPs} />
        <RepRow title="சட்டமன்ற உறுப்பினர்கள்" reps={MLAs} />
      </div>
    </section>
  );
}

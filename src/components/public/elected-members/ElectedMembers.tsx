"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const mps = [
  { name: "தொல். திருமாவளவன்", constituency: "சிதம்பரம் தொகுதி", designation: "நாடாளுமன்ற உறுப்பினர் (மக்களவை)" },
  { name: "து. ரவிக்குமார்", constituency: "விழுப்புரம் தொகுதி", designation: "நாடாளுமன்ற உறுப்பினர் (மக்களவை)" },
];

const mlas = [
  { name: "சிந்தனைச் செல்வன்", constituency: "காட்டுமன்னார்கோவில் தொகுதி", designation: "சட்டமன்ற உறுப்பினர்" },
  { name: "ஆளூர் ஷாநவாஸ்", constituency: "நாகப்பட்டினம் தொகுதி", designation: "சட்டமன்ற உறுப்பினர்" },
  { name: "பனையூர் மு. பாபு", constituency: "செய்யூர் தொகுதி", designation: "சட்டமன்ற உறுப்பினர்" },
  { name: "எஸ்.எஸ். பாலாஜி", constituency: "திருப்போரூர் தொகுதி", designation: "சட்டமன்ற உறுப்பினர்" },
];

type Member = { name: string; constituency: string; designation: string };

function MemberCard({ member, index }: { member: Member; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow overflow-hidden"
    >
      <div className="w-full h-40 bg-[#E8E0D0]" aria-hidden="true" />
      <div className="p-4">
        <h3 className="font-semibold text-[#0A1628] text-base mb-2">{member.name}</h3>
        <span className="inline-block bg-[#C41E1E] text-white text-xs px-2 py-1 rounded mb-2">
          {member.constituency}
        </span>
        <p className="text-sm text-gray-500">{member.designation}</p>
      </div>
    </motion.div>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-3xl font-bold text-[#0A1628] mb-2">
      {children}
      <span className="block w-16 h-1 bg-[#C41E1E] mt-2 rounded" />
    </h2>
  );
}

export default function ElectedMembers() {
  return (
    <section className="bg-[#F5F0E8] py-20 px-6">
      <div className="max-w-6xl mx-auto">

        {/* Section A — MPs */}
        <div className="mb-10">
          <SectionHeading>நாடாளுமன்ற உறுப்பினர்கள்</SectionHeading>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-14">
          {mps.map((mp, i) => (
            <MemberCard key={mp.name} member={mp} index={i} />
          ))}
        </div>

        {/* Map placeholder */}
        <div className="mb-14">
          <div className="bg-[#E8E0D0] rounded-xl min-h-[300px] flex items-center justify-center">
            <svg
              viewBox="0 0 320 300"
              aria-label="Tamil Nadu constituency map placeholder"
              className="w-full max-w-md h-auto"
            >
              <rect x="20" y="20" width="280" height="260" rx="20" fill="#C9BFB0" />
              <text x="160" y="155" textAnchor="middle" fill="#0A1628" fontSize="22" fontWeight="bold">
                தமிழ்நாடு
              </text>
            </svg>
          </div>
          <p className="text-center text-gray-500 italic text-sm mt-3">
            ஊடாடும் தொகுதி வரைபடம் — விரைவில்
          </p>
        </div>

        {/* Divider */}
        <hr className="border-[#E8E0D0] mb-14" />

        {/* Section B — MLAs */}
        <div className="mb-10">
          <SectionHeading>சட்டமன்ற உறுப்பினர்கள்</SectionHeading>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-14">
          {mlas.map((mla, i) => (
            <MemberCard key={mla.name} member={mla} index={i} />
          ))}
        </div>

        {/* Achievements */}
        <hr className="border-[#E8E0D0] mb-14" />
        <div className="mb-10">
          <SectionHeading>முக்கிய சாதனைகள்</SectionHeading>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              title: "தேர்தல் வெற்றி",
              desc: "தொடர்ச்சியான தேர்தல் வெற்றிகள் மூலம் வலுவான மக்கள் ஆணையை நிரூபித்தல்",
            },
            {
              title: "சட்டமன்றப் பங்களிப்புகள்",
              desc: "சமூக நீதி மற்றும் விளிம்பு நிலை சமூகங்களின் நலனுக்காக மசோதாக்கள் மற்றும் தீர்மானங்களை அறிமுகப்படுத்துதல்",
            },
            {
              title: "சமூக சேவை",
              desc: "சமூக மேம்பாடு மற்றும் பொது நல முயற்சிகளில் தீவிர ஈடுபாடு",
            },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-6 shadow-sm border-t-4 border-[#C41E1E]">
              <h3 className="font-bold text-[#0A1628] mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

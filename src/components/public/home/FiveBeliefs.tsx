"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const BELIEFS = [
  { n: "01", title: "சாதி ஒழிப்பு", desc: "இந்து வர்ணாசிரம சாதிய அடுக்கு முறையை வேரறுத்தல்" },
  { n: "02", title: "சமூக நீதி", desc: "சாதியின் பெயரால் நிகழ்த்தப்படும் அனைத்து வகையான பாகுபாடுகளையும் எதிர்த்தல்" },
  { n: "03", title: "பெண் விடுதலை", desc: "பெண் விடுதலையை உறுதி செய்தல்" },
  { n: "04", title: "தமிழ்த் தேசியம்", desc: "தமிழ் மக்களின் மொழி, பண்பாடு மற்றும் கலாச்சார அடையாளங்களை மீட்டெடுத்து வலுவான தமிழ்த் தேசியத்தை நிறுவுதல்" },
  { n: "05", title: "மதச்சார்பின்மை", desc: "சுரண்டல் மிகுந்த முதலாளித்துவ கொள்கைகளை எதிர்த்து உழைக்கும் தொழிலாளர்கள் உரிமைகளை வென்றெடுத்தல்" },
];

export default function FiveBeliefs() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section className="bg-[#F5F0E8] py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] text-center mb-14">
          நம் கொள்கைகள்
        </h2>
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {BELIEFS.map((b, i) => (
            <motion.div
              key={b.n}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-[#e0d9ce] flex flex-col gap-3"
            >
              <span className="text-5xl font-black text-[#C41E1E]/20 leading-none">{b.n}</span>
              <h3 className="text-base font-bold text-[#0A1628]">{b.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

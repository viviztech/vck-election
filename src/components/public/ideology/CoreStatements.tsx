"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const STATEMENTS = [
  "இந்து வர்ணாசிரம சாதிய அடுக்கு முறையை வேரறுத்தல்",
  "சாதியின் பெயரால் நிகழ்த்தப்படும் அனைத்து வகையான பாகுபாடுகளையும் எதிர்த்தல்",
  "தமிழ் மக்களிடையே சமத்துவச் சமுதாயத்தைக் கட்டமைக்க உறுதி செய்தல்",
  "தமிழ் மக்களின் மொழி, பண்பாடு மற்றும் கலாச்சார அடையாளங்களை மீட்டெடுத்து வலுவான தமிழ்த் தேசியத்தை நிறுவுதல்",
  "சுரண்டல் மிகுந்த முதலாளித்துவ கொள்கைகளை எதிர்த்து உழைக்கும் தொழிலாளர்கள் உரிமைகளை வென்றெடுத்தல்",
  "பெண் விடுதலையை உறுதி செய்தல்",
];

function StatementRow({ number, text, index }: { number: string; text: string; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -60 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.08, ease: "easeOut" }}
      className="flex items-start gap-6 sm:gap-10 py-7 border-b border-[#E8E0D0] last:border-b-0"
    >
      <span className="text-5xl sm:text-7xl font-black text-[#C41E1E] leading-none shrink-0 w-14 sm:w-20 text-right">
        {number}
      </span>
      <p className="text-[#1A1A1A] text-base sm:text-xl leading-relaxed pt-2 sm:pt-4 font-medium">
        {text}
      </p>
    </motion.div>
  );
}

export default function CoreStatements() {
  return (
    <section className="bg-[#F5F0E8] py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] mb-12">
          அடிப்படைக் கொள்கைகள்
        </h2>
        <div>
          {STATEMENTS.map((text, i) => (
            <StatementRow
              key={i}
              number={String(i + 1).padStart(2, "0")}
              text={text}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

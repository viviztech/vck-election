"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const WINGS = [
  "அச்சு ஊடக மையம்",
  "அனைத்து ஆசிரியர் கூட்டமைப்பு",
  "அரசு ஊழியர் ஐக்கிய பேரவை",
  "ஆவண மையம்",
  "இளஞ்சிறுத்தைகள் எழுச்சி பாசறை",
  "இஸ்லாமிய சனநாயக பேரவை",
  "ஓவியர் அணி",
  "கல்வி பொருளாதார விழிப்புணர்வு இயக்கம்",
  "காட்சி ஊடக மையம்",
  "கிருத்துவ சமூக நீதிப் பேரவை",
  "சமத்துவ வழக்கறிஞர்கள் சங்கம்",
  "சமூக ஊடகம்",
  "சமூக நல்லிணக்க பேரவை",
  "சுற்றுச்சூழல் பாதுகாப்பு இயக்கம்",
  "தூய்மை பணியாளர் மேம்பாட்டு இயக்கம்",
  "தொண்டர் அணி (பயிற்சி)",
  "தொண்டர் அணி (பாதுகாப்பு)",
  "தொழிலாளர் விடுதலை முன்னணி",
  "நில உரிமை மீட்பு இயக்கம்",
  "பழங்குடியினர் விடுதலை இயக்கம்",
  "பொறியாளர் அணி",
  "மகளிர் விடுதலை இயக்கம்",
  "மது போதைப்பொருள் ஒழிப்பு விழிப்புணர்வு இயக்கம்",
  "மருத்துவ தொண்டு மையம்",
  "மீனவர் மேம்பாட்டு பேராயம்",
  "முற்போக்கு மாணவர் கழகம்",
  "வணிகர் அணி",
  "விடுதலை கலை இலக்கியப் பேரவை",
  "விளையாட்டுத் திறன் மேம்பாட்டு மையம்",
  "விவசாயத் தொழிலாளர் விடுதலை இயக்கம்",
  "விவசாயிகள் பாதுகாப்பு இயக்கம்",
];

const ACCENTS = [
  "#C41E1E", "#1B3A6B", "#0A1628", "#7C3AED", "#16A34A",
  "#D97706", "#0E7490", "#C41E1E", "#1B3A6B", "#0A1628",
  "#7C3AED", "#16A34A", "#D97706", "#0E7490", "#C41E1E",
  "#1B3A6B", "#0A1628", "#7C3AED", "#16A34A", "#D97706",
  "#0E7490", "#C41E1E", "#1B3A6B", "#0A1628", "#7C3AED",
  "#16A34A", "#D97706", "#0E7490", "#C41E1E", "#1B3A6B",
  "#0A1628",
];

function WingCard({ name, accent, index }: { name: string; accent: string; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay: (index % 8) * 0.06 }}
      className="bg-white rounded-lg shadow-sm overflow-hidden"
    >
      <div className="h-1 w-full" style={{ backgroundColor: accent }} />
      <div className="px-5 py-4">
        <p className="text-[#0A1628] font-semibold text-sm sm:text-base leading-snug">
          {name}
        </p>
      </div>
    </motion.div>
  );
}

export default function WingsGrid() {
  return (
    <section className="bg-[#F5F0E8] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-4xl text-[#0A1628] font-bold mb-12 text-center">
          நம் உட்பிரிவுகள்
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {WINGS.map((name, index) => (
            <WingCard key={index} name={name} accent={ACCENTS[index]} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

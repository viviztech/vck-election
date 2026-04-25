"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const MENTORS = [
  {
    name: "கௌதம புத்தர்",
    era: "563 BCE – 483 BCE",
    bio: "சனாதன தர்மத்தை முதன்முதலில் சவால் செய்த புரட்சியாளர். தம்மம், அமைதி மற்றும் விடுதலையின் வழிகாட்டி.",
  },
  {
    name: "பாரத ரத்னா புரட்சியாளர் டாக்டர் பி ஆர் அம்பேத்கர்",
    era: "1891 – 1956",
    bio: "இந்திய அரசியலமைப்பின் தலைமை சிற்பி. தாழ்த்தப்பட்டோர் மற்றும் பெண்களின் உரிமைகளுக்காக வாழ்நாள் முழுவதும் போராடியவர்.",
  },
  {
    name: "பகுத்தறிவு பகலவன் தந்தை பெரியார்",
    era: "1879 – 1973",
    bio: "சுயமரியாதை இயக்கத்தின் நிறுவனர். சாதி, மூடநம்பிக்கை மற்றும் பார்ப்பன ஆதிக்கத்திற்கு எதிராக வீரமாக போராடியவர்.",
  },
  {
    name: "தாத்தா ரெட்டைமலை சீனிவாசன்",
    era: "1859 – 1945",
    bio: "ஒடுக்கப்பட்ட சமுதாயங்களின் அரசியல் வரலாற்றில் முன்னோடி. டாக்டர் அம்பேத்கருடன் வட்டமேசை மாநாட்டில் கலந்துகொண்டவர்.",
  },
  {
    name: "பண்டித அயோத்திதாசர்",
    era: "1845 – 1914",
    bio: "தென்னிந்தியாவின் முதல் சாதி எதிர்ப்பு புரட்சியாளர். திராவிட இயக்கத்தின் கொள்கை விதைகளை விதைத்தவர்.",
  },
  {
    name: "மேதகு பிரபாகரன்",
    era: "1954 – 2009",
    bio: "தமிழீழ விடுதலை புலிகளின் தலைவர். தமிழ் மக்களின் சுயநிர்ணய உரிமைக்காக வாழ்நாளை அர்ப்பணித்தவர்.",
  },
];

export default function IdeologicalMentors() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="bg-[#F5F0E8] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-[#0A1628] mb-12 text-center">
          கொள்கை வழிகாட்டிகள்
        </h2>

        {/* Horizontal scroll on mobile, grid on desktop */}
        <div
          ref={ref}
          className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory md:grid md:grid-cols-3 md:overflow-visible md:pb-0"
        >
          {MENTORS.map((mentor, i) => (
            <motion.div
              key={mentor.name}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              className="snap-start shrink-0 w-64 md:w-auto bg-white rounded-xl p-6 shadow-sm border border-[#E8E0D0] flex flex-col items-center text-center gap-4"
            >
              {/* Portrait placeholder */}
              <div className="w-24 h-24 rounded-full bg-[#E8E0D0] flex items-center justify-center shrink-0">
                <svg viewBox="0 0 48 48" className="w-12 h-12 text-[#0A1628]/30" fill="currentColor" aria-hidden="true">
                  <circle cx="24" cy="18" r="8"/>
                  <path d="M8 42c0-8.837 7.163-16 16-16s16 7.163 16 16"/>
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-[#0A1628] text-base">{mentor.name}</h3>
                <p className="text-[#C41E1E] text-xs font-semibold mt-0.5 mb-2">{mentor.era}</p>
                <p className="text-[#1A1A1A]/70 text-sm leading-relaxed">{mentor.bio}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

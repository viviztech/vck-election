"use client";

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const otherLeaders = [
  { name: "து. இரவிக்குமார்", designation: "பொதுச் செயலாளர் · நாடாளுமன்ற உறுப்பினர், விழுப்புரம்" },
  { name: "M. சிந்தனை செல்வன்", designation: "பொதுச் செயலாளர் · சட்டமன்ற உறுப்பினர், காட்டுமன்னார்கோவில்" },
  { name: "ஆளூர் ஷா நவாஸ்", designation: "துணைப் பொதுச் செயலாளர் · சட்டமன்ற உறுப்பினர், நாகப்பட்டினம்" },
  { name: "பனையூர் மு பாபு", designation: "முதன்மைச் செயலாளர் · சட்டமன்ற உறுப்பினர், செய்யூர்" },
  { name: "எஸ்.எஸ்.பாலாஜி", designation: "துணைப் பொதுச் செயலாளர் · சட்டமன்ற உறுப்பினர், திருப்போரூர்" },
];

function LeaderCard({ name, designation, index }: { name: string; designation: string; index: number }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white rounded-xl shadow p-6 flex flex-col items-center text-center"
    >
      <div className="w-20 h-20 bg-[#E8E0D0] rounded-full mb-4" aria-hidden="true" />
      <h3 className="font-semibold text-[#0A1628] text-base mb-1">{name}</h3>
      <p className="text-sm text-gray-500">{designation}</p>
    </motion.div>
  );
}

export default function LeadershipGrid() {
  const { ref: featuredRef, inView: featuredInView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="bg-[#F5F0E8] py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0A1628] mb-12 text-center">
          கட்சித் தலைவர்கள்
        </h2>

        {/* Featured leader */}
        <motion.div
          ref={featuredRef}
          initial={{ opacity: 0, y: 40 }}
          animate={featuredInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-lg rounded-xl p-8 border-l-4 border-[#C41E1E] flex flex-col md:flex-row gap-8 items-start mb-14"
        >
          <div className="w-48 h-56 bg-[#E8E0D0] rounded-lg flex-shrink-0" aria-hidden="true" />
          <div className="flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-[#0A1628] mb-2">தொல் திருமாவளவன் — தலைவர்</h3>
            <p className="text-sm font-medium text-[#C41E1E] mb-4">
              தலைவர், விடுதலைச் சிறுத்தைகள் கட்சி · நாடாளுமன்ற உறுப்பினர், சிதம்பரம்
            </p>
            <p className="text-[#1A1A1A] leading-relaxed">
              எழுச்சி தமிழர் தொல். திருமாவளவன் 34 ஆண்டுகளுக்கும் மேலாக விசிகவை வழிநடத்தி, அதை ஒரு தண்டவாள இயக்கத்திலிருந்து மாநில கட்சியாக மாற்றியுள்ளார். தலித் உரிமைகள், சமூக நீதி மற்றும் தமிழ் அடையாளத்திற்காக இடைவிடாது போராடும் வீரர்.
            </p>
          </div>
        </motion.div>

        {/* Other leaders grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {otherLeaders.map((leader, i) => (
            <LeaderCard key={leader.name} name={leader.name} designation={leader.designation} index={i} />
          ))}
        </div>

        <p className="text-center text-gray-500 italic text-sm">
          கட்சி வளர்ச்சியுடன் தலைமை தகவல்கள் புதுப்பிக்கப்படும்.
        </p>
      </div>
    </section>
  );
}

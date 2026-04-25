"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

const MILESTONES = [
  {
    year: "1990",
    title: "DPI இயக்கம் விடுதலைச் சிறுத்தைகள் ஆனது",
    desc: "21 ஜனவரி 1990 - திரு இரா. திருமாவளவன் DPI-யின் தலைவராக பொறுப்பேற்றார். DPI இயக்கம் விடுதலை சிறுத்தைகள் என பெயர் மாற்றம் செய்யப்பட்டது.",
  },
  {
    year: "2009",
    title: "முதல் நாடாளுமன்ற வெற்றி",
    desc: "தலைவர் தொல். திருமாவளவன் சிதம்பரம் நாடாளுமன்ற தொகுதியில் 1 லட்சம் வாக்கு வித்தியாசத்தில் வெற்றி பெற்றார்.",
  },
  {
    year: "2024",
    title: "மாநிலக் கட்சி அங்கீகாரம்",
    desc: "இந்திய தேர்தல் ஆணையம் விடுதலை சிறுத்தைகள் கட்சியை தமிழ்நாட்டின் மாநில கட்சியாக அங்கீகரித்து விசிக-விற்கு நிரந்தர சின்னமாக பானை சின்னம் ஒதுக்கப்பட்டது.",
  },
];

export default function HistoryTeaser() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <section className="bg-[#0A1628] text-white py-20 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-14">
          பல தசாப்தங்களாக கட்டமைக்கப்பட்ட இயக்கம்
        </h2>
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {MILESTONES.map((m, i) => (
            <motion.div
              key={m.year}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.15 }}
              className="bg-white/5 rounded-xl p-6 border border-white/10"
            >
              <span className="block text-5xl font-black text-[#C41E1E] mb-3">{m.year}</span>
              <h3 className="font-bold text-white mb-2">{m.title}</h3>
              <p className="text-sm text-white/70 leading-relaxed">{m.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <Link
            href="/history"
            className="inline-block px-8 py-3 border-2 border-[#F5F0E8] text-[#F5F0E8] rounded font-semibold hover:bg-[#F5F0E8] hover:text-[#0A1628] transition-colors"
          >
            முழு வரலாற்றை அறியுங்கள் →
          </Link>
        </div>
      </div>
    </section>
  );
}

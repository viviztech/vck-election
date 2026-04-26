"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Annotation {
  color: string;
  label: string;
  meaning: string;
}

const ANNOTATIONS: Annotation[] = [
  {
    color: "#1B3A6B",
    label: "நீலம்",
    meaning: "ஒடுக்கப்பட்டோரின் உரிமைக் குரலை குறிக்கிறது",
  },
  {
    color: "#C41E1E",
    label: "சிவப்பு",
    meaning:
      "உழைக்கும் மக்களின் விடுதலையை வென்றெடுப்பதற்கான புரட்சிகர பாதையை குறிக்கிறது",
  },
  {
    color: "#F5C518",
    label: "ஐந்து முனை நட்சத்திரம்",
    meaning:
      "சமத்துவம், வறுமை ஒழிப்பு, பெண் விடுதலை, தமிழ் தேசியம், வல்லாதிக்க எதிர்ப்பு",
  },
  {
    color: "#E8E0D0",
    label: "சிறுத்தை",
    meaning: "வீரம் மற்றும் அஞ்சாத எதிர்ப்பு",
  },
  {
    color: "#92400E",
    label: "பானை",
    meaning: "மனித குலத்தின் நாகரிக வளர்ச்சியின் அடையாளம்",
  },
];

export default function FlagDecoded() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <section className="bg-[#0A1628] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <p className="text-[#C41E1E] text-xs font-semibold uppercase tracking-widest text-center mb-4">
          நம் கொடி
        </p>

        {/* Heading */}
        <h2
          className="text-white font-black text-4xl lg:text-5xl text-center mb-16"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          நம் கொடி — பொருள் விளக்கம்
        </h2>

        {/* Cards grid */}
        <div
          ref={ref}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {ANNOTATIONS.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
              className="border border-white/10 rounded-2xl p-6 bg-white/4 hover:bg-white/8 transition-colors duration-300 flex flex-col items-center text-center gap-4"
            >
              {/* Color dot */}
              <span
                className="w-5 h-5 rounded-full shrink-0 ring-1 ring-white/20"
                style={{ backgroundColor: a.color }}
                aria-hidden="true"
              />

              {/* Symbol name */}
              <span
                className="text-white font-bold text-lg leading-snug"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {a.label}
              </span>

              {/* Meaning */}
              <p
                className="text-white/50 text-sm leading-relaxed"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {a.meaning}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

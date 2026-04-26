"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Milestone {
  year: string;
  title: string;
  desc: string;
}

const MILESTONES: Milestone[] = [
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

function MilestoneNode({
  milestone,
  index,
}: {
  milestone: Milestone;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.15, ease: "easeOut" }}
      className="flex flex-col items-center text-center gap-4 relative z-10"
    >
      {/* Circle node */}
      <div className="w-12 h-12 rounded-full bg-[#C41E1E] border-4 border-[#0A1628] shadow-lg shadow-red-900/50 flex items-center justify-center">
        <span className="text-white text-[9px] font-black leading-none">
          {milestone.year}
        </span>
      </div>

      {/* Year */}
      <span
        className="text-[#C41E1E] text-3xl font-black"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {milestone.year}
      </span>

      {/* Title */}
      <h3
        className="text-white font-bold text-sm mt-1"
        style={{ fontFamily: "var(--font-heading)" }}
      >
        {milestone.title}
      </h3>

      {/* Description */}
      <p
        className="text-white/40 text-xs leading-relaxed max-w-[180px]"
        style={{ fontFamily: "var(--font-body)" }}
      >
        {milestone.desc}
      </p>
    </motion.div>
  );
}

export default function HistoryTeaser() {
  return (
    <section className="bg-[#0A1628] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Section label */}
        <p className="text-[#C41E1E] text-xs font-semibold uppercase tracking-widest text-center mb-4">
          வரலாறு
        </p>

        {/* Heading */}
        <h2
          className="text-white font-black text-4xl lg:text-5xl text-center mb-16"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          பல தசாப்தங்களாக கட்டமைக்கப்பட்ட இயக்கம்
        </h2>

        {/* Timeline */}
        <div className="max-w-4xl mx-auto relative">
          {/* Desktop horizontal connector line */}
          <div className="hidden md:block absolute top-6 left-0 right-0 h-px bg-white/10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
            {MILESTONES.map((m, i) => (
              <MilestoneNode key={m.year} milestone={m} index={i} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link
            href="/history"
            className="inline-block border border-white/20 text-white/70 hover:text-white hover:border-white/50 rounded-lg px-7 py-3 text-sm font-semibold transition-colors duration-200"
          >
            முழு வரலாற்றை அறியுங்கள் →
          </Link>
        </div>
      </div>
    </section>
  );
}

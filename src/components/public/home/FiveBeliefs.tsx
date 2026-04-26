"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface Belief {
  n: string;
  title: string;
  desc: string;
}

const BELIEFS: Belief[] = [
  {
    n: "01",
    title: "சாதி ஒழிப்பு",
    desc: "இந்து வர்ணாசிரம சாதிய அடுக்கு முறையை வேரறுத்தல்",
  },
  {
    n: "02",
    title: "சமூக நீதி",
    desc: "தலித்துகள், பழங்குடியினர், பிற்படுத்தப்பட்டோர் — அனைவரும் சம உரிமையாளர்கள்",
  },
  {
    n: "03",
    title: "பெண் விடுதலை",
    desc: "கல்வி, பொருளாதார சுதந்திரம், சமூக மரியாதை — பெண்களுக்கான முழுமையான விடுதலை",
  },
  {
    n: "04",
    title: "தமிழ்த் தேசியம்",
    desc: "தமிழ் மொழி, பண்பாடு மற்றும் கலாச்சார அடையாளங்களை மீட்டெடுத்தல்",
  },
  {
    n: "05",
    title: "மதச்சார்பின்மை",
    desc: "வகுப்புவாத அரசியலை எதிர்த்து அனைத்து மக்களுக்கும் சம மரியாதை",
  },
];

function BeliefRow({ belief, index }: { belief: Belief; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -30 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.55, delay: index * 0.1, ease: "easeOut" }}
      className={`border-b border-[#E8E0D0] py-8 flex gap-6 items-start border-l-4 border-l-[#C41E1E] pl-6 last:border-b-0`}
    >
      {/* Number */}
      <span
        className="text-[#C41E1E]/25 font-black text-6xl leading-none w-16 shrink-0"
        style={{ fontFamily: "var(--font-heading)" }}
        aria-hidden="true"
      >
        {belief.n}
      </span>

      {/* Content */}
      <div className="flex flex-col gap-1">
        <h3
          className="font-black text-xl text-[#0A1628]"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {belief.title}
        </h3>
        <p
          className="text-gray-500 text-sm leading-relaxed"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {belief.desc}
        </p>
      </div>
    </motion.div>
  );
}

export default function FiveBeliefs() {
  return (
    <section className="bg-[#F5F0E8] py-24 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section label */}
        <p className="text-[#C41E1E] text-xs font-semibold uppercase tracking-widest text-center mb-4">
          நாம் எதற்காக நிற்கிறோம்
        </p>

        {/* Heading */}
        <h2
          className="text-4xl lg:text-5xl font-black text-[#0A1628] text-center mb-16"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          நாம் எதற்காக நிற்கிறோம்
        </h2>

        {/* Beliefs list */}
        <div className="max-w-3xl mx-auto">
          {BELIEFS.map((b, i) => (
            <BeliefRow key={b.n} belief={b} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

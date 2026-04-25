"use client";

import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Milestone {
  year: string;
  text: string;
  key?: true;
}

interface Era {
  label: string;
  bg: string;
  milestones: Milestone[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const ERAS: Era[] = [
  {
    label: "விதைகள் (1972–1989)",
    bg: "#0A1628",
    milestones: [
      {
        year: "1972",
        text: "மகாராஷ்டிராவில் தலித் பேன்தர்ஸ் ஆப் இந்தியா (DPI) இயக்கம் J.V.பவார், நம்தியோ தாசர் மற்றும் ராஜா தாலே ஆகியோரால் தோற்றுவிக்கப்பட்டது.",
      },
      {
        year: "1977",
        text: "DPI-யில் இருந்து பிரிந்து பாரதிய தலித் பேன்தர்ஸ் அமைப்பு திரு ராமதாஸ் அட்வாலி போன்றோரால் தோற்றுவிக்கப்பட்டது.",
      },
      {
        year: "1982",
        text: "BDP-யின் தமிழ்நாட்டு கிளையாக தலித் பேன்தர்ஸ் இயக்கம் (DPI) திரு A.மலைச்சாமி அவர்களால் தோற்றுவிக்கப்பட்டது.",
      },
      {
        year: "1988",
        text: "திரு A.மாலைச்சாமியுடன் இரா. திருமாவளவன் அரசு தடயவியல் அதிகாரியாக பணி புரிந்த போது முதல் முறையாக அறிமுகமானார்.",
      },
      {
        year: "14 Sep 1989",
        text: "செப் 14, 1989 - திரு A.மாலைச்சாமி அவர்கள் மறைவு.",
      },
    ],
  },
  {
    label: "எழுச்சி (1990–2008)",
    bg: "#1B3A6B",
    milestones: [
      {
        year: "21 Jan 1990",
        text: "21 ஜனவரி 1990 - திரு இரா. திருமாவளவன் DPI-யின் தலைவராக பொறுப்பேற்றார். DPI இயக்கம் விடுதலை சிறுத்தைகள் என பெயர் மாற்றம் செய்யப்பட்டது.",
        key: true,
      },
      {
        year: "1999",
        text: "11 செப் 1999 - விடுதலை சிறுத்தைகள் கட்சி முதன் முறையாக நாடாளுமன்ற தேர்தலில் போட்டியிட்டது. திரு இரா. திருமாவளவன் சிதம்பரம் தொகுதியில் போட்டியிட்டு 2,25,768 வாக்குகள் பெற்று இரண்டாம் இடம் பிடித்தார்.",
      },
      {
        year: "2001",
        text: "திரு. இரா. திருமாவளவன் தமிழ்நாடு சட்டமன்ற பொது தேர்தலில் மங்களூர் தொகுதியில் போட்டியிட்டு வெற்றி பெற்று சட்ட பேரவை உறுப்பினராக நியமனம் பெற்றார்.",
      },
      {
        year: "2002",
        text: "தமிழ்நாடு அரசின் கட்டாய மத மாற்ற தடைச் சட்டத்தை எதிர்த்து இந்து பெயர்களை கைவிட்டு சுத்த தமிழ் பெயர் சூட்டி கொண்டனர். விடுதலை சிறுத்தைகள் தலைவர் இரா.திருமாவளவன் தொல். திருமாவளவன் என பெயர் மாற்றம் செய்து கொண்டார்.",
      },
      {
        year: "2004",
        text: "தலைவர் தொல் திருமாவளவன் சட்ட மன்ற உறுப்பினர் பதவியில் இருந்து விலகினார்.",
      },
      {
        year: "2006",
        text: "விசிக சட்டபேரவை பொது தேர்தலில் அதிமுக கூட்டணியில் இடம் பெற்று இரண்டு இடங்களில் வெற்றி பெற்றது.",
      },
    ],
  },
  {
    label: "அதிகாரம் (2009–2024)",
    bg: "#C41E1E",
    milestones: [
      {
        year: "2009",
        text: "தலைவர் தொல். திருமாவளவன் சிதம்பரம் நாடாளுமன்ற தொகுதியில் திமுக கூட்டணியில் வேட்பாளராக போட்டியிட்டு 1 லட்சம் வாக்கு வித்தியாசத்தில் வெற்றி பெற்றார்.",
        key: true,
      },
      {
        year: "2013",
        text: "ஆந்திர மாநிலத்தில் விடுதலை சிறுத்தைகள் கட்சி \"விமுக்த சிறுத்தலு\" எனத் தொடங்கப்பட்டது.",
      },
      {
        year: "2016",
        text: "தலைவர் தொல். திருமாவளவன் அவர்களால் விடுதலை சிறுத்தைகள் கட்சியின் அதிகாரபூர்வ தொலைக்காட்சி \"வெளிச்சம் tv\" தொடங்கப்பட்டது.",
      },
      {
        year: "2018",
        text: "எழுச்சி தமிழர் எழுதிய \"அமைப்பாய் திரள்வோம்\" நூல் வெளியிடப்பட்டது.",
      },
      {
        year: "2019",
        text: "நாடாளுமன்ற பொது தேர்தலில் மதசார்பற்ற முற்போக்கு கூட்டணியில் இடம் பெற்று இரண்டு இடங்களில் வெற்றி பெற்றது. எழுச்சி தமிழர் சிதம்பரம் தொகுதியில் வெற்றி பெற்றார்.",
      },
      {
        year: "2020",
        text: "மனுதர்ம சாஸ்திரம் என்னும் சனாதன நூலை தடை செய்ய வலியுறுத்தி தமிழகம் முழுவதும் விசிக ஆர்பாட்டம் நடத்தப்பட்டது.",
      },
      {
        year: "2021",
        text: "தமிழ்நாடு சட்ட பேரவை பொது தேர்தலில் திமுக கூட்டணியில் இடம் பெற்று இரண்டு தனி தொகுதி, இரண்டு பொதுத் தொகுதி உள்ளிட்ட நான்கு தொகுதிகளில் வெற்றி பெற்றது.",
      },
      {
        year: "2024",
        text: "நாடாளுமன்ற பொது தேர்தலில் மதசார்பற்ற முற்போக்கு கூட்டணியில் இடம் பெற்று இரண்டு தொகுதிகளில் விசிக வெற்றி பெற்றது; எழுச்சி தமிழர் சிதம்பரம் தொகுதியில் வெற்றி பெற்றார். இந்திய தேர்தல் ஆணையம் விடுதலை சிறுத்தைகள் கட்சியை தமிழ்நாட்டின் மாநில கட்சியாக அங்கீகரித்து விசிக-விற்கு நிரந்தர சின்னமாக பானை சின்னம் ஒதுக்கப்பட்டது.",
        key: true,
      },
    ],
  },
];

// ─── Pot SVG with draw-on animation ──────────────────────────────────────────

function PotIcon() {
  const controls = useAnimation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.4 });

  useEffect(() => {
    if (inView) {
      controls.start({ strokeDashoffset: 0, transition: { duration: 2, ease: "easeInOut" } });
    }
  }, [inView, controls]);

  // Simple geometric pot: body + neck + rim + base
  const potPath =
    "M80 40 L120 40 L130 55 L140 100 C140 130 110 150 100 155 C90 150 60 130 60 100 L70 55 Z " +
    "M75 40 L125 40 " +
    "M70 160 L130 160";

  const totalLength = 600;

  return (
    <div ref={ref} className="flex justify-center mt-8">
      <motion.svg
        viewBox="0 0 200 180"
        width="120"
        height="120"
        fill="none"
        aria-label="VCK Pot symbol"
        initial={{ strokeDashoffset: totalLength }}
        animate={controls}
      >
        <motion.path
          d={potPath}
          stroke="#C41E1E"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength}
          animate={controls}
        />
      </motion.svg>
    </div>
  );
}

// ─── Single milestone card ────────────────────────────────────────────────────

function MilestoneCard({ milestone, isLast2024 }: { milestone: Milestone; isLast2024?: boolean }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  const isKey = milestone.key === true;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: 40 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative flex gap-6 mb-10"
    >
      {/* Year column */}
      <div className="w-28 shrink-0 text-right">
        <span
          className={`font-black leading-none ${
            isKey ? "text-3xl text-[#C41E1E]" : "text-xl text-[#C41E1E]"
          }`}
        >
          {milestone.year}
        </span>
      </div>

      {/* Connector dot */}
      <div className="relative flex flex-col items-center">
        <div
          className={`mt-1 rounded-full shrink-0 ${
            isKey
              ? "w-4 h-4 bg-[#C41E1E] ring-4 ring-[#C41E1E]/20"
              : "w-3 h-3 bg-[#1B3A6B]"
          }`}
        />
      </div>

      {/* Content */}
      <div className="flex-1 pb-2">
        <div
          className={
            isKey
              ? "bg-white shadow-lg border-l-4 border-[#C41E1E] rounded-lg p-5"
              : "pl-2"
          }
        >
          <p
            className={`text-[#1A1A1A] leading-relaxed ${
              isKey ? "font-semibold text-base" : "text-sm"
            }`}
          >
            {milestone.text}
          </p>
          {isLast2024 && <PotIcon />}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Era banner ───────────────────────────────────────────────────────────────

function EraBanner({ label, bg }: { label: string; bg: string }) {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="w-screen relative left-1/2 -translate-x-1/2 py-5 mb-10"
      style={{ backgroundColor: bg }}
    >
      <p className="text-center text-white font-black text-2xl tracking-widest uppercase">
        {label}
      </p>
    </motion.div>
  );
}

// ─── Main section ─────────────────────────────────────────────────────────────

export default function TimelineSection() {
  return (
    <section className="bg-[#F5F0E8] py-20 overflow-x-hidden">
      <div className="max-w-3xl mx-auto px-6">
        {ERAS.map((era) => (
          <div key={era.label}>
            <EraBanner label={era.label} bg={era.bg} />

            {/* Relative wrapper for the vertical line */}
            <div className="relative">
              {/* Vertical timeline line: sits at the dot column */}
              <div
                className="absolute top-0 bottom-0 w-px bg-[#1B3A6B]/30"
                style={{ left: "calc(7rem + 1.375rem)" }}
                aria-hidden="true"
              />

              {era.milestones.map((m) => (
                <MilestoneCard
                  key={m.year}
                  milestone={m}
                  isLast2024={m.year === "2024"}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

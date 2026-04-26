"use client"

import { useEffect, useRef } from "react"
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion"
import InfiniteMarquee from "./InfiniteMarquee"

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const SLOGANS = [
  "அடங்க மறுப்போம்!",
  "அத்து மீறுவோம்!",
  "திமிறி எழுவோம்!",
  "திருப்பி அடிப்போம்!",
  "அமைப்பாய்த் திரள்வோம்!",
  "அங்கீகாரம் பெறுவோம்!",
  "அதிகாரம் வெல்வோம்!",
  "போராட்டம் தொடர்கிறது!",
]

const DISTRICTS = [
  "சென்னை",
  "கோயம்புத்தூர்",
  "மதுரை",
  "திருச்சி",
  "சேலம்",
  "வேலூர்",
  "தூத்துக்குடி",
  "திருநெல்வேலி",
  "கடலூர்",
  "விழுப்புரம்",
  "நாகப்பட்டினம்",
  "தஞ்சாவூர்",
  "திருவாரூர்",
  "புதுக்கோட்டை",
  "ஈரோடு",
  "நீலகிரி",
]

interface Stat {
  target: number
  suffix: string
  label: string
}

const STATS: Stat[] = [
  { target: 34, suffix: "+", label: "ஆண்டுகள்" },
  { target: 6, suffix: "", label: "தேர்ந்தெடுக்கப்பட்ட உறுப்பினர்கள்" },
  { target: 31, suffix: "", label: "கட்சி அணிகள்" },
]

// ---------------------------------------------------------------------------
// Animated counter — all motion logic preserved exactly
// ---------------------------------------------------------------------------

function Counter({ target, suffix, label }: Stat) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px" })
  const motionVal = useMotionValue(0)
  const display = useTransform(motionVal, (v) => Math.round(v).toString())

  useEffect(() => {
    if (!inView) return
    const controls = animate(motionVal, target, {
      duration: 1.8,
      ease: "easeOut",
    })
    return () => controls.stop()
  }, [inView, motionVal, target])

  return (
    <div
      ref={ref}
      className="bg-white rounded-2xl shadow-sm p-8 flex flex-col items-center gap-2"
    >
      <div className="flex items-end">
        <motion.span
          className="text-6xl font-black text-[#C41E1E] tabular-nums leading-none"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {display}
        </motion.span>
        {suffix && (
          <span
            className="text-6xl font-black text-[#C41E1E] leading-none"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {suffix}
          </span>
        )}
      </div>
      <p className="text-sm text-gray-500 text-center">{label}</p>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

export default function SupportersSection() {
  return (
    <section className="bg-[#F5F0E8] py-24 overflow-hidden" aria-label="Supporters">
      {/* Heading */}
      <div className="text-center px-6 mb-16">
        <span
          className="text-[#C41E1E] text-xs uppercase tracking-widest font-semibold block mb-3 text-center"
          style={{ fontFamily: "var(--font-body)" }}
        >
          இயக்கத்தின் வலிமை
        </span>
        <h2
          className="text-4xl lg:text-5xl font-black text-[#0A1628] mb-4"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          இயக்கத்தின் குரல்கள்
        </h2>
        <p className="text-base text-gray-400">
          தமிழ்நாடு முழுவதும் உள்ள ஆதரவாளர்கள்
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-6 max-w-3xl mx-auto mb-20 px-6">
        {STATS.map((stat) => (
          <Counter key={stat.label} {...stat} />
        ))}
      </div>

      {/* Marquee rows */}
      <div className="flex flex-col">
        {/* Row 1 label */}
        <p
          className="text-center text-xs text-gray-400 uppercase tracking-widest mb-4 px-6"
          style={{ fontFamily: "var(--font-body)" }}
        >
          முழக்கங்கள்
        </p>

        {/* Row 1 — slogans, left direction, speed 35 */}
        <InfiniteMarquee items={SLOGANS} direction="left" speed={35} />

        {/* Row 2 label */}
        <p
          className="text-center text-xs text-gray-400 uppercase tracking-widest mt-6 mb-4 px-6"
          style={{ fontFamily: "var(--font-body)" }}
        >
          மாவட்டங்கள்
        </p>

        {/* Row 2 — districts, right direction, speed 45 */}
        <InfiniteMarquee items={DISTRICTS} direction="right" speed={45} />
      </div>
    </section>
  )
}

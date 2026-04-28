"use client"

import type { MouseEvent } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
import Image from "next/image"
import MagneticButton from "./MagneticButton"

const EASE = [0.16, 1, 0.3, 1] as const

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const item = {
  hidden: { opacity: 0, y: 60 },
  show: {
    opacity: 1,
    y: 0,
    transition: { ease: EASE, duration: 0.9 },
  },
}

const stats: { n: string; label: string }[] = [
  { n: "1990", label: "கட்சி தொடங்கப்பட்டது" },
  { n: "2024", label: "மாநிலக் கட்சி அங்கீகாரம்" },
  { n: "31+", label: "கட்சி அணிகள்" },
]

export default function SpotlightHero() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 })

  const gradientBg = useTransform(
    [springX, springY],
    ([x, y]: number[]) =>
      `radial-gradient(700px circle at ${x}px ${y}px, rgba(196,30,30,0.13), transparent 75%)`
  )

  function handleMouseMove(e: MouseEvent<HTMLElement>) {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }

  return (
    <section
      className="relative flex bg-[#0A1628] overflow-hidden"
      style={{ height: "calc(100vh - 3.5rem)" }}
      onMouseMove={handleMouseMove}
    >
      {/* Grid texture layer */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Spotlight layer */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: gradientBg }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 w-full flex flex-col justify-center py-16">

        {/* Two-col on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-12 items-center">

          {/* LEFT content */}
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="max-w-3xl"
          >
            {/* Label */}
            <motion.div variants={item} className="flex items-center gap-3 mb-8">
              <span className="h-px w-8 bg-[#C41E1E]" />
              <span
                className="text-[#C41E1E] text-xs font-semibold uppercase tracking-[0.25em]"
                style={{ fontFamily: "var(--font-body)" }}
              >
                விடுதலைச் சிறுத்தைகள் கட்சி
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={item}
              className="font-black text-white leading-[0.9] mb-2"
              style={{
                fontSize: "clamp(3.5rem, 9vw, 9rem)",
                fontFamily: "var(--font-heading)",
              }}
            >
              34 ஆண்டுகள்
            </motion.h1>
            <motion.h1
              variants={item}
              className="font-black text-[#C41E1E] leading-[0.9] mb-8"
              style={{
                fontSize: "clamp(3.5rem, 9vw, 9rem)",
                fontFamily: "var(--font-heading)",
              }}
            >
              போராட்டம்.
            </motion.h1>

            {/* Divider */}
            <motion.div variants={item} className="h-px w-16 bg-white/20 mb-8" />

            {/* Sub */}
            <motion.p
              variants={item}
              className="text-white/50 leading-relaxed mb-10 max-w-lg"
              style={{
                fontSize: "clamp(1rem, 2vw, 1.25rem)",
                fontFamily: "var(--font-body)",
              }}
            >
              தெருவிலிருந்து பாராளுமன்றம் வரை — இது ஒரு இயக்கம்.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-wrap gap-4">
              <MagneticButton href="/join" variant="primary">விசிக-வில் இணைய</MagneticButton>
              <MagneticButton href="/donate" variant="secondary">நன்கொடை</MagneticButton>
            </motion.div>
          </motion.div>

          {/* RIGHT — official logo (hidden on mobile) */}
          <div className="hidden lg:flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="relative w-72 h-72"
            >
              {/* Soft glow ring */}
              <div className="absolute inset-0 rounded-full bg-[#C41E1E]/10 blur-2xl scale-110" />
              <Image
                src="/logo.png"
                alt="விடுதலைச் சிறுத்தைகள் கட்சி"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </motion.div>
          </div>

        </div>

        {/* Bottom stats strip */}
        <motion.div
          variants={item}
          initial="hidden"
          animate="show"
          className="absolute bottom-12 left-6 lg:left-12 right-6 flex gap-8 lg:gap-16"
        >
          {stats.map(({ n, label }) => (
            <div key={n} className="flex flex-col gap-1">
              <span
                className="text-white font-black text-xl"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {n}
              </span>
              <span
                className="text-white/30 text-xs"
                style={{ fontFamily: "var(--font-body)" }}
              >
                {label}
              </span>
            </div>
          ))}
        </motion.div>

      </div>

      {/* Scroll chevron */}
      <motion.div
        className="absolute bottom-8 right-8 z-10"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </motion.div>

    </section>
  )
}

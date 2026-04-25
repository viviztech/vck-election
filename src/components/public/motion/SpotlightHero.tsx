"use client"

import type { MouseEvent } from "react"
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"
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

export default function SpotlightHero() {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 })

  const gradientBg = useTransform(
    [springX, springY],
    ([x, y]: number[]) =>
      `radial-gradient(600px circle at ${x}px ${y}px, rgba(196,30,30,0.15), transparent 80%)`
  )

  function handleMouseMove(e: MouseEvent<HTMLElement>) {
    mouseX.set(e.clientX)
    mouseY.set(e.clientY)
  }

  return (
    <section
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#0A1628]"
      onMouseMove={handleMouseMove}
    >
      {/* Spotlight overlay */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: gradientBg }}
      />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center px-6 text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Label */}
        <motion.span
          variants={item}
          className="mb-6 tracking-widest text-xs font-semibold uppercase text-[#C41E1E]"
        >
          விடுதலைச் சிறுத்தைகள் கட்சி
        </motion.span>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="leading-none font-black text-white"
          style={{ fontSize: "clamp(3rem,10vw,9rem)" }}
        >
          34 ஆண்டுகள்
        </motion.h1>
        <motion.h1
          variants={item}
          className="leading-none font-black text-[#C41E1E]"
          style={{ fontSize: "clamp(3rem,10vw,9rem)" }}
        >
          போராட்டம்.
        </motion.h1>

        {/* Sub-heading */}
        <motion.p
          variants={item}
          className="mt-6 text-xl text-white/60"
        >
          தெருவிலிருந்து பாராளுமன்றம் வரை
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <MagneticButton href="/join" variant="primary">
            விசிக-வில் இணைய
          </MagneticButton>
          <MagneticButton href="/donate" variant="secondary">
            நன்கொடை
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="rgba(255,255,255,0.5)"
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

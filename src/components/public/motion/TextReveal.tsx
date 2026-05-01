"use client"

import { useRef } from "react"
import { motion, useInView, useScroll, useTransform } from "framer-motion"

interface TextRevealProps {
  sentences: string[]
  className?: string
}

const ICONS = ["⚖️", "✊", "🌸", "🗣️", "📅"]

export default function TextReveal({ sentences, className }: TextRevealProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const bgX = useTransform(scrollYProgress, [0, 1], ["0%", "-6%"])

  return (
    <section
      ref={sectionRef}
      className={`relative bg-[#0A1628] overflow-hidden py-28 px-6 ${className ?? ""}`}
    >
      {/* Parallax grid lines background */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{ x: bgX }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="rgba(196,30,30,0.07)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </motion.div>

      {/* Red accent bar top-left */}
      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Section label */}
        <div className="flex items-center gap-4 mb-16">
          <div className="h-px flex-1 bg-linear-to-r from-[#C41E1E] to-transparent" />
          <span
            className="text-[#C41E1E] text-xs uppercase tracking-[0.3em] font-semibold"
            style={{ fontFamily: "var(--font-body)" }}
          >
            நம் நோக்கம்
          </span>
          <div className="h-px w-8 bg-[#C41E1E]/30" />
        </div>

        {/* Cards grid */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sentences.map((sentence, i) => (
            <GoalCard key={i} sentence={sentence} index={i} icon={ICONS[i] ?? "★"} />
          ))}
        </div>

        {/* Bottom decoration */}
        <div className="mt-16 flex items-center gap-4">
          <div className="h-px w-8 bg-[#C41E1E]/30" />
          <span
            className="text-white/20 text-xs tracking-widest"
            style={{ fontFamily: "var(--font-body)" }}
          >
            விடுதலை சிறுத்தைகள் கட்சி
          </span>
          <div className="h-px flex-1 bg-linear-to-r from-[#C41E1E]/30 to-transparent" />
        </div>
      </div>
    </section>
  )
}

function GoalCard({
  sentence,
  index,
  icon,
}: {
  sentence: string
  index: number
  icon: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px" })

  // Make last card span full width on md (5 cards: first 4 in 2-col pairs, last centered)
  const isLast = index === 4

  return (
    <motion.div
      ref={ref}
      className={`group relative rounded-2xl border border-white/8 bg-white/3 backdrop-blur-sm
        hover:border-[#C41E1E]/40 hover:bg-white/6 transition-all duration-500 cursor-default
        ${isLast ? "md:col-span-2 lg:col-span-1" : ""}`}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
    >
      {/* Red corner accent */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-0 w-12 h-12 rounded-tl-2xl overflow-hidden pointer-events-none"
      >
        <span className="absolute top-0 left-0 w-full h-full bg-linear-to-br from-[#C41E1E]/30 to-transparent" />
      </span>

      {/* Glow on hover */}
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 30% 40%, rgba(196,30,30,0.08) 0%, transparent 100%)",
        }}
      />

      <div className="relative z-10 p-7 flex flex-col gap-5">
        {/* Index + icon row */}
        <div className="flex items-center justify-between">
          <span
            className="text-[#C41E1E]/50 font-black text-5xl leading-none select-none"
            style={{ fontFamily: "var(--font-heading)" }}
            aria-hidden="true"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="text-2xl" aria-hidden="true">{icon}</span>
        </div>

        {/* Divider */}
        <div className="h-px bg-linear-to-r from-[#C41E1E]/40 via-white/10 to-transparent" />

        {/* Sentence */}
        <p
          className="text-white/80 group-hover:text-white transition-colors duration-300 leading-relaxed text-base"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {sentence}
        </p>
      </div>
    </motion.div>
  )
}

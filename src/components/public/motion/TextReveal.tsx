"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"

interface TextRevealProps {
  sentences: string[]
  className?: string
}

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

export default function TextReveal({ sentences, className }: TextRevealProps) {
  return (
    <section className={`bg-[#F5F0E8] py-32 px-6 ${className ?? ""}`}>
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-0">
        {/* Left col — sticky label */}
        <div className="lg:w-1/3 lg:sticky lg:top-32 lg:self-start flex flex-col items-start pt-6">
          <span
            className="text-[#C41E1E] text-xs uppercase tracking-widest font-semibold mb-4"
            style={{ fontFamily: "var(--font-body)" }}
          >
            நம் நோக்கம்
          </span>
          <span
            className="text-[#1A1A1A] font-black leading-none select-none"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(3.5rem, 8vw, 6rem)",
            }}
          >
            05
          </span>
          <div className="h-16 w-0.5 bg-[#C41E1E] mt-4" />
        </div>

        {/* Right col — sentences */}
        <div className="lg:w-2/3">
          {sentences.map((sentence, i) => (
            <SentenceRow key={i} sentence={sentence} index={i} first={i === 0} />
          ))}
        </div>
      </div>
    </section>
  )
}

function SentenceRow({
  sentence,
  index,
  first,
}: {
  sentence: string
  index: number
  first: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-15% 0px" })

  return (
    <div
      ref={ref}
      className={`overflow-hidden ${first ? "" : "border-b border-[#E8E0D0]"}`}
    >
      <motion.span
        className={`block font-bold text-[#1A1A1A] leading-snug py-6 ${
          first
            ? "text-4xl lg:text-5xl"
            : "text-3xl lg:text-4xl"
        }`}
        style={{ fontFamily: "var(--font-heading)" }}
        initial={{ y: 40, opacity: 0 }}
        animate={inView ? { y: 0, opacity: 1 } : { y: 40, opacity: 0 }}
        transition={{
          duration: 0.85,
          ease: EASE,
          delay: index * 0.08,
          opacity: { duration: 0.4, ease: "linear", delay: index * 0.08 },
        }}
      >
        {sentence}
      </motion.span>
    </div>
  )
}

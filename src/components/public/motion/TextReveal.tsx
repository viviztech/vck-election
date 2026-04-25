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
    <section className={`bg-[#F5F0E8] py-24 px-6 max-w-4xl mx-auto ${className ?? ""}`}>
      {sentences.map((sentence, i) => (
        <SentenceRow key={i} sentence={sentence} index={i} />
      ))}
    </section>
  )
}

function SentenceRow({ sentence, index }: { sentence: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: "-10% 0px" })

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.span
        className="block text-3xl md:text-5xl font-bold leading-tight text-[#1A1A1A]"
        initial={{ y: "100%", opacity: 0 }}
        animate={inView ? { y: "0%", opacity: 1 } : { y: "100%", opacity: 0 }}
        transition={{
          duration: 0.85,
          ease: EASE,
          delay: index * 0.12,
          opacity: { duration: 0.3, ease: "linear", delay: index * 0.12 },
        }}
      >
        {sentence}
      </motion.span>
    </div>
  )
}

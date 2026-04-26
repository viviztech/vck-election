"use client"

import { useRef } from "react"
import { motion, useSpring } from "framer-motion"

interface CandidateCard3DProps {
  name: string
  nameTA: string
  role: string
  constituency: string
  gradient: string
}

const SPRING = { stiffness: 200, damping: 25 }

function PinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-3 h-3 shrink-0"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
    </svg>
  )
}

export default function CandidateCard3D({
  nameTA,
  role,
  constituency,
  gradient,
}: CandidateCard3DProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const rotateX = useSpring(0, SPRING)
  const rotateY = useSpring(0, SPRING)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current
    if (!card) return
    const { left, top, width, height } = card.getBoundingClientRect()
    const mouseX = e.clientX - left
    const mouseY = e.clientY - top
    rotateX.set(((mouseY - height / 2) / height) * -20)
    rotateY.set(((mouseX - width / 2) / width) * 20)
  }

  function handleMouseLeave() {
    rotateX.set(0)
    rotateY.set(0)
  }

  // Initials from first 2 chars of nameTA
  const initials = nameTA.slice(0, 2)

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="w-full aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl cursor-pointer border-t-2 border-[#C41E1E]/60"
    >
      {/* Top 60% — gradient bg with initials avatar */}
      <div className={`relative h-[60%] ${gradient} flex items-center justify-center`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />
        <div
          className="w-20 h-20 rounded-full bg-white/10 backdrop-blur flex items-center justify-center text-white text-2xl font-black select-none z-10"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {initials}
        </div>
      </div>

      {/* Bottom 40% — info */}
      <div className="h-[40%] bg-black/40 backdrop-blur-sm px-5 py-4 flex flex-col justify-center">
        <p
          className="text-white font-bold text-lg leading-tight"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {nameTA}
        </p>
        <p
          className="text-white/60 text-sm mt-0.5"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {role}
        </p>
        <div
          className="flex items-center gap-1 text-[#C41E1E] text-xs font-semibold tracking-wide mt-1"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <PinIcon />
          <span>{constituency}</span>
        </div>
      </div>
    </motion.div>
  )
}

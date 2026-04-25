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

export default function CandidateCard3D({
  name,
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

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="rounded-2xl shadow-2xl cursor-pointer w-full"
    >
      {/* Gradient top */}
      <div className={`relative h-40 rounded-t-2xl ${gradient}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none rounded-t-2xl" />
      </div>

      {/* Content bottom */}
      <div className="bg-white rounded-b-2xl p-5">
        <p className="font-heading text-xl font-bold text-[#0A1628]">{nameTA}</p>
        <p className="text-sm text-gray-400 mt-0.5">{name}</p>
        <span className="inline-block mt-2 bg-[#C41E1E]/10 text-[#C41E1E] text-xs px-3 py-1 rounded-full">
          {role}
        </span>
        <div className="flex items-center gap-1 mt-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-3.5 h-3.5 text-gray-400 shrink-0"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
          </svg>
          <span className="text-sm text-gray-500">{constituency}</span>
        </div>
      </div>
    </motion.div>
  )
}

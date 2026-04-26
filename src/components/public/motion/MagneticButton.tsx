"use client"

import { motion, useSpring } from "framer-motion"
import type { MouseEvent } from "react"
import { useRef, useState } from "react"

type Props = {
  children: React.ReactNode
  href: string
  variant: "primary" | "secondary"
  className?: string
}

export default function MagneticButton({ children, href, variant, className }: Props) {
  const ref = useRef<HTMLAnchorElement>(null)
  const [hovered, setHovered] = useState(false)

  const x = useSpring(0, { stiffness: 200, damping: 20 })
  const y = useSpring(0, { stiffness: 200, damping: 20 })
  const innerX = useSpring(0, { stiffness: 200, damping: 20 })
  const innerY = useSpring(0, { stiffness: 200, damping: 20 })
  const arrowX = useSpring(0, { stiffness: 300, damping: 25 })

  function handleMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    x.set(dx * 0.35)
    y.set(dy * 0.35)
    innerX.set(dx * 0.15)
    innerY.set(dy * 0.15)
  }

  function handleMouseEnter() {
    setHovered(true)
    arrowX.set(6)
  }

  function handleMouseLeave() {
    setHovered(false)
    x.set(0)
    y.set(0)
    innerX.set(0)
    innerY.set(0)
    arrowX.set(0)
  }

  if (variant === "primary") {
    return (
      <motion.a
        ref={ref}
        href={href}
        style={{
          x,
          y,
          boxShadow: hovered
            ? "0 4px 20px rgba(196,30,30,0.35)"
            : "0 4px 20px rgba(196,30,30,0)",
          fontFamily: "var(--font-body)",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`inline-flex items-center gap-2 justify-center rounded-lg font-bold text-base px-8 py-4 bg-[#C41E1E] text-white cursor-pointer transition-[box-shadow] duration-200 ${className ?? ""}`}
      >
        <motion.span style={{ x: innerX, y: innerY }} className="pointer-events-none">
          {children}
        </motion.span>
        <motion.span
          style={{ x: arrowX }}
          className="pointer-events-none inline-block"
          aria-hidden="true"
        >
          →
        </motion.span>
      </motion.a>
    )
  }

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{
        x,
        y,
        fontFamily: "var(--font-body)",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`inline-flex items-center justify-center rounded-lg font-bold text-base px-8 py-4 bg-transparent border-2 text-white cursor-pointer transition-colors duration-200 ${
        hovered ? "border-white/60 bg-white/5" : "border-white/25"
      } ${className ?? ""}`}
    >
      <motion.span style={{ x: innerX, y: innerY }} className="pointer-events-none">
        {children}
      </motion.span>
    </motion.a>
  )
}

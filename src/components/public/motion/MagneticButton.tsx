"use client"

import { motion, useSpring } from "framer-motion"
import type { MouseEvent } from "react"
import { useRef } from "react"

type Props = {
  children: React.ReactNode
  href: string
  variant: "primary" | "secondary"
  className?: string
}

export default function MagneticButton({ children, href, variant, className }: Props) {
  const ref = useRef<HTMLAnchorElement>(null)

  const x = useSpring(0, { stiffness: 200, damping: 20 })
  const y = useSpring(0, { stiffness: 200, damping: 20 })
  const innerX = useSpring(0, { stiffness: 200, damping: 20 })
  const innerY = useSpring(0, { stiffness: 200, damping: 20 })

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

  function handleMouseLeave() {
    x.set(0)
    y.set(0)
    innerX.set(0)
    innerY.set(0)
  }

  const base =
    "inline-flex items-center justify-center rounded-full font-bold text-lg px-8 py-4 transition-colors duration-200 cursor-pointer"
  const styles =
    variant === "primary"
      ? "bg-[#C41E1E] text-white"
      : "border-2 border-white text-white hover:bg-white hover:text-[#0A1628]"

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`${base} ${styles} ${className ?? ""}`}
    >
      <motion.span style={{ x: innerX, y: innerY }} className="pointer-events-none">
        {children}
      </motion.span>
    </motion.a>
  )
}

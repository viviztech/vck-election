"use client"

import { useState } from "react"

interface InfiniteMarqueeProps {
  items?: string[]
  speed?: number
  direction?: "left" | "right"
}

const DEFAULT_ITEMS = [
  "சாதி ஒழிப்பு",
  "சமூக நீதி",
  "பெண் விடுதலை",
  "தமிழ்த் தேசியம்",
  "மதச்சார்பின்மை",
  "தொழிலாளர் உரிமை",
  "நில உரிமை",
  "சனநாயகம்",
  "அம்பேத்கர் தத்துவம்",
  "பெரியார் கொள்கை",
]

export default function InfiniteMarquee({
  items = DEFAULT_ITEMS,
  speed = 40,
  direction = "left",
}: InfiniteMarqueeProps) {
  const [paused, setPaused] = useState(false)

  const animationStyle: React.CSSProperties = {
    animation: `marquee ${speed}s linear infinite`,
    animationDirection: direction === "right" ? "reverse" : "normal",
    animationPlayState: paused ? "paused" : "running",
  }

  const doubled = [...items, ...items]

  return (
    <div className="overflow-hidden">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>
      <div
        className="flex w-fit"
        style={animationStyle}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {doubled.map((item, i) => (
          <span
            key={i}
            className="bg-[#1B3A6B] text-white px-6 py-3 rounded-full text-sm font-medium mx-3 whitespace-nowrap"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

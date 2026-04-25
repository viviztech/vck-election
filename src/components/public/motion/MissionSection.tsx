"use client"

import { useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface MissionPanel {
  number: string
  heading: string
  body: string
}

const PANELS: MissionPanel[] = [
  {
    number: "01",
    heading: "சாதி ஒழிப்பு",
    body: "இந்து வர்ணாசிரம சாதிய அடுக்கு முறையை வேரறுத்து, அனைவருக்கும் சம உரிமை உறுதி செய்வதே நம் முதல் கடமை.",
  },
  {
    number: "02",
    heading: "சமூக நீதி",
    body: "தலித்துகள், பழங்குடியினர், பிற்படுத்தப்பட்டோர் மற்றும் சிறுபான்மையினர் — அனைவரும் இந்த நாட்டின் சம உரிமையாளர்கள்.",
  },
  {
    number: "03",
    heading: "பெண் விடுதலை",
    body: "கல்வி, பொருளாதார சுதந்திரம், சமூக மரியாதை — பெண்களுக்கான முழுமையான விடுதலை நம் இயக்கத்தின் அடிப்படை.",
  },
  {
    number: "04",
    heading: "தமிழ்த் தேசியம்",
    body: "தமிழ் மொழி, பண்பாடு, நாகரிகம் — நம் அடையாளத்தை பாதுகாத்து, சாதியற்ற தமிழ் சமூகத்தை கட்டமைப்போம்.",
  },
]

export default function MissionSection() {
  const outerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (typeof window === "undefined") return
      if (!outerRef.current || !innerRef.current) return

      const inner = innerRef.current

      gsap.to(inner, {
        x: () => -(inner.scrollWidth - window.innerWidth),
        ease: "none",
        scrollTrigger: {
          trigger: outerRef.current,
          pin: true,
          scrub: 1,
          end: "+=3000",
          invalidateOnRefresh: true,
        },
      })

      return () => {
        ScrollTrigger.getAll().forEach((st) => st.kill())
      }
    },
    { scope: outerRef },
  )

  return (
    <section
      ref={outerRef}
      className="bg-[#0A1628] text-white overflow-hidden"
      aria-label="Our Mission"
    >
      {/* horizontal strip */}
      <div
        ref={innerRef}
        className="flex will-change-transform"
        style={{ width: `${PANELS.length * 100}vw` }}
      >
        {PANELS.map((panel) => (
          <div
            key={panel.number}
            className="relative flex items-center justify-center p-16"
            style={{ width: "100vw", flexShrink: 0, minHeight: "100vh" }}
          >
            {/* Faded panel number — absolutely positioned top-right */}
            <span
              aria-hidden="true"
              className="absolute top-8 right-10 text-[#C41E1E] font-black select-none pointer-events-none"
              style={{ fontSize: "clamp(6rem, 18vw, 18rem)", opacity: 0.15, lineHeight: 1 }}
            >
              {panel.number}
            </span>

            {/* Content */}
            <div className="relative z-10 max-w-2xl">
              <p
                className="text-[#C41E1E] text-sm font-bold tracking-[0.3em] uppercase mb-6"
              >
                {panel.number}
              </p>
              <h2 className="text-5xl md:text-7xl font-black mb-8 leading-tight">
                {panel.heading}
              </h2>
              <p className="text-lg md:text-xl text-white/70 leading-relaxed max-w-prose">
                {panel.body}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

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
            className="relative flex items-center bg-[#0A1628]"
            style={{ width: "100vw", flexShrink: 0, minHeight: "100vh" }}
          >
            {/* Massive faded panel number — absolutely behind content */}
            <span
              aria-hidden="true"
              className="absolute top-1/2 left-6 -translate-y-1/2 text-[#C41E1E] font-black select-none pointer-events-none z-0"
              style={{
                fontSize: "clamp(8rem, 20vw, 22rem)",
                opacity: 0.2,
                lineHeight: 1,
              }}
            >
              {panel.number}
            </span>

            {/* Inner grid */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* LEFT: content */}
              <div>
                <p
                  className="text-white/30 text-sm tracking-widest mb-4"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {panel.number} / 04
                </p>
                <h2
                  className="text-4xl lg:text-6xl font-black text-white leading-tight mb-6"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {panel.heading}
                </h2>
                <p
                  className="text-lg text-white/60 leading-relaxed max-w-prose"
                  style={{ fontFamily: "var(--font-body)" }}
                >
                  {panel.body}
                </p>
                <div className="w-12 h-1 bg-[#C41E1E] mt-8" />
              </div>

              {/* RIGHT: decorative circle (lg only) */}
              <div className="hidden lg:flex items-center justify-center">
                <div className="relative flex items-center justify-center w-72 h-72 rounded-full border-2 border-dashed border-white/10">
                  {/* Inner ring */}
                  <div className="absolute w-52 h-52 rounded-full border border-white/5" />
                  <span
                    aria-hidden="true"
                    className="text-[#C41E1E] font-black select-none"
                    style={{
                      fontFamily: "var(--font-heading)",
                      fontSize: "clamp(4rem, 8vw, 7rem)",
                      opacity: 0.3,
                      lineHeight: 1,
                    }}
                  >
                    {panel.number}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

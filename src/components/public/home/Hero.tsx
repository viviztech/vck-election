"use client";

import { motion } from "framer-motion";
import Link from "next/link";

function PantherSilhouette() {
  return (
    <svg
      viewBox="0 0 400 300"
      className="absolute inset-0 w-full h-full opacity-10"
      aria-hidden="true"
    >
      <path
        d="M200 60 C160 60 120 80 100 120 C80 160 85 200 100 230
           C110 250 130 265 150 270 L145 290 L165 285 L170 270
           C185 275 200 275 215 270 L220 285 L240 290 L235 270
           C255 265 275 250 285 230 C300 200 305 160 285 120
           C265 80 240 60 200 60 Z
           M160 130 C155 125 148 125 145 130 C142 135 145 142 150 140
           M240 130 C245 125 252 125 255 130 C258 135 255 142 250 140
           M185 160 C190 168 210 168 215 160
           M200 60 L185 30 L175 10 L180 5 L195 25 L200 15 L205 25 L220 5 L225 10 L215 30 Z"
        fill="white"
        fillRule="evenodd"
      />
    </svg>
  );
}

export default function Hero() {
  return (
    <section className="relative flex items-center justify-center min-h-svh bg-[#0A1628] overflow-hidden">
      <PantherSilhouette />
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl text-white leading-tight mb-4">
            34 ஆண்டுகள். தெருவிலிருந்து பாராளுமன்றம் வரை.
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/history"
              className="px-8 py-3 border-2 border-[#F5F0E8] text-[#F5F0E8] rounded font-semibold hover:bg-[#F5F0E8] hover:text-[#0A1628] transition-colors"
            >
              நம் பயணத்தை அறியுங்கள்
            </Link>
            <Link
              href="/join"
              className="px-8 py-3 bg-[#C41E1E] text-white rounded font-semibold hover:bg-[#a31919] transition-colors"
            >
              விசியில் இணையுங்கள்
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

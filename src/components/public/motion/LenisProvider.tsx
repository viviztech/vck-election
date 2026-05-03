"use client"

import Lenis from "lenis"
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"

type LenisContextValue = {
  lenis: Lenis | null
}

export const LenisContext = createContext<LenisContextValue>({ lenis: null })

export function useLenis(): Lenis | null {
  return useContext(LenisContext).lenis
}

export default function LenisProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const instance = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      smoothWheel: true,
      // Always use the window as scroll root — avoids conflicts with
      // fixed-height containers and dynamically loaded content
      wrapper: window,
      content: document.documentElement,
    })

    setLenis(instance)

    function raf(time: number) {
      instance.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }

    rafRef.current = requestAnimationFrame(raf)

    // Recalculate scroll dimensions when DOM changes (dynamic content loads)
    const ro = new ResizeObserver(() => instance.resize())
    ro.observe(document.body)

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
      ro.disconnect()
      instance.destroy()
    }
  }, [])

  return (
    <LenisContext.Provider value={{ lenis }}>
      {children}
    </LenisContext.Provider>
  )
}

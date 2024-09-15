"use client"

import { Map } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { ModeToggle } from "~/components/mode-toggle"
import { ViewSwitch } from "~/components/view-switch"
import { useIsClient } from "~/hooks/useClient"

export function MobileBar() {
  const isClient = useIsClient()
  const [scrollPosition, setScrollPosition] = useState(0)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const diff = currentScrollY - lastScrollY.current
      setScrollPosition((prev) => {
        const newPosition = Math.max(Math.min(prev + diff, 64), 0)
        return newPosition
      })
      lastScrollY.current = currentScrollY
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <div
      className="z-999] fixed left-1/2 h-16 -translate-x-1/2 transform transition-all duration-150 ease-out md:hidden"
      style={{
        bottom: `${-scrollPosition}px`,
        opacity: 1 - scrollPosition / 64,
      }}
    >
      <div className="flex items-center gap-4 rounded-l-full rounded-r-full bg-gray-100/60 px-6 py-3 backdrop-blur-sm transition-all duration-300 dark:bg-[rgba(36,36,36)]/60">
        <ViewSwitch />
        <Link href="/map">
          <Map
            className="cursor-pointer"
            size={22}
            strokeWidth={2.25}
            absoluteStrokeWidth
          />
        </Link>
        <ModeToggle />
      </div>
    </div>
  )
}

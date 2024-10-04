"use client"

import clsx from "clsx"
import { Map } from "lucide-react"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { LanguageSwitch } from "~/components/language-toggle"
import { ThemeToggle } from "~/components/theme-toggle"
import { ViewSwitch } from "~/components/view-toggle"
import { useIsClient } from "~/hooks/useClient"
import { useScroll } from "~/hooks/useScroll"

export function Tools() {
  const isClient = useIsClient()
  const isScrolled = useScroll(48)
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
    return (
      <div className="hidden h-[46px] w-[260px] rounded-full bg-gray-100/60 dark:bg-[rgba(36,36,36,0.6)]/60 md:block" />
    )
  }

  return (
    <>
      <div
        className={clsx(
          "z-[49] hidden h-16 items-center md:flex",
          isScrolled && "fixed top-0 md:right-12 xl:right-48",
        )}
      >
        <div className="flex items-center gap-4 rounded-full bg-gray-100/60 px-6 py-3 backdrop-blur-md transition-all duration-300 dark:bg-[rgba(36,36,36,0.6)]/60">
          <ViewSwitch />
          <Link href="/map">
            <Map
              className="cursor-pointer"
              size={22}
              strokeWidth={2.25}
              absoluteStrokeWidth
            />
          </Link>
          <LanguageSwitch />
          <ThemeToggle />
        </div>
      </div>

      <div
        className="fixed left-1/2 z-[49] h-16 -translate-x-1/2 transform transition-all duration-150 ease-out md:hidden"
        style={{
          bottom: `${-scrollPosition}px`,
          opacity: 1 - scrollPosition / 64,
        }}
      >
        <div className="flex items-center gap-4 rounded-full bg-white/20 px-6 py-3 shadow-lg backdrop-blur-md transition-all duration-300 dark:bg-black/20">
          <ViewSwitch />
          <Link href="/map">
            <Map
              className="cursor-pointer"
              size={22}
              strokeWidth={2.25}
              absoluteStrokeWidth
            />
          </Link>
          <LanguageSwitch />
          <ThemeToggle />
        </div>
      </div>
    </>
  )
}

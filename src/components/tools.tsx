"use client"

import clsx from "clsx"
import { Map } from "lucide-react"
import Link from "next/link"
import { LanguageSwitch } from "~/components/language-switch"
import { ModeToggle } from "~/components/mode-toggle"
import { ViewSwitch } from "~/components/view-switch"
import { useIsClient } from "~/hooks/useClient"
import { useScroll } from "~/hooks/useScroll"

export function Tools() {
  const isClient = useIsClient()
  const isScrolled = useScroll(48)

  if (!isClient) {
    return (
      <div className="hidden h-[46px] w-[260px] rounded-l-full rounded-r-full bg-gray-100/60 dark:bg-[rgba(36,36,36,0.6)]/60 md:block" />
    )
  }

  return (
    <div
      className={clsx(
        "z-[999] hidden h-16 items-center md:flex",
        isScrolled && "fixed top-0 md:right-12 xl:right-48",
      )}
    >
      <div className="flex items-center gap-4 rounded-l-full rounded-r-full bg-gray-100/60 px-6 py-3 backdrop-blur-sm transition-all duration-300 dark:bg-[rgba(36,36,36,0.6)]/60">
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
        <ModeToggle />
      </div>
    </div>
  )
}

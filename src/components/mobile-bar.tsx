"use client"

import { Map } from "lucide-react"
import Link from "next/link"
import { ModeToggle } from "~/components/mode-toggle"
import { ViewSwitch } from "~/components/view-switch"
import { useIsClient } from "~/hooks/useClient"

export function MobileBar() {
  const isClient = useIsClient()

  if (!isClient) {
    return (
      <div className="h-[46px] w-[260px] rounded-l-full rounded-r-full bg-gray-100/60 dark:bg-[rgba(36,36,36)]/60 md:hidden" />
    )
  }

  return (
    <div className="fixed bottom-2 left-1/2 z-10 h-16 -translate-x-1/2 transform md:hidden">
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

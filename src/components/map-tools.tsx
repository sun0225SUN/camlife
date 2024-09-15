"use client"

import { GalleryVertical } from "lucide-react"
import Link from "next/link"
import { LanguageSwitch } from "~/components/language-switch"
import { ModeToggle } from "~/components/mode-toggle"
import { useIsClient } from "~/hooks/useClient"

export function MapTools() {
  const isClient = useIsClient()

  if (!isClient) {
    return null
  }

  return (
    <>
      <div className="fixed right-12 top-0 z-[99] mt-10 hidden w-auto md:block xl:right-10">
        <div className="flex items-center gap-4 rounded-full bg-white/20 px-6 py-3 shadow-lg backdrop-blur-md transition-all duration-300 dark:bg-black/20">
          <Link href="/">
            <GalleryVertical
              className="cursor-pointer"
              size={20}
              strokeWidth={2.25}
              absoluteStrokeWidth
            />
          </Link>
          <LanguageSwitch />
          <ModeToggle />
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 z-[99] h-16 w-auto -translate-x-1/2 transform md:hidden">
        <div className="flex items-center justify-center gap-4 rounded-full bg-white/20 px-6 py-3 shadow-lg backdrop-blur-md transition-all duration-300 dark:bg-black/20">
          <Link href="/">
            <GalleryVertical
              className="cursor-pointer"
              size={20}
              strokeWidth={2.25}
              absoluteStrokeWidth
            />
          </Link>
          <LanguageSwitch />
          <ModeToggle />
        </div>
      </div>
    </>
  )
}
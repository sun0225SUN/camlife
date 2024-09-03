"use client"

import { LanguageSwitch } from "~/components/language-switch"
import { ModeToggle } from "~/components/mode-toggle"
import { ViewSwitch } from "~/components/view-switch"
import { useIsClient } from "~/hooks/useClient"

export function Tools() {
  const isClient = useIsClient()

  if (!isClient) {
    return (
      <div className="hidden h-[46px] w-[222px] rounded-l-full rounded-r-full bg-gray-100/60 dark:bg-[rgba(36,36,36,0.6)]/60 md:block" />
    )
  }

  return (
    <div className="hidden items-center justify-center gap-4 rounded-l-full rounded-r-full bg-gray-100/60 px-6 py-3 backdrop-blur-sm dark:bg-[rgba(36,36,36,0.6)]/60 md:flex">
      <ViewSwitch />
      <LanguageSwitch />
      <ModeToggle />
    </div>
  )
}

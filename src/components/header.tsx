"use client"

import { LanguageSwitch } from "~/components/language-switch"
import { ModeToggle } from "~/components/mode-toggle"
import { SiteLogo } from "~/components/site-logo"

export function Header() {
  return (
    <div className="my-8 flex h-16 w-full items-center justify-center px-5 md:mt-12 md:justify-between md:px-32">
      <SiteLogo />
      <div className="hidden items-center justify-center gap-6 md:flex">
        <LanguageSwitch />
        <ModeToggle />
      </div>
    </div>
  )
}

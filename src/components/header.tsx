"use client"

import { SiteLogo } from "~/components/site-logo"
import { Tools } from "~/components/tools"

export function Header() {
  return (
    <div className="mt-12 flex w-full items-center justify-center md:justify-between md:px-12 xl:px-48">
      <SiteLogo />
      <Tools />
    </div>
  )
}

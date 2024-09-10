"use client"

import { SiteLogo } from "~/components/site-logo"
import { Tools } from "~/components/tools"

export function Header() {
  return (
    <div className="mb-4 mt-12 flex w-full items-center justify-center md:justify-between md:px-32">
      <SiteLogo />
      <Tools />
    </div>
  )
}

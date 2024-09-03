"use client"

import { useEffect, useState } from "react"
import { SiteLogo } from "~/components/site-logo"
import { Tools } from "~/components/tools"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 48)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className={`sticky top-0 z-50 my-8 flex h-16 w-full items-center justify-center bg-white px-5 dark:bg-black md:mt-12 md:justify-between md:px-32 ${
        isScrolled
          ? "shadow-md transition-all duration-500 ease-in-out dark:shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1)]"
          : "shadow-none"
      }`}
    >
      <SiteLogo />
      <Tools />
    </div>
  )
}

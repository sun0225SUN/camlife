"use client"

import { Expand } from "@theme-toggles/react"
import "@theme-toggles/react/css/Expand.css"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function ModeToggle() {
  const t = useTranslations("Theme")

  const { setTheme, resolvedTheme } = useTheme()

  const [mounted, setMounted] = useState(false)

  // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#avoid-hydration-mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="size-6" />
  }

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light"

    if (!document.startViewTransition) {
      setTheme(newTheme)
    } else {
      // eslint-disable-next-line
      document.startViewTransition(() => setTheme(newTheme))
    }
  }

  return (
    // eslint-disable-next-line
    // @ts-ignore
    <Expand
      title={t("tip")}
      className="size-6 text-2xl"
      duration={800}
      toggled={resolvedTheme === "dark"}
      toggle={() => {
        toggleTheme()
      }}
    />
  )
}

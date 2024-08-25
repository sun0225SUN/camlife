"use client"

import { Expand } from "@theme-toggles/react"
import "@theme-toggles/react/css/Expand.css"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"
import { useIsClient } from "~/hooks/useClient"

export function ModeToggle() {
  const t = useTranslations("Theme")

  const { setTheme, resolvedTheme } = useTheme()

  const isClient = useIsClient()

  if (!isClient) {
    return <div className="size-6" />
  }

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light"

    if (!document.startViewTransition) {
      setTheme(newTheme)
    } else {
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
      toggle={toggleTheme}
    />
  )
}

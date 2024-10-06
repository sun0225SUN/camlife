"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    const newTheme = resolvedTheme === "light" ? "dark" : "light"

    if (!document.startViewTransition) {
      setTheme(newTheme)
    } else {
      document.startViewTransition(() => setTheme(newTheme))
    }
  }

  return (
    <button onClick={toggleTheme}>
      <Sun
        className="dark:hidden"
        size={22}
        strokeWidth={2.25}
        absoluteStrokeWidth
      />
      <Moon
        className="hidden dark:block"
        size={22}
        strokeWidth={2.25}
        absoluteStrokeWidth
      />
    </button>
  )
}

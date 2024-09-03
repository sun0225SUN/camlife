"use client"

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ModeToggle() {
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
      {resolvedTheme === "light" ? (
        <Sun
          className="cursor-pointer"
          size={22}
          strokeWidth={2.25}
          absoluteStrokeWidth
        />
      ) : (
        <Moon
          className="cursor-pointer"
          size={22}
          strokeWidth={2.25}
          absoluteStrokeWidth
        />
      )}
    </button>
  )
}

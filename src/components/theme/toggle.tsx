'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'

interface ThemeToggleProps {
  className?: string
  size?: number
  strokeWidth?: number
}

export function ThemeToggle({ strokeWidth = 2, className }: ThemeToggleProps) {
  const { setTheme, resolvedTheme } = useTheme()

  const toggleTheme = () => {
    const newTheme = resolvedTheme === 'light' ? 'dark' : 'light'

    if (!document.startViewTransition) {
      setTheme(newTheme)
    } else {
      document.startViewTransition(() => setTheme(newTheme))
    }
  }

  return (
    <button
      type='button'
      onClick={toggleTheme}
      className={cn('cursor-pointer', className)}
      aria-label='Toggle theme'
    >
      <Sun
        className={cn('size-6 dark:hidden', className)}
        strokeWidth={strokeWidth}
        absoluteStrokeWidth
      />
      <Moon
        className={cn('hidden size-6 dark:block', className)}
        strokeWidth={strokeWidth}
        absoluteStrokeWidth
      />
    </button>
  )
}

'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import '@/styles/view-transition.css'

interface ThemeToggleProps {
  className?: string
  size?: number
  strokeWidth?: number
}

export function ThemeToggle({
  size = 20,
  strokeWidth = 2,
  className,
}: ThemeToggleProps) {
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
      className={cn(className, 'cursor-pointer')}
      aria-label='Toggle theme'
    >
      <Sun
        className='dark:hidden'
        size={size}
        strokeWidth={strokeWidth}
        absoluteStrokeWidth
      />
      <Moon
        className='hidden dark:block'
        size={size}
        strokeWidth={strokeWidth}
        absoluteStrokeWidth
      />
    </button>
  )
}

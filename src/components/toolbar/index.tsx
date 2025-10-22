'use client'

import { Github, Hammer, Map as MapIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { LanguageToggle } from '@/components/language/toggle'
import { ThemeToggle } from '@/components/theme/toggle'
import { ViewSwitch } from '@/components/toolbar/view-switch'
import { GITHUB_REPOSITORY_URL } from '@/constants'
import { useIsClient } from '@/hooks/use-client'
import { useIsMobile } from '@/hooks/use-mobile'
import { useScroll } from '@/hooks/use-scroll'
import { cn } from '@/lib/utils'
import { EXPLORE_MAP_PAGE, TOOLS_PAGE } from '@/routes'

export function ToolBar() {
  const isClient = useIsClient()
  const isScrolled = useScroll(48)
  const isMobile = useIsMobile()

  if (!isClient) {
    return (
      <div className='hidden h-[48px] w-[328px] rounded-full bg-gray-100/60 md:block dark:bg-[rgba(36,36,36,0.6)]/60' />
    )
  }

  if (isMobile) {
    return <ToolsBarMobile />
  }

  return (
    <div
      className={cn(
        'z-20 hidden h-16 items-center md:flex',
        isScrolled && 'fixed top-0 md:right-12 xl:right-48',
      )}
    >
      <div
        className={cn(
          'flex items-center gap-5 px-6 py-3',
          'rounded-full bg-gray-100/60 backdrop-blur-md transition-all duration-300 dark:bg-[rgba(36,36,36,0.6)]/60',
        )}
      >
        <ViewSwitch />

        <Link href={EXPLORE_MAP_PAGE}>
          <MapIcon
            className='size-6 cursor-pointer transition-all duration-300 hover:scale-105'
            strokeWidth={2.25}
            absoluteStrokeWidth
          />
        </Link>

        <Link href={GITHUB_REPOSITORY_URL}>
          <Github
            className='size-6 cursor-pointer transition-all duration-300 hover:scale-105'
            strokeWidth={2.25}
            absoluteStrokeWidth
          />
        </Link>

        <Link href={TOOLS_PAGE}>
          <Hammer
            className='size-6 cursor-pointer transition-all duration-300 hover:scale-105'
            strokeWidth={2.25}
            absoluteStrokeWidth
          />
        </Link>

        <LanguageToggle className='size-6 transition-all duration-300 hover:scale-105' />

        <ThemeToggle className='size-6 transition-all duration-300 hover:scale-105' />
      </div>
    </div>
  )
}

function ToolsBarMobile() {
  const lastScrollY = useRef<number>(0)

  const [scrollPosition, setScrollPosition] = useState<number>(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const diff = currentScrollY - lastScrollY.current
      setScrollPosition((prev) => Math.max(Math.min(prev + diff, 64), 0))
      lastScrollY.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div
      className='-translate-x-1/2 fixed left-1/2 z-[49] h-16 transform transition-all duration-150 ease-out md:hidden'
      style={{
        bottom: `${-scrollPosition}px`,
        opacity: 1 - scrollPosition / 64,
      }}
    >
      <div className='flex items-center gap-4 rounded-full bg-white/20 px-6 py-3 shadow-lg backdrop-blur-md transition-all duration-300 dark:bg-black/20'>
        <ViewSwitch />

        <Link href={EXPLORE_MAP_PAGE}>
          <MapIcon
            className='size-6'
            strokeWidth={2.25}
            absoluteStrokeWidth
          />
        </Link>

        <LanguageToggle className='size-6' />

        <ThemeToggle className='size-6' />
      </div>
    </div>
  )
}

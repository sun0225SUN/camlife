'use client'

import { useLocale, useTranslations } from 'next-intl'
import { fontTabsEN, fontTabsZH } from '@/fonts'
import { useScroll } from '@/hooks/use-scroll'
import { usePathname, useRouter } from '@/i18n/navigation'
import { cn } from '@/lib/utils'
import type { TabConfig } from '@/types'

export function ViewTabs() {
  const t = useTranslations('View')

  const pathname = usePathname()

  const router = useRouter()

  const locale = useLocale()

  const isScrolled = useScroll(132)

  const tabsConfig: TabConfig[] = [
    {
      path: '/',
      label: t('essential'),
    },
    {
      path: '/recent',
      label: t('recent'),
    },
    {
      path: '/shuffle',
      label: t('shuffle'),
    },
    {
      path: '/nearby',
      label: t('nearby'),
    },
    {
      path: '/faraway',
      label: t('faraway'),
    },
  ]

  return (
    <div
      className={cn([
        locale === 'zh' && `${fontTabsZH.className} text-lg md:text-[23px]`,
        locale === 'en' && `${fontTabsEN.className} text-base md:text-[23px]`,
        isScrolled && [
          'sticky top-0 h-16 bg-opacity-60 shadow-md backdrop-blur-md',
          'transition-all duration-500 ease-in-out',
          'dark:bg-opacity-60 dark:shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1)]',
        ],
        'z-10 my-5 flex h-16 w-full items-center justify-between px-6 md:justify-start md:gap-5 md:px-12 md:text-2xl xl:px-48',
      ])}
    >
      {tabsConfig.map((item) => (
        <button
          type='button'
          key={item.path}
          tabIndex={0}
          onClick={() => router.push(item.path)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              router.push(item.path)
            }
          }}
          className={cn(
            pathname !== item.path && 'opacity-30 hover:opacity-80',
            'cursor-pointer transition-all duration-300 hover:scale-105',
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

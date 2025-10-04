'use client'

import { ChevronRight, Info, Settings, Shield, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface SettingsSidebarProps {
  activeSection?: string
  onSectionChange?: (section: string) => void
}

const settingsSections = [
  {
    id: 'general',
    icon: Settings,
    label: 'general',
  },
  {
    id: 'account',
    icon: User,
    label: 'account',
  },
  {
    id: 'security',
    icon: Shield,
    label: 'security',
  },
  {
    id: 'about',
    icon: Info,
    label: 'about',
  },
]

export function SettingsSidebar({
  activeSection = 'general',
  onSectionChange,
}: SettingsSidebarProps) {
  const t = useTranslations('settings')

  return (
    <div className='flex h-full w-64 flex-col border-border border-r bg-background pt-4'>
      <nav className='space-y-1 px-4 pb-4'>
        {settingsSections.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.id

          return (
            <button
              key={section.id}
              type='button'
              onClick={() => onSectionChange?.(section.id)}
              className={cn(
                'flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 text-sm transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                isActive && 'bg-accent text-accent-foreground',
              )}
            >
              <div className='flex items-center gap-3'>
                <Icon className='h-4 w-4' />
                <span>{t(section.label)}</span>
              </div>
              {isActive && <ChevronRight className='h-4 w-4' />}
            </button>
          )
        })}
      </nav>
    </div>
  )
}

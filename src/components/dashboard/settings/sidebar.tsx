'use client'

import { ChevronRight, Info, Search, Settings, User } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface SettingsSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
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
    id: 'about',
    icon: Info,
    label: 'about',
  },
]

export function SettingsSidebar({
  activeSection,
  onSectionChange,
}: SettingsSidebarProps) {
  const t = useTranslations('Settings')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSections = settingsSections.filter((section) =>
    t(section.label).toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className='flex h-full w-64 flex-col border-border border-r bg-background'>
      <div className='p-4'>
        <div className='relative'>
          <Search className='-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground' />
          <input
            type='text'
            placeholder={t('searchSettings')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2'
          />
        </div>
      </div>

      <nav className='flex-1 space-y-1 px-4 pb-4'>
        {filteredSections.map((section) => {
          const Icon = section.icon
          const isActive = activeSection === section.id

          return (
            <button
              key={section.id}
              type='button'
              onClick={() => onSectionChange(section.id)}
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

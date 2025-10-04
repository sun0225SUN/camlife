'use client'

import { useTranslations } from 'next-intl'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { SettingsContent } from '@/components/dashboard/settings/content'
import { SettingsSidebar } from '@/components/dashboard/settings/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { listSessions, useSession } from '@/lib/auth/client'
import { cn } from '@/lib/utils'

interface Session {
  id: string
  token: string
  userAgent?: string | null
  ipAddress?: string | null
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
}

export default function SettingsPage() {
  const t = useTranslations('dashboard')
  const [activeSection, setActiveSection] = useState('general')
  const [activeSessions, setActiveSessions] = useState<Session[]>([])
  const { data: session } = useSession()
  const { state, isMobile } = useSidebar()

  const leftMargin = useMemo(() => {
    if (isMobile) return '0'
    if (state === 'expanded') return '16rem'
    if (state === 'collapsed') return '3rem'
    return '0'
  }, [state, isMobile])

  const fetchActiveSessions = useCallback(async () => {
    try {
      console.log('Fetching active sessions...')
      const { data: sessions, error } = await listSessions()
      console.log('Sessions response:', { sessions, error })
      if (sessions) {
        setActiveSessions(sessions)
      }
    } catch (error) {
      console.error('Failed to fetch active sessions:', error)
    }
  }, [])

  useEffect(() => {
    fetchActiveSessions()
  }, [fetchActiveSessions])

  return (
    <>
      <header
        className={cn(
          'flex items-center gap-2',
          'fixed top-0 right-0 z-50 h-20',
          'border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        )}
        style={{
          left: leftMargin,
          transition: 'left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className='flex items-center gap-2 px-6'>
          <SidebarTrigger className='-ml-1 cursor-pointer' />
          <Separator
            orientation='vertical'
            className='mr-2 data-[orientation=vertical]:h-4'
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className='font-semibold text-lg'>
                  {t('settings')}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className='flex h-full pt-20'>
        <SettingsSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <SettingsContent
          activeSection={activeSection}
          session={session}
          activeSessions={activeSessions}
          onSessionsUpdate={fetchActiveSessions}
        />
      </div>
    </>
  )
}

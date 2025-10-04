'use client'

import { useTranslations } from 'next-intl'
import { SecurityAccessCard } from '@/components/dashboard/settings/security-access-card'

interface Session {
  id: string
  token: string
  userAgent?: string | null
  ipAddress?: string | null
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
}

interface SessionManagementProps {
  session?: {
    id: string
    createdAt: Date
    updatedAt: Date
    expiresAt: Date
    token: string
    ipAddress?: string | null
    userAgent?: string | null
  } | null
  activeSessions?: Session[]
}

export function SessionManagement({
  session,
  activeSessions = [],
}: SessionManagementProps) {
  const t = useTranslations('settings')

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='font-semibold text-2xl tracking-tight'>
          {t('security')}
        </h2>
        <p className='text-muted-foreground'>
          {t('active-sessions-description')}
        </p>
      </div>

      <SecurityAccessCard
        session={session as Session | null}
        activeSessions={activeSessions}
      />
    </div>
  )
}

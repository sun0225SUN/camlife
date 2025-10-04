'use client'

import { useTranslations } from 'next-intl'
import { PasswordUpdate } from '@/components/dashboard/settings/password-update'
import { ProfileUpdate } from '@/components/dashboard/settings/profile-update'
import { SessionManagement } from '@/components/dashboard/settings/session-management'

interface Session {
  id: string
  token: string
  userAgent?: string | null
  ipAddress?: string | null
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
}

interface AccountSettingsProps {
  user?: {
    id: string
    name: string
    email: string
    image?: string | null
  }
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

export function AccountSettings({
  user,
  session,
  activeSessions = [],
}: AccountSettingsProps) {
  const t = useTranslations('Settings')

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='font-semibold text-2xl tracking-tight'>
          {t('account')}
        </h2>
        <p className='text-muted-foreground'>
          Manage your profile and account information
        </p>
      </div>

      <ProfileUpdate user={user} />
      <PasswordUpdate />
      <SessionManagement
        session={session}
        activeSessions={activeSessions}
      />
    </div>
  )
}

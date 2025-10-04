'use client'

import { useTranslations } from 'next-intl'
import { ProfileUpdate } from '@/components/dashboard/settings/profile-update'

interface AccountSettingsProps {
  user?: {
    id: string
    name: string
    email: string
    image?: string | null
  }
}

export function AccountSettings({ user }: AccountSettingsProps) {
  const t = useTranslations('settings')

  return (
    <div className='space-y-6'>
      <div>
        <h2 className='font-semibold text-2xl tracking-tight'>
          {t('account')}
        </h2>
        <p className='text-muted-foreground'>{t('account-description')}</p>
      </div>

      <ProfileUpdate user={user} />
    </div>
  )
}

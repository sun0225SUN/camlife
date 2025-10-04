'use client'

import { AboutSettings } from '@/components/dashboard/settings/about-settings'
import { AccountSettings } from '@/components/dashboard/settings/account-settings'
import { GeneralSettings } from '@/components/dashboard/settings/general-settings'
import { SecuritySettings } from '@/components/dashboard/settings/security-settings'
import { useSession } from '@/lib/auth/client'
import { api } from '@/trpc/react'

interface Session {
  id: string
  token: string
  userAgent?: string | null
  ipAddress?: string | null
  createdAt: Date
  updatedAt: Date
  expiresAt: Date
}

interface BetterAuthSession {
  user: {
    id: string
    createdAt: Date
    updatedAt: Date
    email: string
    emailVerified: boolean
    name: string
    image?: string | null
  }
  session: {
    id: string
    createdAt: Date
    updatedAt: Date
    expiresAt: Date
    token: string
    ipAddress?: string | null
    userAgent?: string | null
  }
}

interface SettingsContentProps {
  activeSection?: string
  session?: BetterAuthSession | null
  activeSessions?: Session[]
  onSessionsUpdate?: () => void
}

export function SettingsContent({
  activeSection = 'general',
  session: propSession,
  activeSessions: propActiveSessions,
  onSessionsUpdate,
}: SettingsContentProps) {
  const { data: clientSession } = useSession()

  // Use prop session if available, otherwise fall back to client session
  const session = propSession || clientSession
  const activeSessions = propActiveSessions || []

  // Get settings data
  const { data: siteSettings, isLoading: siteLoading } =
    api.settings.getByCategory.useQuery('site')
  const { data: appSettings, isLoading: appLoading } =
    api.settings.getByCategory.useQuery('app')

  const renderContent = () => {
    switch (activeSection) {
      case 'general':
        return (
          <GeneralSettings
            siteSettings={siteSettings}
            appSettings={appSettings}
            siteLoading={siteLoading}
            appLoading={appLoading}
          />
        )
      case 'account':
        return <AccountSettings user={session?.user} />
      case 'security':
        return (
          <SecuritySettings
            session={session?.session}
            activeSessions={activeSessions}
            onSessionsUpdate={onSessionsUpdate}
          />
        )
      case 'about':
        return <AboutSettings />
      default:
        return (
          <GeneralSettings
            siteSettings={siteSettings}
            appSettings={appSettings}
            siteLoading={siteLoading}
            appLoading={appLoading}
          />
        )
    }
  }

  return <div className='flex flex-1 flex-col gap-6 p-6'>{renderContent()}</div>
}

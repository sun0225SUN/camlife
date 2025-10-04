'use client'

import { Home, Image, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { NavLogo } from '@/components/dashboard/sidebar/nav-logo'
import { NavMain } from '@/components/dashboard/sidebar/nav-main'
import { NavSettings } from '@/components/dashboard/sidebar/nav-settings'
import { NavUser } from '@/components/dashboard/sidebar/nav-user'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { usePathname } from '@/i18n/navigation'
import type { Session } from '@/lib/auth'
import {
  DASHBOARD_GALLERY_PAGE,
  DASHBOARD_HOME_PAGE,
  DASHBOARD_SETTINGS_PAGE,
} from '@/routes'

interface AppSidebarProps {
  session: Session
}

export function AppSidebar({
  session,
  ...props
}: React.ComponentProps<typeof Sidebar> & AppSidebarProps) {
  const t = useTranslations('dashboard')

  const data = {
    MainMenu: [
      {
        name: t('home'),
        url: DASHBOARD_HOME_PAGE,
        icon: Home,
      },
      {
        name: t('gallery'),
        url: DASHBOARD_GALLERY_PAGE,
        icon: Image,
      },
    ],
    SettingsMenu: [
      {
        name: t('settings'),
        url: DASHBOARD_SETTINGS_PAGE,
        icon: Settings,
      },
    ],
  }

  const pathname = usePathname()

  return (
    <Sidebar
      collapsible='icon'
      {...props}
    >
      <SidebarHeader>
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          projects={data.MainMenu}
          pathname={pathname}
        />
        <NavSettings
          projects={data.SettingsMenu}
          pathname={pathname}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          name={session?.user.name}
          email={session?.user.email}
          image={session?.user.image || undefined}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

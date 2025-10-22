'use client'

import { Hammer, Home, Image, Settings } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { NavGroup } from '@/components/dashboard/sidebar/nav-group'
import { NavLogo } from '@/components/dashboard/sidebar/nav-logo'
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
  TOOLS_PAGE,
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
    ToolsMenu: [
      {
        name: t('tools'),
        url: TOOLS_PAGE,
        icon: Hammer,
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
        <NavGroup
          projects={data.MainMenu}
          pathname={pathname}
          labelKey='menu'
        />
        <NavGroup
          projects={data.SettingsMenu}
          pathname={pathname}
          labelKey='settings'
        />
        <NavGroup
          projects={data.ToolsMenu}
          pathname={pathname}
          labelKey='tools'
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

'use client'

import { Home, Image, ListTodo, SquareUserRound } from 'lucide-react'
import { NavLogo } from '@/components/dashboard/sidebar/nav-logo'
import { NavMain } from '@/components/dashboard/sidebar/nav-main'
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
  DASHBOARD_PROFILE_PAGE,
  DASHBOARD_TODO_PAGE,
  withoutLocale,
} from '@/routes'
import { NavSettings } from './nav-settings'
import { NavTools } from './nav-tools'

interface AppSidebarProps {
  session: Session
}

const data = {
  MainMenu: [
    {
      name: 'Home',
      url: DASHBOARD_HOME_PAGE,
      icon: Home,
    },
    {
      name: 'Gallery',
      url: DASHBOARD_GALLERY_PAGE,
      icon: Image,
    },
  ],
  ToolsMenu: [
    {
      name: 'Todo',
      url: DASHBOARD_TODO_PAGE,
      icon: ListTodo,
    },
  ],
  SettingsMenu: [
    {
      name: 'Profile',
      url: DASHBOARD_PROFILE_PAGE,
      icon: SquareUserRound,
    },
  ],
}

export function AppSidebar({
  session,
  ...props
}: React.ComponentProps<typeof Sidebar> & AppSidebarProps) {
  const pathname = usePathname()
  const pathWithoutLocale = withoutLocale(pathname) // Remove the locale from the pathname

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
          pathname={pathWithoutLocale}
        />
        <NavTools
          projects={data.ToolsMenu}
          pathname={pathWithoutLocale}
        />
        <NavSettings
          projects={data.SettingsMenu}
          pathname={pathWithoutLocale}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          name={session?.user.name}
          email={session?.user.email}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

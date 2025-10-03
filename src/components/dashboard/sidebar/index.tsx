'use client'

import { Home, Image, ListTodo, Settings } from 'lucide-react'
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
  DASHBOARD_TODO_PAGE,
} from '@/routes'

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
      name: 'Settings',
      url: DASHBOARD_SETTINGS_PAGE,
      icon: Settings,
    },
  ],
}

export function AppSidebar({
  session,
  ...props
}: React.ComponentProps<typeof Sidebar> & AppSidebarProps) {
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
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

'use client'

import { Home, MoreHorizontal } from 'lucide-react'
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
import type { Session } from '@/lib/auth'
import { DASHBOARD_MORE_PAGE, DASHBOARD_PAGE } from '@/routes'

interface AppSidebarProps {
  session: Session
}

const data = {
  MainMenu: [
    {
      name: 'Home',
      url: DASHBOARD_PAGE,
      icon: Home,
    },
    {
      name: 'More',
      url: DASHBOARD_MORE_PAGE,
      icon: MoreHorizontal,
    },
  ],
}

export function AppSidebar({
  session,
  ...props
}: React.ComponentProps<typeof Sidebar> & AppSidebarProps) {
  return (
    <Sidebar
      collapsible='icon'
      {...props}
    >
      <SidebarHeader>
        <NavLogo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain projects={data.MainMenu} />
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

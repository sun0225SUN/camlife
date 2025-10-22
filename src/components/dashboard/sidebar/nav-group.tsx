'use client'

import type { LucideIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Link } from '@/i18n/navigation'

interface NavGroupProps {
  pathname: string
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
  labelKey: string
}

export function NavGroup({ pathname, projects, labelKey }: NavGroupProps) {
  const t = useTranslations('dashboard')

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t(labelKey)}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.url}
            >
              <Link href={item.url}>
                <item.icon />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

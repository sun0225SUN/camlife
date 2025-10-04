'use client'

import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

interface NavSettingsProps {
  pathname: string
  projects: {
    name: string
    url: string
    icon: LucideIcon
  }[]
}

export function NavSettings({ pathname, projects }: NavSettingsProps) {
  const t = useTranslations('dashboard')

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{t('settings')}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem
            key={item.name}
            className={cn(
              pathname === item.url && 'rounded-md bg-sidebar-accent',
            )}
          >
            <SidebarMenuButton asChild>
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

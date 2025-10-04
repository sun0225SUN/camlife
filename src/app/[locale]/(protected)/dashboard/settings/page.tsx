'use client'

import { useState } from 'react'
import { SettingsContent } from '@/components/dashboard/settings/content'
import { SettingsSidebar } from '@/components/dashboard/settings/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('account')

  return (
    <>
      <header
        className={cn(
          'flex items-center gap-2',
          'sticky top-0 h-20 shrink-0',
          'border-b bg-gradient-to-r from-background to-muted/20',
          'group-has-data-[collapsible=icon]/sidebar-wrapper:h-12',
        )}
      >
        <div className='flex items-center gap-2 px-6'>
          <SidebarTrigger className='-ml-1' />
          <Separator
            orientation='vertical'
            className='mr-2 data-[orientation=vertical]:h-4'
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className='font-semibold text-lg'>
                  Settings
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className='flex h-full'>
        <SettingsSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
        <SettingsContent activeSection={activeSection} />
      </div>
    </>
  )
}

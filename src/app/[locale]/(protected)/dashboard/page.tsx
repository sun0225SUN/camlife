'use client'

import { BasicStates } from '@/components/dashboard/analysis/basic'
import { CommitGraph } from '@/components/dashboard/analysis/commit-graph'
import { EquipmentsStats } from '@/components/dashboard/analysis/equipments'
import { GeographyStats } from '@/components/dashboard/analysis/geography'
import { DashboardSkeleton } from '@/components/dashboard/analysis/skeleton'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { api } from '@/trpc/react'

export default function AnalysisPage() {
  const {
    data: stats,
    isLoading: statsLoading,
    error: statsError,
  } = api.photo.getDashboardStats.useQuery()
  const {
    data: activityData,
    isLoading: activityLoading,
    error: activityError,
  } = api.photo.getActivityData.useQuery()

  const isLoading = statsLoading || activityLoading
  const hasError = statsError || activityError

  if (isLoading) {
    return (
      <>
        <header
          className={cn(
            'flex items-center gap-2',
            'sticky top-0 z-[999] h-20 shrink-0',
            'border-b bg-background',
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
                    Dashboard
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <DashboardSkeleton />
      </>
    )
  }

  if (hasError) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4 text-destructive'>Error loading dashboard</div>
          <div className='text-muted-foreground text-sm'>
            {statsError?.message ||
              activityError?.message ||
              'Unknown error occurred'}
          </div>
        </div>
      </div>
    )
  }

  if (!stats && !activityData) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4'>No data available</div>
          <div className='text-muted-foreground text-sm'>
            Upload some photos to see your dashboard
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <header
        className={cn(
          'flex items-center gap-2',
          'sticky top-0 h-20 shrink-0',
          'z-[999] border-b bg-white/80 backdrop-blur-md dark:bg-black/50',
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
                  Dashboard
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className='flex flex-1 flex-col gap-8 p-6'>
        <BasicStates />
        <CommitGraph
          activityData={activityData}
          isLoading={activityLoading}
        />
        {stats && <EquipmentsStats data={stats} />}
        {stats && <GeographyStats data={stats} />}
      </div>
    </>
  )
}

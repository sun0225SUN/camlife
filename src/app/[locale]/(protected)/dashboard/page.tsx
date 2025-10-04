'use client'

import { useTranslations } from 'next-intl'
import { useMemo } from 'react'
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
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { api } from '@/trpc/react'

export default function AnalysisPage() {
  const t = useTranslations('common')

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

  const { state, isMobile } = useSidebar()

  const leftMargin = useMemo(() => {
    if (isMobile) return '0'
    if (state === 'expanded') return '16rem'
    if (state === 'collapsed') return '3rem'
    return '0'
  }, [state, isMobile])

  if (isLoading) return <DashboardSkeleton />

  if (hasError) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4 text-destructive'>
            {t('error-loading-dashboard')}
          </div>
          <div className='text-muted-foreground text-sm'>
            {statsError?.message ||
              activityError?.message ||
              t('unknown-error-occurred')}
          </div>
        </div>
      </div>
    )
  }

  if (!stats && !activityData) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-center'>
          <div className='mb-4'>{t('no-data-available')}</div>
          <div className='text-muted-foreground text-sm'>
            {t('upload-photos-to-see-dashboard')}
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
          'fixed top-0 right-0 z-50 h-20',
          'border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        )}
        style={{
          left: leftMargin,
          transition: 'left 300ms cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <div className='flex cursor-pointer items-center gap-2 px-6'>
          <SidebarTrigger className='-ml-1 cursor-pointer' />
          <Separator
            orientation='vertical'
            className='mr-2 cursor-pointer data-[orientation=vertical]:h-4'
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage className='font-semibold text-lg'>
                  {t('dashboard')}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className='mt-20 flex flex-1 flex-col gap-8 overflow-x-hidden p-4 sm:p-6'>
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

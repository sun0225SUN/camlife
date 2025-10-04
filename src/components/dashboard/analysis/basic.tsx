'use client'

import { Globe, Image, MapPin, TrendingUp } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { LoadingDot } from '@/components/common/loading-dot'
import { api } from '@/trpc/react'

export function BasicStates() {
  const { data: stats, isLoading } = api.photo.getDashboardStats.useQuery()
  const t = useTranslations('common')

  if (isLoading)
    return (
      <div className='flex h-full items-center justify-center'>
        <LoadingDot />
      </div>
    )

  if (!stats)
    return (
      <div className='flex h-full items-center justify-center'>
        <div className='text-center'>
          <p>{t('no-data-available')}</p>
          <p className='text-muted-foreground text-sm'>
            {t('upload-photos-to-see-statistics')}
          </p>
        </div>
      </div>
    )

  return (
    <>
      <div>
        <h2 className='font-semibold text-2xl tracking-tight'>
          {t('overview')}
        </h2>
        <p className='text-muted-foreground'>
          {t('photo-shooting-activity-overview')}
        </p>
      </div>

      <div className='grid auto-rows-min gap-6 md:grid-cols-2 lg:grid-cols-4'>
        <StatsCard
          title={t('total-photos')}
          value={stats.totalPhotos.toLocaleString()}
          description={t('all-public-photos')}
          icon={Image}
          trend={{
            value: 12.5,
            label: t('vs-last-month'),
            isPositive: true,
          }}
        />
        <StatsCard
          title={t('this-month')}
          value={stats.recentPhotos.toLocaleString()}
          description={t('last-30-days')}
          icon={TrendingUp}
          trend={{
            value: 8.2,
            label: t('vs-last-month'),
            isPositive: true,
          }}
        />
        <StatsCard
          title={t('countries')}
          value={stats.photosByCountry.length}
          description={t('different-countries')}
          icon={Globe}
        />
        <StatsCard
          title={t('cities')}
          value={stats.photosByCity.length}
          description={t('different-cities')}
          icon={MapPin}
        />
      </div>
    </>
  )
}

import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface StatsCardProps {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
  trend?: {
    value: number
    label: string
    isPositive?: boolean
  }
  className?: string
}

function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
}: StatsCardProps) {
  return (
    <Card className='group transition-all duration-300 hover:shadow-lg'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-3'>
        <CardTitle className='font-medium text-muted-foreground text-sm transition-colors group-hover:text-foreground'>
          {title}
        </CardTitle>
        {Icon && (
          <div className='rounded-lg bg-primary/10 p-2 transition-colors group-hover:bg-primary/20'>
            <Icon className='h-4 w-4 text-primary' />
          </div>
        )}
      </CardHeader>

      <CardContent className='space-y-2'>
        <div className='font-bold text-3xl tracking-tight transition-colors group-hover:text-primary'>
          {value}
        </div>
        {description && (
          <p className='text-muted-foreground text-sm'>{description}</p>
        )}
        {trend && (
          <div className='flex items-center gap-1 pt-1'>
            <div
              className={`flex items-center gap-1 rounded-full px-2 py-1 font-medium text-xs ${
                trend.isPositive
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              <span className='text-xs'>{trend.isPositive ? '↗' : '↘'}</span>
              {trend.isPositive ? '+' : ''}
              {trend.value}%
            </div>
            <span className='text-muted-foreground text-xs'>{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

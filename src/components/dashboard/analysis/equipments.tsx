'use client'

import { Camera } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface CameraStatsData {
  make: string | null
  model: string | null
  count: number
}

interface LensStatsData {
  lensModel: string | null
  count: number
}

interface DashboardStats {
  totalPhotos: number
  recentPhotos: number
  photosByCountry: Array<{ country: string | null; count: number }>
  photosByCity: Array<{
    city: string | null
    country: string | null
    count: number
  }>
  photosByMonth: Array<{ month: string; count: number }>
  photosByRating: Array<{ rating: number; count: number }>
  cameraStats: CameraStatsData[]
  lensStats: LensStatsData[]
}

interface CameraStatsProps {
  data: DashboardStats
  className?: string
}

export function EquipmentsStats({ data, className }: CameraStatsProps) {
  const cameraData = (data.cameraStats || []).filter(
    (item) => item.make && item.model,
  )

  const lensData = (data.lensStats || []).filter((item) => item.lensModel)

  const totalPhotos = data.totalPhotos

  return (
    <>
      <div>
        <h2 className='font-semibold text-2xl tracking-tight'>Equipment</h2>
        <p className='text-muted-foreground'>
          Your photo shooting equipment distribution
        </p>
      </div>

      <div
        className={cn(
          'grid h-full grid-cols-1 gap-6 lg:grid-cols-2',
          className,
        )}
      >
        <Card className='flex h-full flex-col border-0 shadow-none'>
          <CardHeader className='flex-shrink-0 pb-4'>
            <CardTitle className='flex items-center gap-2 text-base'>
              <Camera className='h-4 w-4 text-muted-foreground' />
              Camera
            </CardTitle>
          </CardHeader>
          <CardContent className='flex-1 pt-0'>
            <div className='flex h-full flex-col justify-between'>
              <div className='space-y-3'>
                {cameraData.slice(0, 6).map((item, index) => {
                  const percentage = (item.count / totalPhotos) * 100
                  return (
                    <div
                      key={`${item.make}-${item.model}`}
                      className='flex items-center justify-between rounded px-2 py-3 transition-colors hover:bg-muted/20'
                    >
                      <div className='flex min-w-0 flex-1 items-center gap-3'>
                        <span className='w-6 text-right font-mono text-muted-foreground text-sm'>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className='min-w-0 flex-1'>
                          <div className='truncate font-medium text-sm'>
                            {item.make} {item.model}
                          </div>
                          <div className='text-muted-foreground text-xs'>
                            {item.count} photos
                          </div>
                        </div>
                      </div>
                      <div className='ml-3 text-right'>
                        <div className='font-semibold text-sm'>
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className='flex h-full flex-col border-0 shadow-none'>
          <CardHeader className='flex-shrink-0 pb-4'>
            <CardTitle className='flex items-center gap-2 text-base'>
              <Camera className='h-4 w-4 text-muted-foreground' />
              Lens
            </CardTitle>
          </CardHeader>
          <CardContent className='flex-1 pt-0'>
            <div className='flex h-full flex-col justify-between'>
              <div className='space-y-3'>
                {lensData.slice(0, 6).map((item, index) => {
                  const percentage = (item.count / totalPhotos) * 100
                  return (
                    <div
                      key={item.lensModel}
                      className='flex items-center justify-between rounded px-2 py-3 transition-colors hover:bg-muted/20'
                    >
                      <div className='flex min-w-0 flex-1 items-center gap-3'>
                        <span className='w-6 text-right font-mono text-muted-foreground text-sm'>
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <div className='min-w-0 flex-1'>
                          <div className='truncate font-medium text-sm'>
                            {item.lensModel}
                          </div>
                          <div className='text-muted-foreground text-xs'>
                            {item.count} photos
                          </div>
                        </div>
                      </div>
                      <div className='ml-3 text-right'>
                        <div className='font-semibold text-sm'>
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

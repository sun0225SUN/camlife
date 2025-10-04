'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface DashboardSkeletonProps {
  className?: string
}

export function DashboardSkeleton({ className }: DashboardSkeletonProps) {
  return (
    <div className={cn('flex flex-1 flex-col gap-8 p-6', className)}>
      {/* Basic Stats Section */}
      <div>
        <div className='mb-4'>
          <Skeleton className='h-8 w-32' />
          <Skeleton className='mt-2 h-4 w-64' />
        </div>
        <div className='grid auto-rows-min gap-6 md:grid-cols-2 lg:grid-cols-4'>
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`stats-card-${index}`}
              className='group rounded-xl border bg-card p-6 transition-all duration-300 hover:shadow-lg'
            >
              <div className='flex flex-row items-center justify-between space-y-0 pb-3'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-8 w-8 rounded-lg' />
              </div>
              <div className='space-y-2'>
                <Skeleton className='h-8 w-16' />
                <Skeleton className='h-4 w-24' />
                <div className='flex items-center gap-1 pt-1'>
                  <Skeleton className='h-5 w-12 rounded-full' />
                  <Skeleton className='h-4 w-16' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Commit Graph Section */}
      <div>
        <div className='mb-4'>
          <Skeleton className='h-8 w-32' />
          <Skeleton className='mt-2 h-4 w-64' />
        </div>
        <div className='w-full rounded-xl border bg-card p-6'>
          <div className='mb-4'>
            <Skeleton className='h-6 w-32' />
          </div>
          <div className='space-y-4'>
            <div className='flex w-full justify-start overflow-x-auto'>
              <Skeleton className='mr-2 h-10 w-16 rounded-md' />
              <Skeleton className='mr-2 h-10 w-16 rounded-md' />
              <Skeleton className='h-10 w-16 rounded-md' />
            </div>
            <div className='min-h-[300px] space-y-2'>
              <Skeleton className='mx-auto h-6 w-48' />
              <div className='relative w-full overflow-hidden'>
                <div className='mb-2 flex text-xs'>
                  <div className='mr-2 w-6 flex-shrink-0'></div>
                  <div className='flex min-w-0 flex-1 justify-between'>
                    {Array.from({ length: 12 }).map((_, i) => (
                      <Skeleton
                        key={`month-${i}`}
                        className='h-3 w-4'
                      />
                    ))}
                  </div>
                </div>
                <div className='flex w-full gap-1'>
                  <div className='mr-2 flex flex-shrink-0 flex-col gap-1'>
                    {Array.from({ length: 7 }).map((_, i) => (
                      <Skeleton
                        key={`day-${i}`}
                        className='h-4 w-6'
                      />
                    ))}
                  </div>
                  <div className='flex min-w-0 flex-1 gap-1'>
                    <div className='flex w-full gap-1'>
                      {Array.from({ length: 52 }).map((_, i) => (
                        <div
                          key={`week-${i}`}
                          className='flex flex-col gap-1'
                          style={{ width: `${100 / 52}%` }}
                        >
                          {Array.from({ length: 7 }).map((_, j) => (
                            <Skeleton
                              key={`day-${i}-${j}`}
                              className='h-4 w-full rounded-sm'
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className='mt-4 flex items-center justify-end gap-4'>
                  <Skeleton className='h-3 w-8' />
                  <div className='flex gap-1'>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton
                        key={`legend-${i}`}
                        className='h-3 w-3 rounded-sm'
                      />
                    ))}
                  </div>
                  <Skeleton className='h-3 w-8' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Equipment Stats Section */}
      <div>
        <div className='mb-4'>
          <Skeleton className='h-8 w-32' />
          <Skeleton className='mt-2 h-4 w-64' />
        </div>
        <div className='grid h-full grid-cols-1 gap-6 lg:grid-cols-2'>
          {/* Camera Stats */}
          <div className='group rounded-xl border bg-card p-6 transition-all duration-300 hover:shadow-lg'>
            <div className='pb-4'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-4 w-4' />
                <Skeleton className='h-6 w-16' />
              </div>
            </div>
            <div className='space-y-3'>
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`camera-item-${index}`}
                  className='flex items-center justify-between rounded px-2 py-3'
                >
                  <div className='flex min-w-0 flex-1 items-center gap-3'>
                    <Skeleton className='h-4 w-6' />
                    <div className='min-w-0 flex-1'>
                      <Skeleton className='mb-1 h-4 w-24' />
                      <Skeleton className='h-3 w-16' />
                    </div>
                  </div>
                  <div className='ml-3 text-right'>
                    <Skeleton className='h-4 w-8' />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lens Stats */}
          <div className='group rounded-xl border bg-card p-6 transition-all duration-300 hover:shadow-lg'>
            <div className='pb-4'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-4 w-4' />
                <Skeleton className='h-6 w-12' />
              </div>
            </div>
            <div className='space-y-3'>
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={`lens-item-${index}`}
                  className='flex items-center justify-between rounded px-2 py-3'
                >
                  <div className='flex min-w-0 flex-1 items-center gap-3'>
                    <Skeleton className='h-4 w-6' />
                    <div className='min-w-0 flex-1'>
                      <Skeleton className='mb-1 h-4 w-28' />
                      <Skeleton className='h-3 w-16' />
                    </div>
                  </div>
                  <div className='ml-3 text-right'>
                    <Skeleton className='h-4 w-8' />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Geography Stats Section */}
      <div>
        <div className='mb-4'>
          <Skeleton className='h-8 w-32' />
          <Skeleton className='mt-2 h-4 w-64' />
        </div>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
          {/* Country Distribution */}
          <div className='group rounded-xl border bg-card p-6 transition-all duration-300 hover:shadow-lg'>
            <div className='pb-4'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-4 w-4' />
                <Skeleton className='h-6 w-40' />
              </div>
              <Skeleton className='mt-1 h-4 w-32' />
            </div>
            <div className='flex h-[300px] w-full items-center justify-center'>
              <div className='relative'>
                <Skeleton className='h-48 w-48 rounded-full' />
                <div className='absolute inset-0 flex items-center justify-center'>
                  <Skeleton className='h-4 w-16' />
                </div>
              </div>
            </div>
          </div>

          {/* City Distribution */}
          <div className='group rounded-xl border bg-card p-6 transition-all duration-300 hover:shadow-lg'>
            <div className='pb-4'>
              <div className='flex items-center gap-2'>
                <Skeleton className='h-4 w-4' />
                <Skeleton className='h-6 w-32' />
              </div>
              <Skeleton className='mt-1 h-4 w-28' />
            </div>
            <div className='h-[300px] w-full'>
              <div className='h-full w-full space-y-2'>
                {Array.from({ length: 8 }).map((_, index) => (
                  <div
                    key={`city-item-${index}`}
                    className='flex items-center gap-2'
                  >
                    <Skeleton className='h-4 w-16' />
                    <Skeleton className='h-6 flex-1 rounded' />
                    <Skeleton className='h-4 w-8' />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

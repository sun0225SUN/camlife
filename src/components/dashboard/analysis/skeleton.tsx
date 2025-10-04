'use client'

import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'

interface DashboardSkeletonProps {
  className?: string
}

export function DashboardSkeleton({ className }: DashboardSkeletonProps) {
  return (
    <div>
      <div className='mt-4 flex items-center justify-center px-6'>
        <Skeleton className='h-18 w-full' />
      </div>

      <div
        className={cn(
          'flex flex-1 flex-col gap-10 overflow-x-hidden p-4 sm:p-6',
          className,
        )}
      >
        <div className='space-y-8'>
          <div className='space-y-2'>
            <Skeleton className='h-8 w-32' />
            <Skeleton className='h-4 w-64' />
          </div>

          <div className='mt-5 grid auto-rows-min gap-6 md:grid-cols-2 lg:grid-cols-4'>
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className='h-52 rounded-lg border bg-card p-6'
              >
                <div className='flex items-center justify-between space-y-0 pb-3'>
                  <Skeleton className='h-4 w-20' />
                  <Skeleton className='h-8 w-8 rounded-lg' />
                </div>
                <div className='space-y-2'>
                  <Skeleton className='h-8 w-16' />
                  <Skeleton className='h-3 w-24' />
                  <div className='flex items-center gap-2 pt-1'>
                    <Skeleton className='h-5 w-12 rounded-full' />
                    <Skeleton className='h-3 w-20' />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='rounded-xl border bg-card p-6'>
          <div className='space-y-4'>
            <div className='flex gap-2'>
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className='h-9 w-16 rounded-md'
                />
              ))}
            </div>

            <div className='space-y-4'>
              <Skeleton className='mx-auto h-6 w-48' />

              <div className='flex justify-between text-xs'>
                {Array.from({ length: 12 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className='h-3 w-6'
                  />
                ))}
              </div>

              <div className='flex gap-1'>
                <div className='mr-2 flex flex-col gap-1'>
                  {Array.from({ length: 7 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className='h-4 w-6'
                    />
                  ))}
                </div>

                <div className='flex min-w-0 flex-1 gap-1'>
                  {Array.from({ length: 52 }).map((_, weekIndex) => (
                    <div
                      key={weekIndex}
                      className='flex flex-col gap-1'
                      style={{ width: `${100 / 52}%` }}
                    >
                      {Array.from({ length: 7 }).map((_, dayIndex) => (
                        <Skeleton
                          key={dayIndex}
                          className='h-2 w-2 rounded-sm sm:h-3 sm:w-3 md:h-4 md:w-4 lg:h-5 lg:w-5'
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className='flex items-center justify-end gap-4'>
                <Skeleton className='h-3 w-8' />
                <div className='flex gap-1'>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton
                      key={index}
                      className='h-3 w-3 rounded-sm'
                    />
                  ))}
                </div>
                <Skeleton className='h-3 w-8' />
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-8'>
          <div className='space-y-2'>
            <Skeleton className='h-8 w-32' />
            <Skeleton className='h-4 w-64' />
          </div>

          <div className='grid w-full max-w-full grid-cols-1 gap-6 lg:grid-cols-2'>
            <div className='rounded-lg border bg-card p-6'>
              <div className='pb-4'>
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-4 w-4' />
                  <Skeleton className='h-6 w-16' />
                </div>
              </div>
              <div className='space-y-3'>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between rounded px-2 py-3'
                  >
                    <div className='flex min-w-0 flex-1 items-center gap-3'>
                      <Skeleton className='h-4 w-6' />
                      <div className='min-w-0 flex-1 space-y-1'>
                        <Skeleton className='h-4 w-32' />
                        <Skeleton className='h-3 w-20' />
                      </div>
                    </div>
                    <div className='ml-3'>
                      <Skeleton className='h-4 w-12' />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className='rounded-lg border bg-card p-6'>
              <div className='pb-4'>
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-4 w-4' />
                  <Skeleton className='h-6 w-12' />
                </div>
              </div>
              <div className='space-y-3'>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between rounded px-2 py-3'
                  >
                    <div className='flex min-w-0 flex-1 items-center gap-3'>
                      <Skeleton className='h-4 w-6' />
                      <div className='min-w-0 flex-1 space-y-1'>
                        <Skeleton className='h-4 w-28' />
                        <Skeleton className='h-3 w-16' />
                      </div>
                    </div>
                    <div className='ml-3'>
                      <Skeleton className='h-4 w-12' />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className='space-y-8'>
          <div className='space-y-2'>
            <Skeleton className='h-8 w-24' />
            <Skeleton className='h-4 w-64' />
          </div>

          <div className='grid w-full max-w-full grid-cols-1 gap-6 lg:grid-cols-2'>
            <div className='rounded-lg border bg-card p-6'>
              <div className='pb-4'>
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-4 w-4' />
                  <Skeleton className='h-6 w-40' />
                </div>
                <Skeleton className='mt-2 h-3 w-48' />
              </div>
              <div className='flex h-[300px] w-full items-center justify-center'>
                <div className='space-y-4'>
                  <Skeleton className='mx-auto h-16 w-16 rounded-full' />
                  <div className='space-y-2'>
                    <Skeleton className='mx-auto h-4 w-24' />
                    <Skeleton className='mx-auto h-3 w-32' />
                  </div>
                </div>
              </div>
            </div>

            <div className='rounded-lg border bg-card p-6'>
              <div className='pb-4'>
                <div className='flex items-center gap-2'>
                  <Skeleton className='h-4 w-4' />
                  <Skeleton className='h-6 w-32' />
                </div>
                <Skeleton className='mt-2 h-3 w-40' />
              </div>
              <div className='h-[300px] w-full'>
                <div className='space-y-4'>
                  <div className='flex h-48 items-end justify-between px-4'>
                    {Array.from({ length: 8 }).map((_, index) => (
                      <Skeleton
                        key={index}
                        className='w-8 rounded-t-sm'
                        style={{ height: `${Math.random() * 100 + 20}%` }}
                      />
                    ))}
                  </div>
                  <div className='flex justify-between px-4'>
                    {Array.from({ length: 8 }).map((_, index) => (
                      <Skeleton
                        key={index}
                        className='h-3 w-8'
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

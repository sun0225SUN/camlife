'use client'

import { useEffect, useState } from 'react'
import { LoadingDot } from '@/components/common/loading-dot'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface ActivityData {
  years: number[]
  yearlyData: {
    [year: number]: {
      weeklyData: number[][]
      startDate: string
      totalPhotos: number
    }
  }
}

interface CommitGraphProps {
  activityData?: ActivityData
  isLoading?: boolean
}

export function CommitGraph({ activityData, isLoading }: CommitGraphProps) {
  const [activeTab, setActiveTab] = useState('total')

  // Debug: 添加控制台输出来检查数据
  console.log('CommitGraph - activityData:', activityData)
  console.log('CommitGraph - isLoading:', isLoading)
  const [hoveredCell, setHoveredCell] = useState<{
    week: number
    day: number
    count: number
    date: string
    position: { x: number; y: number }
    isFirstRow: boolean
  } | null>(null)

  useEffect(() => {
    if (!isLoading && activityData?.years?.length && activityData.years[0]) {
      setActiveTab(activityData.years[0].toString())
    }
  }, [isLoading, activityData?.years])

  const getDateString = (
    week: number,
    day: number,
    startDate: string,
  ): string => {
    const startDateObj = new Date(startDate)
    const currentDate = new Date(startDateObj)
    currentDate.setDate(startDateObj.getDate() + week * 7 + day)

    return currentDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const handleMouseEnter = (
    event: React.MouseEvent<HTMLDivElement>,
    week: number,
    day: number,
    count: number,
    startDate: string,
  ) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const containerRect = event.currentTarget
      .closest('.relative')
      ?.getBoundingClientRect()

    if (containerRect) {
      setHoveredCell({
        week,
        day,
        count,
        date: getDateString(week, day, startDate),
        position: {
          x: rect.left - containerRect.left + rect.width / 2,
          y: rect.top - containerRect.top + rect.height / 2,
        },
        isFirstRow: day === 0,
      })
    }
  }

  const handleMouseLeave = () => {
    setHoveredCell(null)
  }

  const getColor = (count: number): string => {
    const colors: { [key: number]: string } = {
      0: 'bg-white/50 dark:bg-white/20',
      1: 'bg-green-200 dark:bg-green-800',
      2: 'bg-green-400 dark:bg-green-700',
      3: 'bg-green-600 dark:bg-green-600',
      4: 'bg-green-700 dark:bg-green-500',
      5: 'bg-green-800 dark:bg-green-400',
    }
    return colors[count] ?? 'bg-gray-300 dark:bg-gray-700'
  }

  const renderHeatmap = (yearlyData: ActivityData['yearlyData'][number]) => {
    if (isLoading) {
      return (
        <div className='flex h-[300px] items-center justify-center'>
          <LoadingDot />
        </div>
      )
    }

    return (
      <div className='relative w-full overflow-hidden'>
        <div className='mb-2 flex text-muted-foreground text-xs'>
          <div className='mr-2 w-6 flex-shrink-0'></div>
          <div className='flex min-w-0 flex-1 justify-between'>
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>

        <div className='flex w-full gap-1'>
          <div className='mr-2 flex flex-shrink-0 flex-col gap-1'>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
              (day, index) => (
                <div
                  key={`day-${day}`}
                  className='flex h-2 w-6 items-center text-muted-foreground text-xs sm:h-3 md:h-4 lg:h-5'
                >
                  {index % 2 === 0 ? day : ''}
                </div>
              ),
            )}
          </div>

          <div className='flex min-w-0 flex-1 gap-1'>
            <div
              id='contributions'
              className='flex w-full gap-1'
            >
              {yearlyData.weeklyData.map((week, i) => (
                <div
                  key={`week-${i}-${week.join('-')}`}
                  id={`week-${i}`}
                  className={cn(
                    'flex flex-col gap-1',
                    i < 20 ? 'hidden md:flex' : 'flex',
                  )}
                  style={{ width: `${100 / yearlyData.weeklyData.length}%` }}
                >
                  {week.map((commitCount, j) => (
                    <div
                      key={`week-${i}-day-${j}-${commitCount}`}
                      id={`week-${i}-day-${j}`}
                      className={cn(
                        'h-2 w-2 sm:h-3 sm:w-3 md:h-4 md:w-4 md:rounded-sm lg:h-5 lg:w-5',
                        'cursor-pointer transition-all duration-200 ease-in-out',
                        'hover:z-10 hover:scale-110 hover:shadow-md',
                        getColor(commitCount),
                      )}
                      onMouseEnter={(e) =>
                        handleMouseEnter(
                          e,
                          i,
                          j,
                          commitCount,
                          yearlyData.startDate,
                        )
                      }
                      onMouseLeave={handleMouseLeave}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className='mt-4 flex items-center justify-end gap-4 text-muted-foreground text-sm'>
          <span>Less</span>
          <div className='flex gap-1'>
            <div className='h-3 w-3 rounded-sm bg-gray-300 dark:bg-gray-700' />
            <div className='h-3 w-3 rounded-sm bg-green-200 dark:bg-green-800' />
            <div className='h-3 w-3 rounded-sm bg-green-400 dark:bg-green-700' />
            <div className='h-3 w-3 rounded-sm bg-green-600 dark:bg-green-600' />
            <div className='h-3 w-3 rounded-sm bg-green-700 dark:bg-green-500' />
            <div className='h-3 w-3 rounded-sm bg-green-800 dark:bg-green-400' />
          </div>
          <span>More</span>
        </div>

        {hoveredCell && (
          <div
            className='pointer-events-none absolute z-50 rounded-md border border-border bg-popover px-2 py-1 text-popover-foreground text-xs shadow-lg'
            style={{
              left: hoveredCell.position.x,
              ...(hoveredCell.isFirstRow
                ? { top: hoveredCell.position.y + 20 }
                : { top: hoveredCell.position.y - 8 - 50 }),
              transform: 'translateX(-50%)',
            }}
          >
            <div className='font-medium'>
              {hoveredCell.count} {hoveredCell.count === 1 ? 'photo' : 'photos'}
            </div>
            <div className='text-muted-foreground'>{hoveredCell.date}</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='w-full rounded-xl border bg-card p-6'>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className='w-full'
      >
        <TabsList
          className={cn(
            'flex w-full justify-start overflow-x-auto',
            isLoading && 'opacity-0',
          )}
        >
          {activityData?.years?.map((year) => (
            <TabsTrigger
              key={year}
              value={year.toString()}
              className='cursor-pointer whitespace-nowrap'
            >
              {year}
            </TabsTrigger>
          ))}

          <TabsTrigger
            value='total'
            className='cursor-pointer whitespace-nowrap'
          >
            Total
          </TabsTrigger>
        </TabsList>

        {activityData?.years?.map((year) => (
          <TabsContent
            key={year}
            value={year.toString()}
            className='mt-4'
          >
            <div className='min-h-[300px] space-y-2 text-center'>
              <h3 className='mb-10 font-medium text-lg'>
                {year} Photo Activity (
                {activityData.yearlyData[year]?.totalPhotos || 0} photos)
              </h3>
              {activityData.yearlyData[year] &&
                renderHeatmap(activityData.yearlyData[year])}
            </div>
          </TabsContent>
        ))}

        <TabsContent
          value='total'
          className='mt-4'
        >
          <div className='min-h-[300px] space-y-8'>
            {!isLoading &&
              activityData?.years?.length &&
              activityData.years.map((year) => (
                <div
                  key={year}
                  className='min-h-[300px] space-y-2 text-center'
                >
                  <h3 className='mb-10 font-medium text-lg'>
                    {year} Photo Activity (
                    {activityData.yearlyData[year]?.totalPhotos || 0} photos)
                  </h3>
                  {activityData.yearlyData[year] &&
                    renderHeatmap(activityData.yearlyData[year])}
                </div>
              ))}

            {!isLoading && !activityData?.years?.length && (
              <div className='flex h-[300px] items-center justify-center text-muted-foreground'>
                No activity data available
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

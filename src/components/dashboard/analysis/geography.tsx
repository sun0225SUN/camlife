'use client'

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { cn } from '@/lib/utils'

interface GeoDistributionData {
  name: string
  count: number
}

interface DashboardStats {
  totalPhotos: number
  recentPhotos: number
  photosByCountry: Array<{
    country: string | null
    count: number
  }>
  photosByCity: Array<{
    city: string | null
    country: string | null
    count: number
  }>
  photosByMonth: Array<{
    month: string
    count: number
  }>
  photosByRating: Array<{
    rating: number | null
    count: number
  }>
  cameraStats: Array<{
    make: string | null
    model: string | null
    count: number
  }>
}

interface GeographyProps {
  data: DashboardStats
  className?: string
}

const chartConfig = {
  count: {
    label: 'Photo Count',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  'var(--chart-6)',
  'var(--chart-7)',
  'var(--chart-8)',
  'var(--chart-9)',
  'var(--chart-10)',
]

export function GeographyStats({ data, className }: GeographyProps) {
  const countryData: GeoDistributionData[] = data.photosByCountry
    .filter((item) => item.country !== null)
    .map((item) => ({
      name: item.country!,
      count: Number(item.count),
    }))
    .slice(0, 8)

  const cityData: GeoDistributionData[] = data.photosByCity
    .filter((item) => item.city !== null)
    .map((item) => ({
      name: item.city!,
      count: Number(item.count),
    }))
    .slice(0, 10)

  const hasCountryData = countryData.length > 0

  return (
    <>
      <div>
        <h2 className='font-semibold text-2xl tracking-tight'>Places</h2>
        <p className='text-muted-foreground'>
          Your photo shooting places distribution
        </p>
      </div>

      <div className={cn('grid grid-cols-1 gap-6 lg:grid-cols-2', className)}>
        <Card className='group transition-all duration-300 hover:shadow-lg'>
          <CardHeader className='pb-4'>
            <CardTitle className='font-semibold text-lg'>
              Country Distribution
            </CardTitle>
            <CardDescription className='text-sm'>
              Photo distribution by country
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-0'>
            {hasCountryData ? (
              <div className='h-[300px] w-full'>
                <ChartContainer
                  config={chartConfig}
                  className='h-full w-full'
                >
                  <PieChart>
                    <Pie
                      data={countryData}
                      dataKey='count'
                      nameKey='name'
                      cx='50%'
                      cy='50%'
                      outerRadius={80}
                      innerRadius={0}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {countryData.map((entry, index) => (
                        <Cell
                          key={`cell-${entry.name}-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ChartContainer>
              </div>
            ) : (
              <div className='flex h-[300px] flex-col items-center justify-center text-center'>
                <div className='mb-4 text-6xl'>🌍</div>
                <h3 className='mb-2 font-semibold text-lg'>No Data</h3>
                <p className='mb-4 text-muted-foreground text-sm'>
                  No photo location information available
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className='group transition-all duration-300 hover:shadow-lg'>
          <CardHeader className='pb-4'>
            <CardTitle className='font-semibold text-lg'>
              City Distribution
            </CardTitle>
            <CardDescription className='text-sm'>
              Photo distribution by city
            </CardDescription>
          </CardHeader>
          <CardContent className='pt-0'>
            <ChartContainer
              config={chartConfig}
              className='h-[300px] w-full'
            >
              <BarChart
                data={cityData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey='name'
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => {
                    return value.length > 8 ? `${value.slice(0, 8)}...` : value
                  }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.toString()}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar
                  dataKey='count'
                  fill='var(--color-count)'
                  radius={[6, 6, 0, 0]}
                  className='transition-opacity hover:opacity-80'
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

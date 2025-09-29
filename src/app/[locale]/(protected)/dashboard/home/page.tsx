import { ChartArea } from '@/components/dashboard/chart/chart-area'
import { ChartLineDefault } from '@/components/dashboard/chart/line'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'

export default function Page() {
  return (
    <>
      <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
        <div className='flex items-center gap-2 px-4'>
          <SidebarTrigger className='-ml-1' />
          <Separator
            orientation='vertical'
            className='mr-2 data-[orientation=vertical]:h-4'
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>
      <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
        <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
          <div className='h-50 rounded-xl bg-muted/50'></div>
          <div className='h-50 rounded-xl bg-muted/50'></div>
          <div className='h-50 rounded-xl bg-muted/50'></div>
        </div>
        <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
          <div className='aspect-video rounded-xl bg-muted/50'>
            <ChartLineDefault />
          </div>
          <div className='aspect-video rounded-xl bg-muted/50'>
            <ChartLineDefault />
          </div>
          <div className='aspect-video rounded-xl bg-muted/50'>
            <ChartLineDefault />
          </div>
        </div>
        <div className='flex-1 rounded-xl'>
          <ChartArea />
        </div>
      </div>
    </>
  )
}

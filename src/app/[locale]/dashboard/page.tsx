// import { headers } from 'next/headers'
// import { LogoutButton } from '@/components/auth/logout-button'
// import { auth } from '@/lib/auth'

// export default async function Dashboard() {
//   const session = await auth.api.getSession({
//     headers: await headers(),
//   })

//   return (

//   )
// }

import { headers } from 'next/headers'
import { LogoutButton } from '@/components/auth/logout-button'
import { AppSidebar } from '@/components/dashboard/app-sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { auth } from '@/lib/auth'

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
          <div className='flex items-center gap-2 px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator
              orientation='vertical'
              className='mr-2 data-[orientation=vertical]:h-4'
            />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className='hidden md:block'>
                  <BreadcrumbLink href='#'>
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className='hidden md:block' />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
          <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
            <div className='aspect-video rounded-xl bg-muted/50'>
              <div className='p-6'>
                <div className='mb-6 flex items-center justify-between'>
                  <h1 className='font-bold text-2xl'>Dashboard</h1>
                  <LogoutButton />
                </div>

                <div className='mb-6 p-4'>
                  <h2 className='mb-2 font-semibold text-lg'>Welcome back!</h2>
                  <p className='mb-2'>
                    <strong>Name:</strong> {session!.user.name}
                  </p>
                  <p className='mb-2'>
                    <strong>Email:</strong> {session!.user.email}
                  </p>
                </div>
              </div>
            </div>
            <div className='aspect-video rounded-xl bg-muted/50' />
            <div className='aspect-video rounded-xl bg-muted/50' />
          </div>
          <div className='min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min' />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

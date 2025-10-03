'use client'

import { DataTable } from '@/components/dashboard/gallery/data-table'
import { FileUpload } from '@/components/dashboard/gallery/file-upload'
import { PhotoInfo } from '@/components/dashboard/gallery/photo-info'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

export default function GalleryPage() {
  return (
    <>
      <header
        className={cn(
          'flex items-center gap-2',
          'sticky top-0 h-20 shrink-0',
          'border-b bg-gradient-to-r from-background to-muted/20',
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
                  Gallery
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </header>

      <div className='flex flex-1 flex-col gap-6 p-6'>
        <div>
          <h2 className='font-semibold text-2xl tracking-tight'>
            Upload Photos
          </h2>
          <p className='text-muted-foreground'>
            Upload and manage your photo collection
          </p>
        </div>
        <div className='rounded-md border border-border'>
          <FileUpload />
        </div>

        <div>
          <h2 className='font-semibold text-2xl tracking-tight'>
            Photo Gallery
          </h2>
          <p className='text-muted-foreground'>
            View and manage all your uploaded photos
          </p>
        </div>
        <DataTable />
      </div>
      <PhotoInfo />
    </>
  )
}

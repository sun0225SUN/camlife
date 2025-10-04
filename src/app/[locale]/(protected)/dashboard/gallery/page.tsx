'use client'

import { useMemo } from 'react'
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
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'

export default function GalleryPage() {
  const { state, isMobile } = useSidebar()

  const leftMargin = useMemo(() => {
    if (isMobile) return '0'
    if (state === 'expanded') return '16rem'
    if (state === 'collapsed') return '3rem'
    return '0'
  }, [state, isMobile])

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
        <div className='flex items-center gap-2 px-6'>
          <SidebarTrigger className='-ml-1 cursor-pointer' />
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

      <div className='flex h-full flex-col gap-6 p-6 pt-28'>
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

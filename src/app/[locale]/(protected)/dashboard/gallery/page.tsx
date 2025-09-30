import { DataTable } from '@/components/dashboard/gallery/data-table'
import { FileUpload } from '@/components/dashboard/gallery/file-upload'
import { PhotoInfo } from '@/components/dashboard/gallery/photo-info'

export default function GalleryPage() {
  return (
    <>
      <div className='mx-auto w-full max-w-7xl space-y-10 px-10 pt-25'>
        <div className='rounded-md border border-border'>
          <FileUpload />
        </div>
        <DataTable />
      </div>
      <PhotoInfo />
    </>
  )
}

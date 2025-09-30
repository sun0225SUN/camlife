'use client'

import { useState } from 'react'
import { DataTable } from '@/components/dashboard/gallery/data-table'
import { FileUpload } from '@/components/dashboard/gallery/file-upload'

export default function GalleryPage() {
  const [_files, setFiles] = useState<File[]>([])
  const handleFileUpload = (files: File[]) => {
    setFiles(files)
    console.log(files)
  }

  return (
    <div className='mx-auto w-full max-w-7xl pt-25'>
      <div className='rounded-md border'>
        <FileUpload onChange={handleFileUpload} />
      </div>
      <DataTable />
    </div>
  )
}

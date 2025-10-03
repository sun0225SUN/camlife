'use client'

import { GalleryThumbnails, LayoutGrid, LayoutPanelLeft } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'
import { useView } from '@/stores/use-view'
import type { ViewType } from '@/types'

export function ViewSwitch() {
  const { layout, setLayout } = useView()

  const params = useSearchParams()

  const layoutFromUrl = params.get('layout')

  useEffect(() => {
    if (layoutFromUrl) {
      setLayout(layoutFromUrl as ViewType)
    }
  }, [layoutFromUrl, setLayout])

  const handleViewChange = (view: ViewType) => {
    setLayout(view)
    window.scrollTo({ top: 0 })
  }

  return (
    <div className='flex items-center gap-4'>
      <button
        type='button'
        onClick={() => handleViewChange('feed')}
        className={cn(
          'cursor-pointer transition-all duration-300 hover:scale-105',
          layout !== 'feed' &&
            'text-muted-foreground hover:text-black dark:hover:text-white',
        )}
      >
        <GalleryThumbnails
          className='size-6'
          strokeWidth={2.25}
          absoluteStrokeWidth
        />
      </button>

      <button
        type='button'
        onClick={() => handleViewChange('waterfall')}
        className={cn(
          'cursor-pointer transition-all duration-300 hover:scale-105',
          layout !== 'waterfall' &&
            'text-muted-foreground hover:text-black dark:hover:text-white',
        )}
      >
        <LayoutPanelLeft
          className='size-6'
          strokeWidth={2.25}
          absoluteStrokeWidth
        />
      </button>

      <button
        type='button'
        onClick={() => handleViewChange('grid')}
        className={cn(
          'cursor-pointer transition-all duration-300 hover:scale-105',
          layout !== 'grid' &&
            'text-muted-foreground hover:text-black dark:hover:text-white',
        )}
      >
        <LayoutGrid
          className='size-6'
          strokeWidth={2.25}
          absoluteStrokeWidth
        />
      </button>
    </div>
  )
}

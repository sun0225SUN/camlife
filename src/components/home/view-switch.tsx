'use client'

import { GalleryThumbnails, LayoutGrid, LayoutPanelLeft } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useView } from '@/stores/use-view'
import type { ViewType } from '@/types'

export function ViewSwitch() {
  const { view, setView } = useView()

  const handleViewChange = (view: ViewType) => {
    setView(view)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className='flex items-center gap-4'>
      <button
        type='button'
        onClick={() => handleViewChange('feed')}
        className={cn(
          'cursor-pointer transition-all duration-300 hover:scale-105',
          view !== 'feed' &&
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
          view !== 'waterfall' &&
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
          view !== 'grid' &&
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

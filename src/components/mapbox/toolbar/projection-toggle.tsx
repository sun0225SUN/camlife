'use client'

import { Map as MapIcon, Rotate3d } from 'lucide-react'
import { useCallback } from 'react'
import { cn } from '@/lib/utils'

interface ProjectionToggleProps {
  isGlobe: boolean
  setIsGlobe: (isGlobe: boolean) => void
  disabled?: boolean
}

export function ProjectionToggle({
  isGlobe,
  setIsGlobe,
  disabled = false,
}: ProjectionToggleProps) {
  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsGlobe(!isGlobe)
    }
  }, [isGlobe, setIsGlobe, disabled])

  return (
    <button
      type='button'
      onClick={handleToggle}
      disabled={disabled}
      className='cursor-pointer'
    >
      <Rotate3d
        size={22}
        strokeWidth={2.25}
        absoluteStrokeWidth
        className={cn(isGlobe ? 'block' : 'hidden')}
      />
      <MapIcon
        size={22}
        strokeWidth={2.25}
        absoluteStrokeWidth
        className={cn(!isGlobe ? 'block' : 'hidden')}
      />
    </button>
  )
}

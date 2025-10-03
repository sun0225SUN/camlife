'use client'

import { CirclePause, CirclePlay } from 'lucide-react'

interface RotateToggleProps {
  isRotating: boolean
  setIsRotating: (isRotating: boolean) => void
}

export function RotateToggle({ isRotating, setIsRotating }: RotateToggleProps) {
  return (
    <button
      type='button'
      onClick={() => setIsRotating(!isRotating)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setIsRotating(!isRotating)
        }
      }}
      tabIndex={0}
      aria-label='Rotate map'
    >
      {isRotating ? (
        <CirclePause
          className='cursor-pointer'
          size={22}
          strokeWidth={2.25}
          absoluteStrokeWidth
        />
      ) : (
        <CirclePlay
          className='cursor-pointer'
          size={22}
          strokeWidth={2.25}
          absoluteStrokeWidth
        />
      )}
    </button>
  )
}

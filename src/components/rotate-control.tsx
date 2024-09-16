"use client"

import { CirclePause, CirclePlay } from "lucide-react"

interface RotateControlProps {
  isRotating: boolean
  setIsRotating: (isRotating: boolean) => void
}

export function RotateControl({
  isRotating,
  setIsRotating,
}: RotateControlProps) {
  return (
    <div onClick={() => setIsRotating(!isRotating)}>
      {isRotating ? (
        <CirclePause
          className="cursor-pointer"
          size={22}
          strokeWidth={2.25}
          absoluteStrokeWidth
        />
      ) : (
        <CirclePlay
          className="cursor-pointer"
          size={22}
          strokeWidth={2.25}
          absoluteStrokeWidth
        />
      )}
    </div>
  )
}

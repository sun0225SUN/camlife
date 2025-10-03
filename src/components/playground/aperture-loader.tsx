'use client'

import { useEffect, useRef } from 'react'

interface ApertureLoaderProps {
  size?: number
  className?: string
  color?: string
  backgroundColor?: string
  duration?: number
}

export function ApertureLoader({
  size = 100,
  className = '',
  color = '#FFFFFF',
  backgroundColor = '#202430',
  duration = 3000,
}: ApertureLoaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const style = document.createElement('style')
    style.textContent = `
      @keyframes aperture-1 {
        0% { border-right-color: ${backgroundColor}; }
        5% { border-right-color: ${color}; }
        10% { border-right-color: ${backgroundColor}; }
        60% { border-right-color: ${backgroundColor}; }
        75% { border-right-color: ${color}; }
        90% { border-right-color: ${backgroundColor}; }
        100% { border-right-color: ${backgroundColor}; }
      }
      @keyframes aperture-2 {
        0% { border-right-color: ${backgroundColor}; }
        5% { border-right-color: ${backgroundColor}; }
        10% { border-right-color: ${color}; }
        15% { border-right-color: ${backgroundColor}; }
        60% { border-right-color: ${backgroundColor}; }
        75% { border-right-color: ${color}; }
        90% { border-right-color: ${backgroundColor}; }
        100% { border-right-color: ${backgroundColor}; }
      }
      @keyframes aperture-3 {
        0% { border-right-color: ${backgroundColor}; }
        10% { border-right-color: ${backgroundColor}; }
        15% { border-right-color: ${color}; }
        20% { border-right-color: ${backgroundColor}; }
        60% { border-right-color: ${backgroundColor}; }
        75% { border-right-color: ${color}; }
        90% { border-right-color: ${backgroundColor}; }
        100% { border-right-color: ${backgroundColor}; }
      }
      @keyframes aperture-4 {
        0% { border-right-color: ${backgroundColor}; }
        15% { border-right-color: ${backgroundColor}; }
        20% { border-right-color: ${color}; }
        25% { border-right-color: ${backgroundColor}; }
        60% { border-right-color: ${backgroundColor}; }
        75% { border-right-color: ${color}; }
        90% { border-right-color: ${backgroundColor}; }
        100% { border-right-color: ${backgroundColor}; }
      }
      @keyframes aperture-5 {
        0% { border-right-color: ${backgroundColor}; }
        20% { border-right-color: ${backgroundColor}; }
        25% { border-right-color: ${color}; }
        30% { border-right-color: ${backgroundColor}; }
        60% { border-right-color: ${backgroundColor}; }
        75% { border-right-color: ${color}; }
        90% { border-right-color: ${backgroundColor}; }
        100% { border-right-color: ${backgroundColor}; }
      }
      @keyframes aperture-6 {
        0% { border-right-color: ${backgroundColor}; }
        25% { border-right-color: ${backgroundColor}; }
        30% { border-right-color: ${color}; }
        35% { border-right-color: ${backgroundColor}; }
        60% { border-right-color: ${backgroundColor}; }
        75% { border-right-color: ${color}; }
        90% { border-right-color: ${backgroundColor}; }
        100% { border-right-color: ${backgroundColor}; }
      }
      @keyframes aperture-7 {
        0% { border-right-color: ${backgroundColor}; }
        30% { border-right-color: ${backgroundColor}; }
        35% { border-right-color: ${color}; }
        40% { border-right-color: ${backgroundColor}; }
        60% { border-right-color: ${backgroundColor}; }
        75% { border-right-color: ${color}; }
        90% { border-right-color: ${backgroundColor}; }
        100% { border-right-color: ${backgroundColor}; }
      }
      @keyframes aperture-8 {
        0% { border-right-color: ${backgroundColor}; }
        35% { border-right-color: ${backgroundColor}; }
        40% { border-right-color: ${color}; }
        45% { border-right-color: ${backgroundColor}; }
        60% { border-right-color: ${backgroundColor}; }
        75% { border-right-color: ${color}; }
        90% { border-right-color: ${backgroundColor}; }
        100% { border-right-color: ${backgroundColor}; }
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [color, backgroundColor])

  const apertureSize = size
  const triangleSize = apertureSize / 2

  return (
    <div
      ref={containerRef}
      className={`aperture-loader ${className}`}
      style={{
        width: apertureSize,
        height: apertureSize,
        margin: '0 auto',
        padding: 0,
        display: 'block',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: '50%',
      }}
    >
      {/* First group of sectors */}
      <span
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          margin: 0,
          padding: 0,
          content: '""',
          display: 'block',
          borderStyle: 'solid',
          borderWidth: `0 ${triangleSize}px ${triangleSize}px 0`,
          borderColor: `transparent ${backgroundColor} transparent transparent`,
          top: -triangleSize * 0.25,
          left: apertureSize * 0.2,
          transform: 'rotate(-10deg)',
          animation: `aperture-1 ${duration}ms linear 0ms infinite normal forwards running`,
        }}
      />
      <span
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          margin: 0,
          padding: 0,
          content: '""',
          display: 'block',
          borderStyle: 'solid',
          borderWidth: `0 ${triangleSize}px ${triangleSize}px 0`,
          borderColor: `transparent ${backgroundColor} transparent transparent`,
          top: triangleSize * 0.05,
          left: -triangleSize * 0.14,
          transform: 'rotate(-56deg)',
          animation: `aperture-2 ${duration}ms linear 0ms infinite normal forwards running`,
        }}
      />

      {/* Second group of sectors */}
      <span
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          margin: 0,
          padding: 0,
          content: '""',
          display: 'block',
          borderStyle: 'solid',
          borderWidth: `0 ${triangleSize}px ${triangleSize}px 0`,
          borderColor: `transparent ${backgroundColor} transparent transparent`,
          top: apertureSize * 0.32,
          left: -triangleSize * 0.28,
          transform: 'rotate(-100deg)',
          animation: `aperture-3 ${duration}ms linear 0ms infinite normal forwards running`,
        }}
      />
      <span
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          margin: 0,
          padding: 0,
          content: '""',
          display: 'block',
          borderStyle: 'solid',
          borderWidth: `0 ${triangleSize}px ${triangleSize}px 0`,
          borderColor: `transparent ${backgroundColor} transparent transparent`,
          top: apertureSize * 0.58,
          left: triangleSize * 0.04,
          transform: 'rotate(-146deg)',
          animation: `aperture-4 ${duration}ms linear 0ms infinite normal forwards running`,
        }}
      />

      {/* Third group of sectors */}
      <span
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          margin: 0,
          padding: 0,
          content: '""',
          display: 'block',
          borderStyle: 'solid',
          borderWidth: `0 ${triangleSize}px ${triangleSize}px 0`,
          borderColor: `transparent ${backgroundColor} transparent transparent`,
          top: apertureSize * 0.645,
          left: apertureSize * 0.32,
          transform: 'rotate(-191deg)',
          animation: `aperture-5 ${duration}ms linear 0ms infinite normal forwards running`,
        }}
      />
      <span
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          margin: 0,
          padding: 0,
          content: '""',
          display: 'block',
          borderStyle: 'solid',
          borderWidth: `0 ${triangleSize}px ${triangleSize}px 0`,
          borderColor: `transparent ${backgroundColor} transparent transparent`,
          top: apertureSize * 0.485,
          left: apertureSize * 0.58,
          transform: 'rotate(-236deg)',
          animation: `aperture-6 ${duration}ms linear 0ms infinite normal forwards running`,
        }}
      />

      {/* Fourth group of sectors */}
      <span
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          margin: 0,
          padding: 0,
          content: '""',
          display: 'block',
          borderStyle: 'solid',
          borderWidth: `0 ${triangleSize}px ${triangleSize}px 0`,
          borderColor: `transparent ${backgroundColor} transparent transparent`,
          top: apertureSize * 0.19,
          left: apertureSize * 0.65,
          transform: 'rotate(-280deg)',
          animation: `aperture-7 ${duration}ms linear 0ms infinite normal forwards running`,
        }}
      />
      <span
        style={{
          position: 'absolute',
          width: 0,
          height: 0,
          margin: 0,
          padding: 0,
          content: '""',
          display: 'block',
          borderStyle: 'solid',
          borderWidth: `0 ${triangleSize}px ${triangleSize}px 0`,
          borderColor: `transparent ${backgroundColor} transparent transparent`,
          top: -triangleSize * 0.14,
          left: apertureSize * 0.49,
          transform: 'rotate(-325deg)',
          animation: `aperture-8 ${duration}ms linear 0ms infinite normal forwards running`,
        }}
      />
    </div>
  )
}

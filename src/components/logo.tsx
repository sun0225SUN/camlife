'use client'

import confetti from 'canvas-confetti'
import { Abril_Fatface as FontLogo } from 'next/font/google'
import CamlifeLogo from '@/assets/images/logo.svg'
import { Pointer } from '@/components/ui/pointer'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
}

const fontLogo = FontLogo({
  subsets: ['latin'],
  variable: '--font-logo',
  weight: '400',
  display: 'swap',
  adjustFontFallback: false,
})

export function Logo({ className }: { className?: string }) {
  return (
    <div className='flex h-16 items-center gap-2 font-bold text-4xl'>
      <CamlifeLogo className={className} />
      <div className={cn(fontLogo.className, 'flex-shrink-0 tracking-wide')}>
        CamLife
      </div>
    </div>
  )
}

export function LogoWithConfetti({ className }: LogoProps) {
  const handleClick = () => {
    const duration = 5 * 1000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    const randomInRange = (min: number, max: number) =>
      Math.random() * (max - min) + min

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        return clearInterval(interval)
      }

      const particleCount = 50 * (timeLeft / duration)
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }, 250)
  }

  return (
    <div className={cn('relative', className)}>
      <Pointer>
        <div className='text-2xl'>👆</div>
      </Pointer>
      <CamlifeLogo
        className='size-16 transition-all duration-300 hover:rotate-45 hover:scale-105'
        onClick={handleClick}
      />
    </div>
  )
}

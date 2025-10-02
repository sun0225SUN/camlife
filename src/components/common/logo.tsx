'use client'

import CamlifeLogo from '@/assets/images/logo.svg'
import { Pointer } from '@/components/ui/pointer'
import { fontLogo } from '@/fonts'
import { useConfetti } from '@/hooks/use-confetti'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <div className='flex h-16 items-center gap-2 font-bold text-4xl'>
      <CamlifeLogo
        className={cn(
          'size-13 cursor-pointer transition-all duration-300 hover:rotate-45 hover:scale-105',
          className,
        )}
      />
      <div className={cn(fontLogo.className, 'flex-shrink-0 tracking-wide')}>
        CamLife
      </div>
    </div>
  )
}

export function LogoWithConfetti() {
  const { playConfetti2 } = useConfetti()

  return (
    <div className='flex justify-center'>
      <div className='relative'>
        <Pointer>
          <span className='text-2xl'>👆</span>
        </Pointer>
        <CamlifeLogo
          className='size-13 transition-all duration-300 hover:rotate-45 hover:scale-105'
          onClick={playConfetti2}
        />
      </div>
    </div>
  )
}

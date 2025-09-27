import type { ReactNode } from 'react'
import { LogoWithConfetti } from '@/components/logo'
import { Card, CardContent } from '@/components/ui/card'
import { DotPattern } from '@/components/ui/dot-pattern'
import { GlowingEffect } from '@/components/ui/glowing-effect'
import { cn } from '@/lib/utils'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className='relative'>
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          '[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]',
        )}
      />
      <div className='flex h-screen flex-col items-center justify-center pb-20'>
        <div className='w-full max-w-sm space-y-6'>
          <LogoWithConfetti className='flex flex-col items-center' />

          <Card className='relative border-none p-10'>
            <CardContent className='px-0!'>{children}</CardContent>

            <GlowingEffect
              spread={40}
              glow={true}
              disabled={false}
              proximity={64}
              inactiveZone={0.01}
              className='z-10'
            />
          </Card>
        </div>
      </div>
    </div>
  )
}

import type { ReactNode } from 'react'
import { LogoWithConfetti } from '@/components/logo'
import { DotPattern } from '@/components/ui/dot-pattern'
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
        <div className='w-full max-w-sm space-y-4'>
          <LogoWithConfetti className='flex flex-col items-center' />
          {children}
        </div>
      </div>
    </div>
  )
}

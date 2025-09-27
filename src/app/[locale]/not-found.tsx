import { MorphingText } from '@/components/ui/morphing-text'
import { Spotlight } from '@/components/ui/spotlight'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <div className='relative flex h-screen w-full items-center justify-center overflow-hidden rounded-md bg-black/[0.96] antialiased'>
      <div
        className={cn(
          'pointer-events-none absolute inset-0 select-none [background-size:40px_40px]',
          '[background-image:linear-gradient(to_right,#171717_1px,transparent_1px),linear-gradient(to_bottom,#171717_1px,transparent_1px)]',
        )}
      />
      <Spotlight
        className='-top-40 md:-top-20 left-0 md:left-60'
        fill='white'
      />
      <div className='relative z-10 mx-auto w-full max-w-7xl p-4'>
        <div className='flex flex-col items-center justify-center'>
          <MorphingText texts={['404', 'Page Not Found']} />
        </div>
      </div>
    </div>
  )
}

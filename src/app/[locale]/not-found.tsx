import { Eye } from '@/components/common/eye'
import { MorphingText } from '@/components/ui/morphing-text'
import { Spotlight } from '@/components/ui/spotlight'
import { cn } from '@/lib/utils'

export default function NotFound() {
  return (
    <div
      className='relative flex min-h-screen items-center justify-center'
      style={{
        backgroundColor: 'oklch(0.145 0 0)',
        color: 'oklch(0.985 0 0)',
      }}
    >
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
      <div className='flex w-full flex-col items-center justify-center gap-20 px-4'>
        <Eye />
        <MorphingText texts={['404', 'Page Not Found']} />
      </div>
    </div>
  )
}

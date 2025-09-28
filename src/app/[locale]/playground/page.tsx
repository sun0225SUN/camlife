import { ApertureAnimation } from '@/components/playground/aperture-animation'
import { ThemeToggle } from '@/components/theme/toggle'

export default function Playground() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-background'>
      <div className='absolute top-8 left-8'>
        <ThemeToggle />
      </div>
      <ApertureAnimation
        size={200}
        showPercentage={true}
        className='text-center'
      />
    </div>
  )
}

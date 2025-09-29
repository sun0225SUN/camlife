import Link from 'next/link'
import CamlifeLogo from '@/assets/images/logo.svg'
import { Logo } from '@/components/logo'
import { useSidebar } from '@/components/ui/sidebar'
import { cn } from '@/lib/utils'
import { DEFAULT_DASHBOARD_PAGE } from '@/routes'

export function NavLogo() {
  const { open } = useSidebar()
  return (
    <Link href={DEFAULT_DASHBOARD_PAGE}>
      <div className='relative flex items-center justify-center overflow-hidden border-b pb-2'>
        <div
          className={cn(
            'transition-all duration-300 ease-in-out',
            open
              ? 'translate-x-0 scale-100 opacity-100'
              : '-translate-x-2 absolute scale-75 opacity-0',
          )}
        >
          <Logo className='size-12' />
        </div>
        <div
          className={cn(
            'transition-all duration-300 ease-in-out',
            open
              ? 'absolute translate-x-2 scale-75 opacity-0'
              : 'translate-x-0 scale-100 opacity-100',
          )}
        >
          <CamlifeLogo className='size-6' />
        </div>
      </div>
    </Link>
  )
}

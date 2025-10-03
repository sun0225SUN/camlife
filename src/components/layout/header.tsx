import { Logo } from '@/components/common/logo'
import { ToolBar } from '@/components/toolbar'

export function Header() {
  return (
    <div className='mt-8 flex w-full items-center justify-center px-4 md:mt-12 md:justify-between md:px-12 xl:px-48'>
      <Logo className='size-8 md:size-10' />
      <ToolBar />
    </div>
  )
}

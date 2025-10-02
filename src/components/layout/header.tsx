import { Logo } from '@/components/common/logo'
import { ToolBar, ToolsBarMobile } from '@/components/tooolbar/toolbar'

export function Header() {
  return (
    <div className='mt-12 flex w-full items-center justify-center md:justify-between md:px-12 xl:px-48'>
      <Logo className='size-10' />
      <ToolBar />
      <ToolsBarMobile />
    </div>
  )
}

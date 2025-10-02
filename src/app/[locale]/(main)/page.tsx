import { Header } from '@/components/home/header'
import { ToolsBarMobile } from '@/components/home/toolbar'

export default function HomePage() {
  return (
    <div className='flex flex-col items-center'>
      <Header />
      <ToolsBarMobile />
    </div>
  )
}

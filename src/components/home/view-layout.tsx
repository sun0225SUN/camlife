import { Header } from '@/components/home/header'
import { ViewTabs } from '@/components/home/view-tabs'

export function ViewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col items-center'>
      <Header />
      <ViewTabs />
      {children}
    </div>
  )
}

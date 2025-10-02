import { Header } from '@/components/layout/header'
import { ViewTabs } from '@/components/tooolbar/view-tabs'

export function BaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col items-center'>
      <Header />
      <ViewTabs />
      {children}
    </div>
  )
}

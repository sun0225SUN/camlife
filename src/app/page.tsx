import { Bear } from '@/components/bear'
import { ThemeToggle } from '@/components/theme/toggle'

export default async function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-10'>
      <ThemeToggle />
      <h1 className='font-bold text-2xl'>Hello World</h1>
      <Bear />
    </main>
  )
}

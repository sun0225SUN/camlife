import { getTranslations } from 'next-intl/server'
import { Bear } from '@/components/bear'
import { LanguageToggle } from '@/components/language/toggle'
import { ThemeToggle } from '@/components/theme/toggle'

export default async function Home() {
  const t = await getTranslations('HomePage')
  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-10'>
      <ThemeToggle />
      <h1 className='font-bold text-2xl'>{t('title')}</h1>
      <LanguageToggle />
      <Bear />
    </main>
  )
}

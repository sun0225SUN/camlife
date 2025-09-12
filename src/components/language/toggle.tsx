'use client'

import { useParams } from 'next/navigation'
import { type Locale, useLocale, useTranslations } from 'next-intl'
import { useTransition } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

export function LanguageToggle() {
  const t = useTranslations('Language')

  const locale = useLocale()

  const router = useRouter()
  const [, startTransition] = useTransition()
  const pathname = usePathname()

  const params = useParams()

  const onSelectChange = (locale: Locale) => {
    startTransition(() => {
      router.replace(
        // @ts-expect-error -- TypeScript will validate that only known `params`
        // are used in combination with a given `pathname`. Since the two will
        // always match for the current route, we can skip runtime checks.
        { pathname, params },
        { locale },
      )
    })
  }

  return (
    <Select
      onValueChange={onSelectChange}
      defaultValue={locale}
    >
      <SelectTrigger className='w-[180px]'>
        <SelectValue placeholder={t(locale)} />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((locale) => (
          <SelectItem
            key={locale}
            value={locale}
            className='cursor-pointer'
          >
            {t(locale)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

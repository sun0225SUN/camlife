'use client'

import { useTranslations } from 'next-intl'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useLanguageToggle } from '@/hooks/use-language-toggle'
import { routing } from '@/i18n/routing'

export function LanguageToggle() {
  const t = useTranslations('Language')
  const { locale, onSelectChange } = useLanguageToggle()

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

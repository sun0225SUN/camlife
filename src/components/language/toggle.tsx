'use client'

import { Check, Globe } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useLanguageToggle } from '@/hooks/use-language-toggle'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'

interface LanguageToggleProps {
  className?: string
}

export function LanguageToggle({ className }: LanguageToggleProps) {
  const t = useTranslations('language')
  const { locale: currentLocale, onSelectChange } = useLanguageToggle()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <PopoverTrigger asChild>
        <Globe
          className={cn(
            'size-6 cursor-pointer',
            // when popover is open, disable hover scale effect to prevent jitter
            !isOpen && className,
          )}
          strokeWidth={2}
          absoluteStrokeWidth
        />
      </PopoverTrigger>
      <PopoverContent
        className='w-36 border-none bg-white/80 p-1 shadow-lg backdrop-blur-md dark:bg-black/80'
        align='end'
        sideOffset={8}
      >
        <div className='space-y-1'>
          {routing.locales.map((locale) => (
            <Button
              key={locale}
              variant='ghost'
              size='sm'
              onClick={() => onSelectChange(locale)}
              className={cn(
                'w-full cursor-pointer justify-between font-normal text-sm focus-visible:border-none focus-visible:ring-0',
                locale === currentLocale && 'bg-accent dark:bg-accent/50',
              )}
            >
              {t(locale)}
              {locale === currentLocale && <Check className='size-4' />}
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}

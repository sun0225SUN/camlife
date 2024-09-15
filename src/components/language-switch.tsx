"use client"

import clsx from "clsx"
import { Check, Globe } from "lucide-react"
import { useLocale } from "next-intl"
import Flag from "react-world-flags"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { locales, nameMap } from "~/i18n"

export function LanguageSwitch() {
  const currentLocale = useLocale()

  const handleLocaleChange = (locale: string) => {
    if (locale === currentLocale) return
    document.cookie = `NEXT_LOCALE=${locale};`
    window.location.reload()
  }

  return (
    <Popover>
      <PopoverTrigger>
        <Globe
          className="cursor-pointer"
          size={22}
          strokeWidth={2.25}
          absoluteStrokeWidth
        />
      </PopoverTrigger>
      <PopoverContent className="z-[99] mb-5 flex w-36 flex-col rounded-lg border-none bg-white/20 p-0 text-sm shadow-lg backdrop-blur-md dark:bg-black/20 md:mt-5">
        {locales.map((locale, index) => (
          <div
            key={locale}
            onClick={() => handleLocaleChange(locale)}
            className={clsx(
              "flex cursor-pointer items-center justify-between gap-2 px-3 py-2 transition-colors duration-200 hover:bg-gray-100/60 dark:hover:bg-[rgba(36,36,36,0.6)]/60",
              index === 0
                ? "hover:rounded-t-md"
                : index === locales.length - 1 && "hover:rounded-b-md",
            )}
          >
            <div className="flex items-center gap-2">
              <Flag
                code={locale === "zh" ? "CN" : "US"}
                width="24"
                height="24"
                className="rounded"
              />
              {nameMap[locale]}
            </div>
            {currentLocale === locale && (
              <Check size={16} strokeWidth={2.25} absoluteStrokeWidth />
            )}
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}

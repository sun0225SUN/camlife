"use client"

import { useClickAway } from "@uidotdev/usehooks"
import clsx from "clsx"
import { Check, Globe } from "lucide-react"
import { useLocale } from "next-intl"
import { useCallback, useState, type RefObject } from "react"
import Flag from "react-world-flags"
import { locales, nameMap } from "~/i18n"

export function LanguageSwitch() {
  const [showList, setShowList] = useState<boolean>(false)

  const currentLocale = useLocale()

  const ref = useClickAway((event: Event) => {
    if (!(event.target as HTMLElement).closest(".globe-icon")) {
      setShowList(false)
    }
  }) as RefObject<HTMLDivElement>

  const handleLocaleChange = useCallback((locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale};`
    window.location.reload()
  }, [])

  const toggleList = useCallback(() => {
    setShowList((prev) => !prev)
  }, [])

  return (
    <div className="flex justify-center">
      <div className="relative inline-block">
        <Globe
          className="globe-icon cursor-pointer"
          size={22}
          strokeWidth={2.25}
          absoluteStrokeWidth
          onClick={toggleList}
        />
        {showList && (
          <div
            ref={ref}
            className="absolute right-0 z-10 mt-5 w-36 rounded-lg border border-gray-100 bg-white text-sm shadow-lg dark:border-[#24242499] dark:bg-[#0f0f10]"
          >
            <ul className="flex flex-col">
              {locales.map((locale, index) => (
                <li
                  key={locale}
                  onClick={() => handleLocaleChange(locale)}
                  className={clsx(
                    "flex cursor-pointer select-none items-center justify-between gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#3e3e3e]",
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
                      className="rounded-[3px]"
                    />
                    {nameMap[locale]}
                  </div>
                  <Check
                    className={currentLocale !== locale ? "hidden" : ""}
                    size={16}
                    strokeWidth={2.25}
                    absoluteStrokeWidth
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

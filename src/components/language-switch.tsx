"use client"

import { useClickAway } from "@uidotdev/usehooks"
import clsx from "clsx"
import { Languages } from "lucide-react"
import { useCallback, useState, type RefObject } from "react"
import Flag from "react-world-flags"
import { locales, nameMap } from "~/i18n"

export function LanguageSwitch() {
  const [showList, setShowList] = useState<boolean>(false)

  const ref = useClickAway(() => {
    setShowList(false)
  }) as RefObject<HTMLDivElement>

  const handleLocaleChange = useCallback((locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale};`
    window.location.reload()
  }, [])

  const toggleList = useCallback(() => {
    setShowList((prevShowList) => !prevShowList)
  }, [])

  return (
    <div className="flex justify-center">
      <div className="relative inline-block">
        <Languages
          className="size-[1.3rem] cursor-pointer"
          onClick={toggleList}
        />
        {showList && (
          <div
            ref={ref}
            className="absolute right-0 z-10 mt-2 w-36 rounded-lg border border-gray-100 bg-white text-left text-sm shadow-lg dark:border-[#24242499] dark:bg-[#0f0f10]"
          >
            <ul>
              {locales.map((locale, index) => (
                <li key={locale} onClick={() => handleLocaleChange(locale)}>
                  <div
                    className={clsx(
                      "flex w-full cursor-pointer select-none items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#3e3e3e]",
                      index === 0
                        ? "hover:rounded-t-md"
                        : index === locales.length - 1
                          ? "hover:rounded-b-md"
                          : "",
                    )}
                  >
                    <Flag
                      code={locale === "zh" ? "CN" : "US"}
                      width="24"
                      height="24"
                      className="rounded-[3px]"
                    />
                    {nameMap[locale]}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

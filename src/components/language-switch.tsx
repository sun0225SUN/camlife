"use client"

import { useClickAway } from "@uidotdev/usehooks"
import clsx from "clsx"
import { Languages } from "lucide-react"
import { useState } from "react"
import Flag from "react-world-flags"
import { locales, nameMap } from "~/i18n"

export function LanguageSwitch() {
  const [showList, setShowList] = useState<boolean>(false)

  const ref = useClickAway(() => {
    setShowList(false)
  })

  const handleLocaleChange = (locale: string) => {
    document.cookie = `NEXT_LOCALE=${locale};`
    window.location.reload()
  }

  return (
    <div className="flex justify-center">
      <div className="relative inline-block">
        <Languages
          className="size-[1.5rem] cursor-pointer"
          onClick={() => setShowList((prevShowList) => !prevShowList)}
        />
        {showList && (
          <div
            // eslint-disable-next-line
            // @ts-ignore
            ref={ref}
            className="absolute left-0 z-10 mt-2 w-36 rounded-lg border border-gray-100 bg-white text-left text-sm shadow-lg dark:border-[#24242499] dark:bg-[#0f0f10]"
          >
            {locales.map((locale, index) => (
              <div key={index} onClick={() => handleLocaleChange(locale)}>
                <div className="flex flex-col">
                  <div
                    className={clsx(
                      "flex w-full cursor-pointer select-none items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-[#3e3e3e]",
                      index === 0 ? "hover:rounded-t-md" : "hover:rounded-b-md",
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

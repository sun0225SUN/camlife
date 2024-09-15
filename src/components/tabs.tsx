"use client"

import clsx from "clsx"
import { useLocale, useTranslations } from "next-intl"
import {
  Lora as FontTabsEN,
  Noto_Serif_SC as FontTabsZH,
} from "next/font/google"
import { useScroll } from "~/hooks/useScroll"
import { useTab } from "~/store/useTab"

const fontTabsZH = FontTabsZH({
  subsets: ["latin"],
  variable: "--font-tabs-zh",
  weight: ["500", "200", "300", "400", "600", "700", "900"],
  display: "swap",
  adjustFontFallback: false,
})

const fontTabsEN = FontTabsEN({
  subsets: ["latin"],
  variable: "--font-tabs-en",
  weight: ["400", "500", "600", "700"],
  display: "swap",
  adjustFontFallback: false,
})

export function Tabs() {
  const t = useTranslations("HomeTabs")
  const locale = useLocale()
  const isScrolled = useScroll(132)
  const { tab, setTab } = useTab()

  const tabsConfig: { tab: string; label: string }[] = [
    {
      tab: "essential",
      label: t("essential"),
    },
    {
      tab: "recent",
      label: t("recent"),
    },
    {
      tab: "shuffle",
      label: t("shuffle"),
    },
    {
      tab: "nearby",
      label: t("nearby"),
    },
    {
      tab: "faraway",
      label: t("faraway"),
    },
  ]

  return (
    <div
      className={clsx(
        "z-[98] my-5 flex h-16 w-full items-center justify-between bg-white px-6 dark:bg-black md:justify-start md:gap-5 md:px-12 xl:px-48",
        locale === "zh"
          ? fontTabsZH.className + " text-lg md:text-2xl"
          : fontTabsEN.className + " text-sm font-normal md:text-2xl",
        isScrolled &&
          "sticky top-0 h-16 bg-opacity-60 shadow-md backdrop-blur-md transition-all duration-500 ease-in-out dark:bg-opacity-60 dark:shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1)]",
      )}
    >
      {tabsConfig.map((item) => (
        <div
          key={item.tab}
          className={clsx(
            "cursor-pointer",
            item.tab !== tab && "opacity-30 hover:opacity-80",
          )}
          onClick={() => {
            setTab(item.tab)
            window.scrollTo({ top: 0 })
          }}
        >
          {item.label}
        </div>
      ))}
    </div>
  )
}

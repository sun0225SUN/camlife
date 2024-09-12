"use client"

import clsx from "clsx"
import { useLocale, useTranslations } from "next-intl"
import {
  Lora as FontTabsEN,
  Noto_Serif_SC as FontTabsZH,
} from "next/font/google"
import { useScroll } from "~/hooks/useScroll"

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
  const isScrolled = useScroll(128)

  return (
    <div
      className={clsx(
        "z-10 my-4 flex h-16 w-full items-center justify-between bg-white px-6 dark:bg-black md:justify-start md:gap-5 md:px-32",
        locale === "zh"
          ? fontTabsZH.className + " text-lg md:text-2xl"
          : fontTabsEN.className + " text-sm font-normal md:text-2xl",
        isScrolled &&
          "sticky top-0 h-16 bg-opacity-60 shadow-md backdrop-blur-md transition-all duration-500 ease-in-out dark:bg-opacity-60 dark:shadow-[0_4px_6px_-1px_rgba(255,255,255,0.1)]",
      )}
    >
      <div className="cursor-pointer">{t("essential")}</div>
      <div className="cursor-pointer">{t("recent")}</div>
      <div className="cursor-pointer">{t("shuffle")}</div>
      <div className="cursor-pointer">{t("nearby")}</div>
      <div className="cursor-pointer">{t("faraway")}</div>
    </div>
  )
}

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
  weight: "500",
})

const fontTabsEN = FontTabsEN({
  subsets: ["latin"],
  variable: "--font-tabs-en",
  weight: "500",
})

export function Tabs() {
  const t = useTranslations("HomeTabs")
  const locale = useLocale()
  const isScrolled = useScroll(128)

  return (
    <div
      className={clsx(
        "my-4 flex h-16 w-full items-center justify-between bg-white px-8 text-xl dark:bg-black md:justify-start md:gap-5 md:px-32 md:text-2xl",
        locale === "zh" ? fontTabsZH.className : fontTabsEN.className,
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

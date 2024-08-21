"use client"

import { Languages } from "lucide-react"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "~/components/ui/menubar"
import { locales, nameMap } from "~/i18n"

export function LanguageSwitch() {
  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger className="cursor-pointer p-1">
          <Languages className="size-[1.2rem]" />
        </MenubarTrigger>
        <MenubarContent>
          {locales.map((locale, index) => (
            <div
              key={index}
              onClick={() => {
                document.cookie = `NEXT_LOCALE=${locale};`
                window.location.reload()
              }}
            >
              <MenubarItem>{nameMap[locale]}</MenubarItem>
              {index === 0 && <MenubarSeparator />}
            </div>
          ))}
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}

import { useTranslations } from "next-intl"
import Logo from "~/assets/images/logo.svg"
import { LanguageSwitch } from "~/components/language-switch"
import { ModeToggle } from "~/components/mode-toggle"
import { HydrateClient } from "~/trpc/server"

export default function Home() {
  const t = useTranslations("HomePage")

  return (
    <HydrateClient>
      <div className="mt-10 flex flex-col items-center justify-center gap-10">
        <h1>{t("title")}</h1>
        <div className="flex gap-5">
          <ModeToggle />
          <LanguageSwitch />
        </div>
        <Logo
          className="text-black dark:text-white"
          width="100px"
          height="100px"
        />
      </div>
    </HydrateClient>
  )
}

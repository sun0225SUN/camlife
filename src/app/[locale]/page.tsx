import Logo from "~/assets/images/logo.svg"
import { LanguageSwitch } from "~/components/language-switch"
import { LoginTip } from "~/components/login-tip"
import { ModeToggle } from "~/components/mode-toggle"
import { HydrateClient } from "~/trpc/server"

export default function Home() {
  return (
    <HydrateClient>
      <div className="mt-10 flex flex-col items-center justify-center gap-10">
        <LoginTip />
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

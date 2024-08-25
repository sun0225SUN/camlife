import { Header } from "~/components/header"
import { LoginTip } from "~/components/login-tip"
import { HydrateClient } from "~/trpc/server"

export default function Home() {
  return (
    <HydrateClient>
      <div className="flex flex-col items-center justify-center">
        <Header />
        <LoginTip />
      </div>
    </HydrateClient>
  )
}

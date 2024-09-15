import { Header } from "~/components/header"
import { Tabs } from "~/components/tabs"
import { View } from "~/components/view"
import { HydrateClient } from "~/trpc/server"

export default function HomePage() {
  return (
    <HydrateClient>
      <div className="flex flex-col items-center">
        <Header />
        <Tabs />
        <View />
      </div>
    </HydrateClient>
  )
}

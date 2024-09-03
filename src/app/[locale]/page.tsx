import { Header } from "~/components/header"
import { View } from "~/components/view"
import { HydrateClient } from "~/trpc/server"

export default function HomePage() {
  return (
    <HydrateClient>
      <div className="flex flex-col items-center justify-center">
        <Header />
        <View />
      </div>
    </HydrateClient>
  )
}

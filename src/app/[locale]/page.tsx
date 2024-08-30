import { Header } from "~/components/header"
import { Images } from "~/components/images"
import { HydrateClient } from "~/trpc/server"

export default function HomePage() {
  return (
    <HydrateClient>
      <div className="flex flex-col items-center justify-center">
        <Header />
        <Images />
      </div>
    </HydrateClient>
  )
}

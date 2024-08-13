import { ModeToggle } from "~/components/mode-toggle"
import { HydrateClient } from "~/trpc/server"

export default async function Home() {
  return (
    <HydrateClient>
      <div className="flex justify-center mt-10">
        <ModeToggle />
      </div>
    </HydrateClient>
  )
}

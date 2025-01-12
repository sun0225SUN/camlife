import { Metadata } from "next"
import { Header } from "~/components/header"
import { Tabs } from "~/components/tabs"
import { View } from "~/components/view"

export const metadata: Metadata = {
  title: "CamLife",
  description: "Capture Life through the Camera.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function HomePage() {
  return (
    <div className="flex flex-col items-center">
      <Header />
      <Tabs />
      <View />
    </div>
  )
}

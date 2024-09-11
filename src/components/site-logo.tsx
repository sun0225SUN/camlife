import clsx from "clsx"
import { Abril_Fatface as FontLogo } from "next/font/google"
import Link from "next/link"
import Logo from "~/assets/images/logo.svg"

const fontLogo = FontLogo({
  subsets: ["latin"],
  variable: "--font-logo",
  weight: "400",
  display: "swap",
  adjustFontFallback: false,
})

export function SiteLogo() {
  return (
    <Link href="/">
      <div
        className={clsx(
          "flex h-16 items-center gap-2 text-4xl font-bold",
          fontLogo.className,
        )}
      >
        <Logo className="size-[45px]" />
        <div className="flex-shrink-0 tracking-wide">CamLife</div>
      </div>
    </Link>
  )
}

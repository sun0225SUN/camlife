import clsx from "clsx"
import { Abril_Fatface as FontLogo } from "next/font/google"
import Link from "next/link"
import Logo from "~/assets/images/logo.svg"

const fontLogo = FontLogo({
  subsets: ["latin"],
  variable: "--font-logo",
  weight: "400",
})

export function SiteLogo() {
  return (
    <Link href="/">
      <div
        className={clsx(
          "flex items-center gap-2 text-3xl font-bold text-black dark:text-white",
          fontLogo.className,
        )}
      >
        <Logo className="size-[40px]" />
        <div className="tracking-wide">CamLife</div>
      </div>
    </Link>
  )
}

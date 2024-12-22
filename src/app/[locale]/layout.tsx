import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { GeistSans } from "geist/font/sans"
import { type Metadata } from "next"
import { SessionProvider } from "next-auth/react"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "~/components/theme-provider"
import { routing } from "~/i18n/routing"
import { auth } from "~/server/auth"
import "~/styles/globals.css"
import { TRPCReactProvider } from "~/trpc/react"

export const metadata: Metadata = {
  title: "CamLife",
  description: "Capture Life through the Camera.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: Readonly<{ children: React.ReactNode; params: { locale: string } }>) {
  const session = await auth()
  const messages = await getMessages()

  // Ensure that the incoming `locale` is valid
  // eslint-disable-next-line
  if (!routing.locales.includes(locale as any)) {
    notFound()
  }

  return (
    <html
      lang={locale}
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          defer
          src="https://umami.guoqi.dev/script.js"
          data-website-id="e3df813a-bc42-4da9-af6d-664b0b56250d"
          data-domains="camlife.app"
        />
      </head>

      <body>
        <SessionProvider session={session}>
          <NextIntlClientProvider messages={messages}>
            <TRPCReactProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                <Toaster />
                <Analytics />
                <SpeedInsights />
              </ThemeProvider>
            </TRPCReactProvider>
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  )
}

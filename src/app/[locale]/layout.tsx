import { GeistSans } from "geist/font/sans"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { notFound } from "next/navigation"
import Script from "next/script"
import { Toaster } from "react-hot-toast"
import { ThemeProvider } from "~/components/theme-provider"
import { routing, type Locale } from "~/i18n/routing"
import "~/styles/globals.css"
import { TRPCReactProvider } from "~/trpc/react"

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  const messages = await getMessages()

  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }

  return (
    <html
      lang={locale}
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body>
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
            </ThemeProvider>
          </TRPCReactProvider>
        </NextIntlClientProvider>

        <Script
          defer
          src="https://umami.guoqi.dev/script.js"
          data-website-id="e3df813a-bc42-4da9-af6d-664b0b56250d"
          data-domains="camlife.app"
        />
      </body>
    </html>
  )
}

import { GeistSans } from "geist/font/sans"
import { type Metadata } from "next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages } from "next-intl/server"
import { ThemeProvider } from "~/components/theme-provider"
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
  const messages = await getMessages()

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
            </ThemeProvider>
          </TRPCReactProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

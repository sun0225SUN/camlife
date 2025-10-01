import '@/styles/globals.css'
import '@/styles/view-transition.css'

import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import NextTopLoader from 'nextjs-toploader'
import { ConsoleBanner } from '@/components/console-banner'
import { ThemeProvider } from '@/components/theme/provider'
import { Toaster } from '@/components/ui/sonner'
import { env } from '@/env'
import { routing } from '@/i18n/routing'
import { cn } from '@/lib/utils'
import { TRPCReactProvider } from '@/trpc/react'

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export const metadata: Metadata = {
  title: 'Camlife',
  description: 'Capture life through the Camera.',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

export default async function RootLayout({ children, params }: Props) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html
      lang={locale}
      className={cn(geist.variable)}
      suppressHydrationWarning
    >
      <body>
        <NextIntlClientProvider>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            <TRPCReactProvider>
              {children}
              <Toaster />
              <NextTopLoader />
              <ConsoleBanner />
            </TRPCReactProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
        <Script
          src={env.NEXT_PUBLIC_UMAMI_ANALYTICS_JS}
          strategy='beforeInteractive'
          data-website-id={env.NEXT_PUBLIC_UMAMI_ANALYTICS_ID}
        />
      </body>
    </html>
  )
}

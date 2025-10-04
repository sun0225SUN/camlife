import '@/styles/globals.css'
import '@/styles/view-transition.css'

import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { hasLocale, NextIntlClientProvider } from 'next-intl'
import NextTopLoader from 'nextjs-toploader'
import { Analytics } from '@/components/common/analytics'
import { CommandMenu } from '@/components/common/cmdk'
import { ConsoleBanner } from '@/components/common/console-banner'
import { ThemeProvider } from '@/components/theme/provider'
import { Toaster } from '@/components/ui/sonner'
import { geist } from '@/fonts'
import { routing } from '@/i18n/routing'
import { getSiteSEOData } from '@/lib/settings'
import { cn } from '@/lib/utils'
import { TRPCReactProvider } from '@/trpc/react'

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  const seoData = await getSiteSEOData()

  return {
    title: seoData.title,
    description: seoData.description,
    keywords: seoData.keywords,
    icons: [{ rel: 'icon', url: seoData.favicon }],
    openGraph: {
      title: seoData.title,
      description: seoData.description,
      type: 'website',
      ...(seoData.logo && { images: [{ url: seoData.logo }] }),
    },
    twitter: {
      card: 'summary_large_image',
      title: seoData.title,
      description: seoData.description,
      ...(seoData.logo && { images: [seoData.logo] }),
    },
  }
}

export default async function RootLayout({ children, params }: Props) {
  // Ensure that the incoming `locale` is valid
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html
      lang={locale}
      className={cn(geist.className)}
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
              <Analytics />
              <NextTopLoader />
              <ConsoleBanner />
              <CommandMenu />
            </TRPCReactProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

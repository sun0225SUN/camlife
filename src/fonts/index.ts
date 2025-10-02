import {
  Abril_Fatface as FontLogo,
  Lora as FontTabsEN,
  Noto_Serif_SC as FontTabsZH,
  Geist,
} from 'next/font/google'

export const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist-sans',
})

export const fontTabsZH = FontTabsZH({
  subsets: ['latin'],
  variable: '--font-tabs-zh',
  weight: ['500', '200', '300', '400', '600', '700', '900'],
  display: 'swap',
  adjustFontFallback: false,
})

export const fontTabsEN = FontTabsEN({
  subsets: ['latin'],
  variable: '--font-tabs-en',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  adjustFontFallback: false,
})

export const fontLogo = FontLogo({
  subsets: ['latin'],
  variable: '--font-logo',
  weight: '400',
  display: 'swap',
  adjustFontFallback: false,
})

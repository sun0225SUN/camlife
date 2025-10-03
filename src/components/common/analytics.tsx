import { Analytics as VercelAnalytics } from '@vercel/analytics/next'
import Script from 'next/script'
import { env } from '@/env'

export const Analytics = () => {
  if (env.NODE_ENV === 'development') {
    return null
  }

  return (
    <>
      {env.NEXT_PUBLIC_UMAMI_ANALYTICS_ID && (
        <Script
          src={env.NEXT_PUBLIC_UMAMI_ANALYTICS_JS}
          data-website-id={env.NEXT_PUBLIC_UMAMI_ANALYTICS_ID}
        />
      )}
      <VercelAnalytics />
    </>
  )
}

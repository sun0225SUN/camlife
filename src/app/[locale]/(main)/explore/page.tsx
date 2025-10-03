'use client'

import dynamic from 'next/dynamic'
import { useSearchParams } from 'next/navigation'

const DynamicMap = dynamic(() => import('@/components/map'), {
  ssr: false,
})

export default function MapPage() {
  const params = useSearchParams()
  const hideControls = params.get('hide_controls') === 'true'
  const lang = params?.get('lang')

  return (
    <DynamicMap
      hideControls={hideControls}
      lang={lang}
    />
  )
}

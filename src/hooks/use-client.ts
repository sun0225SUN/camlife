'use client'

import { useEffect, useState } from 'react'

export function useIsClient() {
  const [isClient, setIsClient] = useState<boolean>(true) // Default to true to avoid flickering

  useEffect(() => {
    // Ensure running in client environment
    if (typeof window !== 'undefined') {
      setIsClient(true)
    }
  }, [])

  return isClient
}

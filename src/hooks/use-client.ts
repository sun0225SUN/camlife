'use client'

import { useEffect, useState } from 'react'

export function useIsClient() {
  const [isClient, setIsClient] = useState<boolean>(true) // 默认为 true，避免闪烁

  useEffect(() => {
    // 确保在客户端环境中运行
    if (typeof window !== 'undefined') {
      setIsClient(true)
    }
  }, [])

  return isClient
}

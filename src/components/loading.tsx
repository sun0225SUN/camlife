import { useTheme } from "next-themes"
import React, { useEffect, useState } from "react"
import { ThreeDot } from "react-loading-indicators"

export function Loading() {
  const { resolvedTheme } = useTheme()
  const [loadingColor, setLoadingColor] = useState<string>()

  useEffect(() => {
    setLoadingColor(resolvedTheme === "dark" ? "#ffffff" : "#000000")
  }, [resolvedTheme])

  return <ThreeDot variant="pulsate" color={loadingColor} size="medium" />
}

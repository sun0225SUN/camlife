import { useEffect, useMemo, useState } from 'react'

interface ImageDimensions {
  width: number
  height: number
}

interface WindowSize {
  width: number
  height: number
}

interface UseImageDisplaySizeOptions {
  /** Maximum height ratio of viewport height, defaults to 0.8 (80vh) */
  maxHeightRatio?: number
  /** Default viewport width when actual window size is unavailable */
  defaultViewportWidth?: number
  /** Default viewport height when actual window size is unavailable */
  defaultViewportHeight?: number
}

/**
 * Calculate the display size of an image within its container, considering responsive layout and size constraints
 * @param imageDimensions Original dimensions of the image
 * @param options Configuration options
 * @returns Calculated display size and window size
 */
export function useImageDisplaySize(
  imageDimensions: ImageDimensions,
  options: UseImageDisplaySizeOptions = {},
) {
  const {
    maxHeightRatio = 0.8,
    defaultViewportWidth = 1920,
    defaultViewportHeight = 1080,
  } = options

  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const updateWindowSize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Initialize
    updateWindowSize()

    // Listen for window resize
    window.addEventListener('resize', updateWindowSize)

    return () => {
      window.removeEventListener('resize', updateWindowSize)
    }
  }, [])

  // Compute the final display size of the image
  const displaySize = useMemo(() => {
    // Use actual window size if available, otherwise use default viewport
    const viewportWidth = windowSize.width || defaultViewportWidth
    const viewportHeight = windowSize.height || defaultViewportHeight

    const maxHeight = viewportHeight * maxHeightRatio

    // Calculate max width considering responsive padding
    let horizontalPadding = 0
    if (viewportWidth >= 1280) {
      horizontalPadding = 384 // xl:px-48 (48 * 4 * 2 = 384px)
    } else if (viewportWidth >= 768) {
      horizontalPadding = 96 // md:px-12 (12 * 4 * 2 = 96px)
    }
    const maxWidth = viewportWidth - horizontalPadding

    const aspectRatio = imageDimensions.width / imageDimensions.height

    let finalWidth = imageDimensions.width
    let finalHeight = imageDimensions.height

    // Scale by height if it exceeds the limit
    if (finalHeight > maxHeight) {
      finalHeight = maxHeight
      finalWidth = finalHeight * aspectRatio
    }

    // Scale by width if it still exceeds the limit
    if (finalWidth > maxWidth) {
      finalWidth = maxWidth
      finalHeight = finalWidth / aspectRatio
    }

    return { width: finalWidth, height: finalHeight }
  }, [
    imageDimensions.width,
    imageDimensions.height,
    windowSize,
    maxHeightRatio,
    defaultViewportWidth,
    defaultViewportHeight,
  ])

  return {
    displaySize,
    windowSize,
  }
}

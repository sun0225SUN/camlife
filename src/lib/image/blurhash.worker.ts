import { decode, encode } from 'blurhash'

export interface WorkerRequest {
  type: 'encode' | 'decode'
  imageData?: {
    data: Uint8ClampedArray
    width: number
    height: number
  }
  blurhash?: string
  width?: number
  height?: number
  quality?: number
}

export interface WorkerResponse {
  type: 'encode' | 'decode' | 'error'
  blurhash?: string
  blurDataUrl?: string
  error?: string
}

// Worker message handler
self.addEventListener('message', async (e: MessageEvent<WorkerRequest>) => {
  const { type, imageData, blurhash, width, height, quality } = e.data

  try {
    if (type === 'encode' && imageData) {
      // Encode to blurhash
      const hash = encode(
        imageData.data,
        imageData.width,
        imageData.height,
        4,
        3,
      )

      // Decode to small size
      const blurWidth = 32
      const blurHeight = 32
      const decodedData = decode(hash, blurWidth, blurHeight)

      if (!decodedData) {
        throw new Error('Failed to decode blurhash')
      }

      // Create OffscreenCanvas in worker if supported
      if (typeof OffscreenCanvas !== 'undefined') {
        const canvas = new OffscreenCanvas(blurWidth, blurHeight)
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          throw new Error('Unable to get canvas context')
        }

        // Create ImageData and set pixel data
        const imgData = ctx.createImageData(blurWidth, blurHeight)
        imgData.data.set(decodedData)
        ctx.putImageData(imgData, 0, 0)

        // Convert to blob and then to base64
        const blob = await canvas.convertToBlob({
          type: 'image/webp',
          quality: (quality || 30) / 100,
        })

        const reader = new FileReader()
        reader.onloadend = () => {
          const response: WorkerResponse = {
            type: 'encode',
            blurhash: hash,
            blurDataUrl: reader.result as string,
          }
          self.postMessage(response)
        }
        reader.readAsDataURL(blob)
      } else {
        // If OffscreenCanvas is not supported, return data for main thread processing
        const response: WorkerResponse = {
          type: 'encode',
          blurhash: hash,
        }
        self.postMessage(response)
      }
    } else if (type === 'decode' && blurhash && width && height) {
      // Decode only
      const decodedData = decode(blurhash, width, height)
      if (!decodedData) {
        throw new Error('Failed to decode blurhash')
      }

      const response: WorkerResponse = {
        type: 'decode',
        blurhash,
      }
      self.postMessage(response)
    }
  } catch (error) {
    const response: WorkerResponse = {
      type: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }
    self.postMessage(response)
  }
})

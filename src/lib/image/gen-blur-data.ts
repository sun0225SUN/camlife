import { decode } from 'blurhash'
import type { WorkerRequest, WorkerResponse } from './blurhash.worker'

/**
 * Load image from URL
 */
const loadImage = async (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = (...args) => reject(args)
    img.src = src
  })

/**
 * Get image data from HTMLImageElement
 */
const getImageData = (image: HTMLImageElement): ImageData => {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('Unable to get canvas context')
  }
  context.drawImage(image, 0, 0)
  return context.getImageData(0, 0, image.width, image.height)
}

/**
 * Create blurhash worker instance
 */
let workerInstance: Worker | null = null

const getWorker = (): Worker => {
  if (!workerInstance) {
    workerInstance = new Worker(
      new URL('./blurhash.worker.ts', import.meta.url),
      { type: 'module' },
    )
  }
  return workerInstance
}

/**
 * Generate blur data URL using Web Worker
 * @param file Input image file
 * @param quality Output image quality, default 30
 * @returns Base64 encoded WebP image string
 */
export async function generateBlurData(
  file: File,
  quality = 30,
): Promise<string> {
  const imageUrl = URL.createObjectURL(file)

  try {
    // Load and process the image
    const image = await loadImage(imageUrl)
    const imageData = getImageData(image)

    // Use Web Worker to encode blurhash
    const worker = getWorker()

    const result = await new Promise<string>((resolve, reject) => {
      const handleMessage = (e: MessageEvent<WorkerResponse>) => {
        worker.removeEventListener('message', handleMessage)

        if (e.data.type === 'error') {
          reject(new Error(e.data.error || 'Worker error'))
        } else if (e.data.type === 'encode') {
          if (e.data.blurDataUrl) {
            // Worker successfully generated blurDataUrl
            resolve(e.data.blurDataUrl)
          } else if (e.data.blurhash) {
            // Worker only returned blurhash, need to complete remaining work in main thread
            // (This happens in browsers that don't support OffscreenCanvas)
            const blurWidth = 32
            const blurHeight = 32
            const decodedData = decode(e.data.blurhash, blurWidth, blurHeight)

            if (!decodedData) {
              reject(new Error('Failed to decode blurhash'))
              return
            }

            // Create canvas for final output
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            if (!ctx) {
              reject(new Error('Unable to get canvas context'))
              return
            }

            canvas.width = blurWidth
            canvas.height = blurHeight

            // Create ImageData from decoded blurhash data
            const imgData = ctx.createImageData(blurWidth, blurHeight)
            imgData.data.set(decodedData)

            ctx.putImageData(imgData, 0, 0)

            // Convert to WebP format base64 string
            resolve(canvas.toDataURL('image/webp', quality / 100))
          } else {
            reject(new Error('Invalid worker response'))
          }
        }
      }

      worker.addEventListener('message', handleMessage)

      const request: WorkerRequest = {
        type: 'encode',
        imageData: {
          data: imageData.data,
          width: imageData.width,
          height: imageData.height,
        },
        quality,
      }

      worker.postMessage(request)
    })

    return result
  } catch (error) {
    console.error('Error generating blur data:', error)
    throw error
  } finally {
    // Clean up resources
    URL.revokeObjectURL(imageUrl)
  }
}

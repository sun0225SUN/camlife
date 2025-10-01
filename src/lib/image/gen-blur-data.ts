import { decode, encode } from 'blurhash'

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
 * Generate blur data URL
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

    // Encode to blurhash
    const blurhash = encode(
      imageData.data,
      imageData.width,
      imageData.height,
      4,
      3,
    )

    // Decode blurhash directly to small size (32x32)
    const blurWidth = 32
    const blurHeight = 32
    const decodedData = decode(blurhash, blurWidth, blurHeight)

    if (!decodedData) {
      throw new Error('Failed to decode blurhash')
    }

    // Create canvas for final output
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Unable to get canvas context')
    }

    canvas.width = blurWidth
    canvas.height = blurHeight

    // Create ImageData from decoded blurhash data
    const imgData = ctx.createImageData(blurWidth, blurHeight)
    imgData.data.set(decodedData)

    ctx.putImageData(imgData, 0, 0)

    // Convert to WebP format base64 string
    return canvas.toDataURL('image/webp', quality / 100)
  } catch (error) {
    console.error('Error generating blur data:', error)
    throw error
  } finally {
    // Clean up resources
    URL.revokeObjectURL(imageUrl)
  }
}

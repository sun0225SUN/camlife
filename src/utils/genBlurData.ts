import { decode, encode } from "blurhash"
import sharp from "sharp"

const MAX_DIMENSION = 32

/**
 * Generates a blurred, compressed version of an input image using Blurhash
 * @param imageBuffer The input image buffer
 * @param quality The quality of the output image, default is 30
 * @returns A Promise that resolves to a base64-encoded WebP image string
 */
export async function generateBlurData(
  imageBuffer: Buffer,
  quality = 30,
): Promise<string> {
  try {
    // Resize the image to speed up Blurhash encoding
    const resizedBuffer = await sharp(imageBuffer)
      .resize(MAX_DIMENSION, MAX_DIMENSION, {
        fit: "inside",
      })
      .raw()
      .ensureAlpha()
      .toBuffer({ resolveWithObject: true })

    // Encode the resized image to Blurhash
    const blurhash = encode(
      new Uint8ClampedArray(resizedBuffer.data),
      resizedBuffer.info.width,
      resizedBuffer.info.height,
      4,
      3,
    )

    // Decode the Blurhash to a larger size for better quality
    const decodedWidth = resizedBuffer.info.width * 2
    const decodedHeight = resizedBuffer.info.height * 2
    const pixels = decode(blurhash, decodedWidth, decodedHeight)

    // Convert decoded pixels to WebP
    const blurredImageBuffer = await sharp(Buffer.from(pixels), {
      raw: { width: decodedWidth, height: decodedHeight, channels: 4 },
    })
      .webp({ quality })
      .toBuffer()

    // Return the blurred image as a base64-encoded WebP string
    return `data:image/webp;base64,${blurredImageBuffer.toString("base64")}`
  } catch (error) {
    console.error("Error generating blur data:", error)
    throw error
  }
}

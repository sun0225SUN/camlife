import { decode, encode } from "blurhash"
import sharp from "sharp"

/**
 * Generates a blurred, compressed version of an input image
 * @param input The input image (either a base64 string or a URL)
 * @param isBase64 Whether the input is a base64 string
 * @returns A Promise that resolves to a base64-encoded WebP image string
 */
export async function generateBlurredImageData(
  input: string,
  isBase64: boolean,
): Promise<string> {
  // Fetch the image and convert it to a buffer
  const originalBuffer = isBase64
    ? Buffer.from(input.replace(/^data:image\/webp;base64,/, ""), "base64")
    : Buffer.from(await (await fetch(input)).arrayBuffer())

  // Get the image data and info
  const { data, info } = await sharp(originalBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  // Encode the image to blurhash
  const blurhash = encode(
    new Uint8ClampedArray(data),
    info.width,
    info.height,
    4,
    3,
  )

  // Decode the blurhash to get the image data
  const decodedData = decode(blurhash, info.width, info.height)

  // Compress the image to 40% quality and resize to half the size
  const blurredImageBuffer = await sharp(Buffer.from(decodedData), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .resize(Math.floor(info.width / 2), Math.floor(info.height / 2))
    .webp({ quality: 40 })
    .toBuffer()

  // Return the blurred image as a base64-encoded WebP string
  return `data:image/webp;base64,${blurredImageBuffer.toString("base64")}`
}

import sharp from "sharp"

/**
 * Compresses a base64-encoded image.
 *
 * This function takes a base64-encoded image string, decodes it, compresses the image,
 * and returns a new base64-encoded string of the compressed image in WebP format.
 *
 * @param base64Data - The base64-encoded string of the original image.
 * @returns A Promise that resolves to a base64-encoded string of the compressed image.
 *
 * @remarks
 * The compression process includes:
 * 1. Removing the base64 prefix (if present)
 * 2. Resizing the image to half its original width
 * 3. Converting the image to WebP format with 80% quality
 *
 * @throws Will throw an error if the input is not a valid base64-encoded image or if Sharp encounters any issues during processing.
 */
export async function compressBase64Image(base64Data: string): Promise<string> {
  // Remove base64 prefix if present
  const buffer = Buffer.from(
    base64Data.replace(/^data:image\/\w+;base64,/, ""),
    "base64",
  )

  // Get the original width of the image
  const { width } = await sharp(buffer).metadata()

  // Compress the image
  const compressedBuffer = await sharp(buffer)
    .resize({ width: Math.floor(width! / 2) })
    .toFormat("webp", { quality: 80 })
    .toBuffer()

  // Return the compressed image as a base64-encoded string
  return `data:image/webp;base64,${compressedBuffer.toString("base64")}`
}

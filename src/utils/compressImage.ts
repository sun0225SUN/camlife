import sharp from "sharp"

/**
 * Compresses an image by resizing it and converting it to WebP format.
 * @param buffer - The input image buffer.
 * @param quality - The WebP compression quality (0-100). Default is 80.
 * @param resizeRatio - The ratio to resize the image. Default is 0.5 (half size).
 * @returns A Promise that resolves to the compressed image buffer.
 */
export async function compressImage(
  buffer: Buffer,
  quality = 80,
  resizeRatio = 0.5,
): Promise<Buffer> {
  // Get the metadata of the input image
  const { width = 0, height = 0 } = await sharp(buffer).metadata()

  // Process the image: resize and convert to WebP
  return sharp(buffer)
    .resize({
      width: Math.floor(width * resizeRatio),
      height: Math.floor(height * resizeRatio),
    })
    .webp({ quality })
    .toBuffer()
}

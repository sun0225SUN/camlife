import { decode, encode } from "blurhash"
import sharp from "sharp"

export async function generateBlurredImageData(
  input: string,
  isBase64: boolean,
): Promise<string> {
  // fetch the image and convert it to a buffer
  const originalBuffer = isBase64
    ? Buffer.from(input.replace(/^data:image\/webp;base64,/, ""), "base64")
    : Buffer.from(await (await fetch(input)).arrayBuffer())

  // get the image data and info
  const { data, info } = await sharp(originalBuffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })

  // encode the image to blurhash
  const blurhash = encode(
    new Uint8ClampedArray(data),
    info.width,
    info.height,
    4,
    3,
  )

  // decode the blurhash to get the image data
  const decodedData = decode(blurhash, info.width, info.height)

  // compress the image to 40% quality and resize to half the size
  const blurredImageBuffer = await sharp(Buffer.from(decodedData), {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .resize(Math.floor(info.width / 2), Math.floor(info.height / 2))
    .webp({ quality: 40 })
    .toBuffer()

  return `data:image/webp;base64,${blurredImageBuffer.toString("base64")}`
}

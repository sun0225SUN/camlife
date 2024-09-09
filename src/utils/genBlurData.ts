import { decode, encode } from "blurhash"
import sharp from "sharp"

interface ImageInfo {
  width: number
  height: number
  channels: number
}

export async function generateBlurredImageData(
  input: string,
  isBase64: boolean,
): Promise<string> {
  const originalBuffer = await getImageBuffer(input, isBase64)
  const { data, info } = await processImageWithSharp(originalBuffer)
  const blurhash = generateBlurhash(data, info)
  const blurredImageBuffer = await createBlurredImage(blurhash, info)
  return convertToBase64DataUrl(blurredImageBuffer)
}

async function getImageBuffer(
  input: string,
  isBase64: boolean,
): Promise<Buffer> {
  if (isBase64) {
    return Buffer.from(input, "base64")
  }
  const response = await fetch(input)
  return Buffer.from(await response.arrayBuffer())
}

async function processImageWithSharp(
  buffer: Buffer,
): Promise<{ data: Buffer; info: ImageInfo }> {
  return await sharp(buffer)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
}

function generateBlurhash(data: Buffer, info: ImageInfo): string {
  return encode(new Uint8ClampedArray(data), info.width, info.height, 4, 4)
}

async function createBlurredImage(
  blurhash: string,
  info: ImageInfo,
): Promise<Buffer> {
  const decodedData = decode(blurhash, info.width, info.height)
  return await sharp(Buffer.from(decodedData), {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4,
    },
  })
    .resize({
      width: Math.floor(info.width / 2),
      height: Math.floor(info.height / 2),
    })
    .webp({ quality: 40 })
    .toBuffer()
}

function convertToBase64DataUrl(buffer: Buffer): string {
  return `data:image/webp;base64,${buffer.toString("base64")}`
}

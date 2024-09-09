import sharp from "sharp"

export async function compressBase64Image(base64Data: string): Promise<string> {
  const buffer = Buffer.from(
    base64Data.replace(/^data:image\/\w+;base64,/, ""),
    "base64",
  )

  const { width } = await sharp(buffer).metadata()

  const compressedBuffer = await sharp(buffer)
    .resize({ width: Math.floor(width! / 2) })
    .toFormat("webp", { quality: 80 })
    .toBuffer()

  return `data:image/webp;base64,${compressedBuffer.toString("base64")}`
}

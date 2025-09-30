import ExifReader from 'exifreader'

export const getExifData = async (file: File) => {
  const exif = await ExifReader.load(file)
  return exif
}

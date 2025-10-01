export * from './gen-blur-data'
export * from './get-location'

export const downloadImage = async (url: string, filename: string) => {
  try {
    const response = await fetch(url)
    const blob = await response.blob()

    // create download link
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename

    // trigger download
    document.body.appendChild(link)
    link.click()

    // clean up
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  } catch (error) {
    console.error('Download failed:', error)
  }
}

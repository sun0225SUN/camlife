export * from './cloudflare-r2'

/**
 *  XMLHttpRequest upload with progress
 * @param file the file to be uploaded
 * @param uploadUrl the upload url
 * @param onProgress the progress callback
 */
export async function uploadFileWithProgress(
  file: File,
  uploadUrl: string,
  onProgress?: (progress: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // upload progress
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100)
        onProgress?.(progress)
      }
    })

    // complete
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve()
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`))
      }
    }

    // error
    xhr.onerror = () => {
      reject(new Error('Network error during upload'))
    }

    xhr.ontimeout = () => {
      reject(new Error('Upload timed out'))
    }

    // timeout
    xhr.timeout = 30000

    // send request
    xhr.open('PUT', uploadUrl)
    xhr.send(file)
  })
}

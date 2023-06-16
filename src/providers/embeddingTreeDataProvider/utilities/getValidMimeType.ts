import { URL } from 'url'

export async function getValidMimeType(
  transferFile: URL
): Promise<string | undefined> {
  const fileExtension = transferFile.pathname.substring(
    transferFile.pathname.lastIndexOf('.') + 1
  )

  switch (fileExtension) {
    case 'htm':
    case 'html':
      return 'text/html'
    case 'csv':
      return 'text/csv'
    case 'md':
      return 'text/markdown'
    case 'txt':
      return 'text/plain'
    default:
      return undefined
  }

  return ''
}

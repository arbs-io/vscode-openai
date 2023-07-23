import * as crypto from 'crypto'
import { Uri, workspace } from 'vscode'
import { createDebugNotification } from '@app/utilities/node'
import {
  extractTextFromBuffer,
  getEmbeddingsForText,
} from '@app/utilities/embedding'
import { IEmbeddingFileLite } from '@app/interfaces'
import { StatusBarServiceProvider } from '@app/utilities/vscode'

export async function embeddingResource(uri: Uri) {
  StatusBarServiceProvider.instance.showStatusBarInformation(
    'sync~spin',
    '- memory-buffer'
  )

  createDebugNotification(`embedding-controller memory-buffer`)
  const bufferArray = await workspace.fs.readFile(uri)

  createDebugNotification(`embedding-controller reading buffer type`)
  const mimeType = await getValidMimeType(uri)

  const fileContent = await extractTextFromBuffer({
    bufferArray: bufferArray,
    filetype: mimeType,
  })

  if (!fileContent) return //if mimetype not supported

  createDebugNotification(
    `embedding-controller extract ${fileContent.mimeType} ${fileContent.content.length} (bytes)`
  )

  const embeddingText = await getEmbeddingsForText(fileContent.content)
  createDebugNotification(
    `embedding-controller embedding ${embeddingText.length} (chunks)`
  )

  const fileObject: IEmbeddingFileLite = {
    timestamp: new Date().getTime(),
    embeddingId: crypto.randomUUID(),
    name: decodeURIComponent(uri.path).substring(
      decodeURIComponent(uri.path).lastIndexOf('/') + 1
    ),
    url: decodeURIComponent(uri.path),
    type: mimeType,
    size: fileContent.content.length,
    expanded: false,
    chunks: embeddingText,
    extractedText: fileContent.content,
  }
  StatusBarServiceProvider.instance.showStatusBarInformation(
    'vscode-openai',
    ''
  )
  return fileObject
}

async function getValidMimeType(uri: Uri): Promise<string | undefined> {
  const fileExtension = uri.path.substring(uri.path.lastIndexOf('.') + 1)
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
}

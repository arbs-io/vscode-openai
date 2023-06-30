import * as crypto from 'crypto'
import { Uri, workspace } from 'vscode'
import { createDebugNotification } from '@app/utilities/node'
import {
  extractTextFromBuffer,
  getEmbeddingsForText,
} from '@app/utilities/embedding'
import { IEmbeddingFileLite } from '@app/interfaces'
import { ExtensionStatusBarItem } from '@app/utilities/vscode'

export async function embeddingResource(transferFile: Uri) {
  ExtensionStatusBarItem.instance.showStatusBarInformation(
    'sync~spin',
    '- memory-buffer'
  )

  createDebugNotification(`embedding-controller memory-buffer`)
  const bufferArray = await workspace.fs.readFile(transferFile)

  createDebugNotification(`embedding-controller reading buffer type`)
  const mimeType = await getValidMimeType(transferFile)

  const fileContent = await extractTextFromBuffer({
    bufferArray: bufferArray,
    filetype: mimeType,
  })
  createDebugNotification(
    `embedding-controller extract ${fileContent.mimeType} ${fileContent.content.length} (bytes)`
  )

  const embeddingText = await getEmbeddingsForText({
    text: fileContent.content,
  })
  createDebugNotification(
    `embedding-controller embedding ${embeddingText.length} (chunks)`
  )

  const fileObject: IEmbeddingFileLite = {
    timestamp: new Date().getTime(),
    embeddingId: crypto.randomUUID(),
    name: decodeURIComponent(transferFile.path).substring(
      decodeURIComponent(transferFile.path).lastIndexOf('/') + 1
    ),
    url: decodeURIComponent(transferFile.path),
    type: mimeType,
    size: fileContent.content.length,
    expanded: false,
    // embedding: embeddingText,
    chunks: embeddingText,
    extractedText: fileContent.content,
  }
  return fileObject
}

async function getValidMimeType(
  transferFile: Uri
): Promise<string | undefined> {
  const fileExtension = transferFile.path.substring(
    transferFile.path.lastIndexOf('.') + 1
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

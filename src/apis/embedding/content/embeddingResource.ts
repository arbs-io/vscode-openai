import crypto from 'crypto'
import { Uri, workspace } from 'vscode'
import { createDebugNotification } from '@app/apis/node'
import {
  extractTextFromBuffer,
  getEmbeddingsForText,
} from '@app/apis/embedding'
import { IEmbeddingFileLite } from '@app/types'
import { StatusBarServiceProvider } from '@app/apis/vscode'

export async function embeddingResource(uri: Uri) {
  StatusBarServiceProvider.instance.showStatusBarInformation(
    'sync~spin',
    '- memory-buffer'
  )

  createDebugNotification(`embedding-controller memory-buffer`)
  const bufferArray = await workspace.fs.readFile(uri)

  const fileInfo = await extractTextFromBuffer({
    bufferArray: bufferArray,
  })

  if (!fileInfo?.content) return

  const embeddingText = await getEmbeddingsForText(fileInfo.content)
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
    type: fileInfo.mimetype,
    size: fileInfo.content?.length,
    expanded: false,
    chunks: embeddingText,
    extractedText: fileInfo.content,
  }
  StatusBarServiceProvider.instance.showStatusBarInformation(
    'vscode-openai',
    ''
  )
  return fileObject
}

import * as crypto from 'crypto'
import * as fs from 'fs'
import {
  createDebugNotification,
  createErrorNotification,
} from '@app/utilities/node'
import {
  EventEmitter,
  TreeDragAndDropController,
  Event,
  DataTransfer,
  CancellationToken,
  DataTransferItem,
  Uri,
} from 'vscode'
import { OpenaiTreeItem } from '.'
import { extractTextFromBuffer } from '@app/utilities/extract-text-content'
import { showMessageWithTimeout } from '@app/utilities/vscode'
import { URL } from 'url'

export class EmbeddingTreeDragAndDropController
  implements TreeDragAndDropController<OpenaiTreeItem>
{
  dropMimeTypes: string[] = ['text/uri-list']
  dragMimeTypes: string[] = this.dropMimeTypes

  private _onDidDragDropTreeData: EventEmitter<OpenaiTreeItem[]> =
    new EventEmitter<OpenaiTreeItem[]>()

  public onDidDragDropTreeData: Event<OpenaiTreeItem[]> =
    this._onDidDragDropTreeData.event

  public async handleDrop(
    target: OpenaiTreeItem | undefined,
    sources: DataTransfer,
    token: CancellationToken
  ): Promise<void> {
    const transferItem = sources.get('text/uri-list')
    if (!transferItem) {
      createDebugNotification(`embedding drop failed`)
      return
    }
    createDebugNotification(`drop success ${transferItem}`)

    const transferFile = new URL(transferItem.value)
    try {
      const bufferArray = await loadUriData(transferFile)
      const mimeType = await getMimeType(transferFile)

      const fileContent = await extractTextFromBuffer({
        bufferArray: bufferArray,
        filetype: mimeType,
      })

      showMessageWithTimeout(
        `${fileContent.mimeType}: ${fileContent.content.length} - ${transferFile}`,
        5000
      )

      const uri = Uri.file(transferItem.value)
      const timestamp = new Date().getTime()
      const embeddingId: string = crypto.randomUUID()
      const openaiTreeItem = new OpenaiTreeItem(
        timestamp,
        embeddingId,
        uri,
        fileContent.content
      )

      this._onDidDragDropTreeData.fire([openaiTreeItem])
    } catch (error) {
      createErrorNotification(error)
    }
  }

  public async handleDrag(
    source: OpenaiTreeItem[],
    treeDataTransfer: DataTransfer,
    token: CancellationToken
  ): Promise<void> {
    treeDataTransfer.set(
      'application/vnd.vscode-openai.void',
      new DataTransferItem(source)
    )
  }
}
async function loadUriData(transferFile: URL): Promise<Uint8Array> {
  return await new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(transferFile)
    const chunks: any[] = []
    fileStream.on('data', (chunk) => {
      chunks.push(chunk)
    })
    fileStream.on('error', (error) => {
      reject(error)
    })
    fileStream.on('end', () => {
      const uint8Array = new Uint8Array(Buffer.concat(chunks))
      resolve(uint8Array)
    })
  })
}

async function getMimeType(transferFile: URL): Promise<string | undefined> {
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

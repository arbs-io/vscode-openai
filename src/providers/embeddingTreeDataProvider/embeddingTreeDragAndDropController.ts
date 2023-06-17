import * as crypto from 'crypto'
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
import { EmbeddingTreeItem } from '.'
import {
  extractTextFromBuffer,
  getEmbeddingsForText,
} from '@app/utilities/embedding'
import { URL } from 'url'
import { getValidMimeType, urlReadBuffer } from './utilities'

export class EmbeddingTreeDragAndDropController
  implements TreeDragAndDropController<EmbeddingTreeItem>
{
  dropMimeTypes: string[] = ['text/uri-list']
  dragMimeTypes: string[] = this.dropMimeTypes

  private _onDidDragDropTreeData: EventEmitter<EmbeddingTreeItem[]> =
    new EventEmitter<EmbeddingTreeItem[]>()

  public onDidDragDropTreeData: Event<EmbeddingTreeItem[]> =
    this._onDidDragDropTreeData.event

  public async handleDrop(
    target: EmbeddingTreeItem | undefined,
    sources: DataTransfer,
    token: CancellationToken
  ): Promise<void> {
    const transferItem = sources.get('text/uri-list')
    if (!transferItem) {
      createDebugNotification(`embedding drop failed`)
      return
    }
    createDebugNotification(`embedding-controller: ${transferItem.value}`)

    const transferFile = new URL(transferItem.value)
    try {
      const bufferArray = await urlReadBuffer(transferFile)
      createDebugNotification(`embedding-controller memory-buffer`)

      const mimeType = await getValidMimeType(transferFile)
      createDebugNotification(`embedding-controller reading buffer type`)

      const fileContent = await extractTextFromBuffer({
        bufferArray: bufferArray,
        filetype: mimeType,
      })
      createDebugNotification(
        `embedding-controller extract ${fileContent.mimeType} ${fileContent.content.length} (bytes)`
      )

      const splitEmbeddings = await getEmbeddingsForText({
        text: fileContent.content,
      })
      createDebugNotification(
        `embedding-controller embedding ${splitEmbeddings.length} (chunks)`
      )

      const uri = Uri.file(transferItem.value)
      const timestamp = new Date().getTime()
      const embeddingId: string = crypto.randomUUID()
      const openaiTreeItem = new EmbeddingTreeItem(
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
    source: EmbeddingTreeItem[],
    treeDataTransfer: DataTransfer,
    token: CancellationToken
  ): Promise<void> {
    treeDataTransfer.set(
      'application/vnd.vscode-openai.void',
      new DataTransferItem(source)
    )
  }
}

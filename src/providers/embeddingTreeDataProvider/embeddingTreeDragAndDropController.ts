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
import { EmbeddingService } from '@app/services'
import { OpenaiTreeItem } from '.'

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
      const fileContent = fs.readFileSync(transferFile, {
        encoding: 'utf8',
        flag: 'r',
      })

      const uri = Uri.file(transferItem.value)
      const timestamp = new Date().getTime()
      const embeddingId: string = crypto.randomUUID()
      const openaiTreeItem = new OpenaiTreeItem(
        timestamp,
        embeddingId,
        uri,
        fileContent
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

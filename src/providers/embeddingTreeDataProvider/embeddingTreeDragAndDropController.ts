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

  private _onDidChangeTreeData: EventEmitter<
    (OpenaiTreeItem | undefined)[] | undefined
  > = new EventEmitter<OpenaiTreeItem[] | undefined>()

  public onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event

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

      const openaiTreeItem = new OpenaiTreeItem(uri, fileContent)
      EmbeddingService.instance.update(openaiTreeItem)
      this._onDidChangeTreeData.fire([openaiTreeItem])
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

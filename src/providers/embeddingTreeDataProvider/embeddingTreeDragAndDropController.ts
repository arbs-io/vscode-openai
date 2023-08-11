import {
  createDebugNotification,
  createErrorNotification,
} from '@app/apis/node'
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
import { IEmbeddingFileLite } from '@app/types'
import { embeddingResource } from '@app/apis/embedding'

export class EmbeddingTreeDragAndDropController
  implements TreeDragAndDropController<EmbeddingTreeItem>
{
  dropMimeTypes: string[] = ['text/uri-list']
  dragMimeTypes: string[] = this.dropMimeTypes

  private _onDidDragDropTreeData: EventEmitter<IEmbeddingFileLite[]> =
    new EventEmitter<IEmbeddingFileLite[]>()

  public onDidDragDropTreeData: Event<IEmbeddingFileLite[]> =
    this._onDidDragDropTreeData.event

  public async handleDrop(
    _target: EmbeddingTreeItem | undefined,
    sources: DataTransfer,
    _token: CancellationToken
  ): Promise<void> {
    try {
      const transferItem = sources.get('text/uri-list')
      if (!transferItem) {
        createDebugNotification(`embedding drop failed`)
        return
      }

      const handleDropUrls = (await transferItem.asString()).split('\r\n')

      handleDropUrls.map(async (handleDropUrl) => {
        try {
          createDebugNotification(`drag-and-drop-controller: ${handleDropUrl}`)
          const uri = Uri.parse(handleDropUrl)
          const fileObject = await embeddingResource(uri)
          if (!fileObject) return
          this._onDidDragDropTreeData.fire([fileObject])
        } catch (error) {
          createErrorNotification(error)
        }
      })
    } catch (error) {
      createErrorNotification(error)
    }
  }

  public async handleDrag(
    source: EmbeddingTreeItem[],
    treeDataTransfer: DataTransfer,
    _token: CancellationToken
  ): Promise<void> {
    treeDataTransfer.set(
      'application/vnd.vscode-openai.void',
      new DataTransferItem(source)
    )
  }
}

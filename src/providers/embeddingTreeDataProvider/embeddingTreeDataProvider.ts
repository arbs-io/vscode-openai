import {
  EventEmitter,
  TreeDataProvider,
  Event,
  ExtensionContext,
  window,
} from 'vscode'
import { VSCODE_OPENAI_SIDEBAR } from '@app/contexts'
import { EmbeddingService } from '@app/services'
import { EmbeddingTreeDragAndDropController, OpenaiTreeItem } from '.'
import { IEmbedding } from '@app/interfaces'

export class EmbeddingTreeDataProvider
  implements TreeDataProvider<OpenaiTreeItem>
{
  private _onDidChangeTreeData: EventEmitter<
    (OpenaiTreeItem | undefined)[] | undefined
  > = new EventEmitter<OpenaiTreeItem[] | undefined>()

  public onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event

  private _dragAndDropController: EmbeddingTreeDragAndDropController

  private ConvertTreeItemToIEmbedding(
    openaiTreeItem: OpenaiTreeItem
  ): IEmbedding {
    const embedding: IEmbedding = {
      timestamp: openaiTreeItem.timestamp,
      embeddingId: openaiTreeItem.embeddingId,
      uri: openaiTreeItem.uri,
      content: openaiTreeItem.content,
    }
    return embedding
  }
  private ConvertIEmbeddingToTreeItem(embedding: IEmbedding): OpenaiTreeItem {
    const openaiTreeItem = new OpenaiTreeItem(
      embedding.timestamp,
      embedding.embeddingId,
      embedding.uri,
      embedding.content
    )
    return openaiTreeItem
  }

  constructor(context: ExtensionContext) {
    this._dragAndDropController = new EmbeddingTreeDragAndDropController()
    this._dragAndDropController.onDidDragDropTreeData(
      (openaiTreeItems: OpenaiTreeItem[]) => {
        openaiTreeItems.forEach((openaiTreeItem) => {
          if (openaiTreeItem) {
            const embedding = this.ConvertTreeItemToIEmbedding(openaiTreeItem)
            EmbeddingService.instance.update(embedding)
          }
        })
      }
    )

    EmbeddingService.onDidChange(() => {
      this.refresh()
    })

    const view = window.createTreeView(
      VSCODE_OPENAI_SIDEBAR.EMBEDDING_COMMAND_ID,
      {
        treeDataProvider: this,
        showCollapseAll: true,
        canSelectMany: false,
        dragAndDropController: this._dragAndDropController,
      }
    )
    context.subscriptions.push(view)
  }

  public refresh(): void {
    this._onDidChangeTreeData.fire(undefined)
  }

  public getChildren(element: OpenaiTreeItem): OpenaiTreeItem[] {
    const openaiTreeItems: Array<OpenaiTreeItem> = []

    const embeddings = EmbeddingService.instance.getAll()
    embeddings.forEach((embedding) => {
      const openaiTreeItem = this.ConvertIEmbeddingToTreeItem(embedding)
      openaiTreeItems.push(openaiTreeItem)
    })
    return openaiTreeItems
  }

  public getTreeItem(element: OpenaiTreeItem): OpenaiTreeItem {
    return element
  }
}

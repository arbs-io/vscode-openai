import {
  EventEmitter,
  TreeDataProvider,
  Event,
  ExtensionContext,
  window,
} from 'vscode'
import { VSCODE_OPENAI_SIDEBAR } from '@app/constants'
import { EmbeddingService } from '@app/services'
import { EmbeddingTreeDragAndDropController, EmbeddingTreeItem } from '.'
import { IEmbedding } from '@app/interfaces'

export class EmbeddingTreeDataProvider
  implements TreeDataProvider<EmbeddingTreeItem>
{
  private _onDidChangeTreeData: EventEmitter<
    (EmbeddingTreeItem | undefined)[] | undefined
  > = new EventEmitter<EmbeddingTreeItem[] | undefined>()

  public onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event

  private _dragAndDropController: EmbeddingTreeDragAndDropController

  constructor(context: ExtensionContext) {
    this._dragAndDropController = new EmbeddingTreeDragAndDropController()
    this._dragAndDropController.onDidDragDropTreeData(
      (openaiTreeItems: EmbeddingTreeItem[]) => {
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

  public getChildren(element: EmbeddingTreeItem): EmbeddingTreeItem[] {
    const openaiTreeItems: Array<EmbeddingTreeItem> = []

    const embeddings = EmbeddingService.instance.getAll()
    embeddings.forEach((embedding) => {
      const openaiTreeItem = this.ConvertIEmbeddingToTreeItem(embedding)
      openaiTreeItems.push(openaiTreeItem)
    })
    return openaiTreeItems
  }

  public getTreeItem(element: EmbeddingTreeItem): EmbeddingTreeItem {
    return element
  }

  private ConvertTreeItemToIEmbedding(
    openaiTreeItem: EmbeddingTreeItem
  ): IEmbedding {
    const embedding: IEmbedding = {
      timestamp: openaiTreeItem.timestamp,
      embeddingId: openaiTreeItem.embeddingId,
      uri: openaiTreeItem.uri,
      content: openaiTreeItem.content,
    }
    return embedding
  }
  private ConvertIEmbeddingToTreeItem(
    embedding: IEmbedding
  ): EmbeddingTreeItem {
    const openaiTreeItem = new EmbeddingTreeItem(
      embedding.timestamp,
      embedding.embeddingId,
      embedding.uri,
      embedding.content
    )
    return openaiTreeItem
  }
}

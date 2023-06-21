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
import { IEmbeddingFileLite } from '@app/interfaces'

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
      (openaiTreeItems: IEmbeddingFileLite[]) => {
        openaiTreeItems.forEach((openaiTreeItem) => {
          if (openaiTreeItem) {
            EmbeddingService.instance.update(openaiTreeItem)
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

  private ConvertIEmbeddingToTreeItem(
    embedding: IEmbeddingFileLite
  ): EmbeddingTreeItem {
    const openaiTreeItem = new EmbeddingTreeItem(embedding)
    return openaiTreeItem
  }
}

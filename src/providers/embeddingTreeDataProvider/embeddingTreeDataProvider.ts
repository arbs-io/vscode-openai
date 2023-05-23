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

export class EmbeddingTreeDataProvider
  implements TreeDataProvider<OpenaiTreeItem>
{
  private _onDidChangeTreeData: EventEmitter<
    (OpenaiTreeItem | undefined)[] | undefined
  > = new EventEmitter<OpenaiTreeItem[] | undefined>()

  public onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event

  private _dragAndDropController: EmbeddingTreeDragAndDropController

  constructor(context: ExtensionContext) {
    this._dragAndDropController = new EmbeddingTreeDragAndDropController()
    this._dragAndDropController.onDidDragDropTreeData((openaiTreeItem) => {
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
    EmbeddingService.instance.getAll().forEach((embedding) => {
      openaiTreeItems.push(new OpenaiTreeItem(embedding.uri, embedding.content))
    })
    return openaiTreeItems

    // if (element === undefined) {
    //   return this.data
    // }
    // return this.data
  }

  public getTreeItem(element: OpenaiTreeItem): OpenaiTreeItem {
    return element
  }
}

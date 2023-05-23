import * as fs from 'fs'
import {
  createDebugNotification,
  createErrorNotification,
} from '@app/utilities/node'
import {
  EventEmitter,
  TreeDataProvider,
  TreeDragAndDropController,
  Event,
  ExtensionContext,
  window,
  DataTransfer,
  CancellationToken,
  DataTransferItem,
  Uri,
} from 'vscode'
import { VSCODE_OPENAI_SIDEBAR } from '@app/contexts'
import { EmbeddingService } from '@app/services'
import { EmbeddingTreeDragAndDropController, OpenaiTreeItem } from '.'

export class EmbeddingTreeDataProvider
  implements TreeDataProvider<OpenaiTreeItem>
{
  data: Array<OpenaiTreeItem>

  private _onDidChangeTreeData: EventEmitter<
    (OpenaiTreeItem | undefined)[] | undefined
  > = new EventEmitter<OpenaiTreeItem[] | undefined>()

  public onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event

  constructor(
    context: ExtensionContext,
    private _dragAndDropController: EmbeddingTreeDragAndDropController
  ) {
    _dragAndDropController = new EmbeddingTreeDragAndDropController()
    const view = window.createTreeView(
      VSCODE_OPENAI_SIDEBAR.EMBEDDING_COMMAND_ID,
      {
        treeDataProvider: this,
        showCollapseAll: true,
        canSelectMany: false,
        dragAndDropController: _dragAndDropController,
      }
    )
    context.subscriptions.push(view)

    this.data = [
      new OpenaiTreeItem(Uri.file('file:///c%3A/abc/README.md')),
      new OpenaiTreeItem(Uri.file('file:///c%3A/abc/CHANGELOG.md')),
      new OpenaiTreeItem(Uri.file('file:///c%3A/abc/todo.txt')),
    ]
  }

  // Tree data provider

  public getChildren(element: OpenaiTreeItem): OpenaiTreeItem[] {
    if (element === undefined) {
      return this.data
    }
    return this.data
  }

  public getTreeItem(element: OpenaiTreeItem): OpenaiTreeItem {
    return element
  }

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
      const embedding = EmbeddingService.instance.create(uri, fileContent)
      EmbeddingService.instance.update(embedding)

      // const treeItem = new OpenaiTreeItem(embeddingItem.uri)
      // this.data.push(treeItem)

      this._onDidChangeTreeData.fire(undefined)
    } catch (error) {
      createErrorNotification(error)
    }
  }
}

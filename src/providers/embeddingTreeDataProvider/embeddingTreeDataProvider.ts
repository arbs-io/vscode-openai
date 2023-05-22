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
  TreeItem,
  DataTransfer,
  CancellationToken,
  DataTransferItem,
  TreeItemCollapsibleState,
  Uri,
  ThemeIcon,
} from 'vscode'
import { VSCODE_OPENAI_SIDEBAR } from '@app/contexts'

export class EmbeddingTreeDataProvider
  implements
    TreeDataProvider<VscodeOpenaiTreeItem>,
    TreeDragAndDropController<VscodeOpenaiTreeItem>
{
  dropMimeTypes: string[] = ['text/uri-list']
  dragMimeTypes: string[] = this.dropMimeTypes
  data: Array<VscodeOpenaiTreeItem>

  private _onDidChangeTreeData: EventEmitter<
    (VscodeOpenaiTreeItem | undefined)[] | undefined
  > = new EventEmitter<VscodeOpenaiTreeItem[] | undefined>()

  public onDidChangeTreeData: Event<any> = this._onDidChangeTreeData.event

  constructor(context: ExtensionContext) {
    const view = window.createTreeView(
      VSCODE_OPENAI_SIDEBAR.EMBEDDING_COMMAND_ID,
      {
        treeDataProvider: this,
        showCollapseAll: true,
        canSelectMany: false,
        dragAndDropController: this,
      }
    )
    context.subscriptions.push(view)

    this.data = [
      new VscodeOpenaiTreeItem(Uri.file('file:///c%3A/abc/README.md')),
      new VscodeOpenaiTreeItem(Uri.file('file:///c%3A/abc/CHANGELOG.md')),
      new VscodeOpenaiTreeItem(Uri.file('file:///c%3A/abc/todo.txt')),
    ]
  }

  // Tree data provider

  public getChildren(element: VscodeOpenaiTreeItem): VscodeOpenaiTreeItem[] {
    if (element === undefined) {
      return this.data
    }
    return this.data
  }

  public getTreeItem(element: VscodeOpenaiTreeItem): VscodeOpenaiTreeItem {
    return element
  }

  public async handleDrop(
    target: VscodeOpenaiTreeItem | undefined,
    sources: DataTransfer,
    token: CancellationToken
  ): Promise<void> {
    const transferItem = sources.get('text/uri-list')
    if (!transferItem) {
      createDebugNotification(`drop failed ${transferItem}`)
      return
    }
    createDebugNotification(`drop success ${transferItem}`)

    // const transferFile = transferItem.value
    const transferFile = new URL(transferItem.value)

    try {
      const fileContent = fs.readFileSync(transferFile, {
        encoding: 'utf8',
        flag: 'r',
      })
      // createDebugNotification(`data: ${data}`)

      const treeItem = new VscodeOpenaiTreeItem(Uri.file(transferItem.value))
      this.data.push(treeItem)
      this._onDidChangeTreeData.fire(undefined)
    } catch (error) {
      createErrorNotification(error)
    }
  }

  public async handleDrag(
    source: VscodeOpenaiTreeItem[],
    treeDataTransfer: DataTransfer,
    token: CancellationToken
  ): Promise<void> {
    treeDataTransfer.set(
      'application/vnd.vscode-openai.void',
      new DataTransferItem(source)
    )
  }
}

export class VscodeOpenaiTreeItem extends TreeItem {
  treeItemUri: Uri | undefined
  children: TreeItem[] | undefined

  constructor(treeItemUri: Uri, children?: TreeItem[]) {
    const path = treeItemUri.path
    const label = path.substring(path.lastIndexOf('/') + 1)
    super(
      label,
      children === undefined
        ? TreeItemCollapsibleState.None
        : TreeItemCollapsibleState.Expanded
    )
    this.iconPath = children === undefined ? ThemeIcon.File : ThemeIcon.Folder
    this.resourceUri = treeItemUri
    this.tooltip = 'file has been openai-embedded'
    this.children = children
  }
}

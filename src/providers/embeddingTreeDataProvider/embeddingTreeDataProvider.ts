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

  constructor(
    context: ExtensionContext,
    private _dragAndDropController: EmbeddingTreeDragAndDropController
  ) {
    this._dragAndDropController = new EmbeddingTreeDragAndDropController()
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

    this.data = [
      // new OpenaiTreeItem(Uri.file('file:///c%3A/abc/README.md'), ''),
      // new OpenaiTreeItem(Uri.file('file:///c%3A/abc/CHANGELOG.md'), ''),
      // new OpenaiTreeItem(Uri.file('file:///c%3A/abc/todo.txt'), ''),
    ]
  }

  public getChildren(element: OpenaiTreeItem): OpenaiTreeItem[] {
    if (element === undefined) {
      return this.data
    }
    return this.data
  }

  public getTreeItem(element: OpenaiTreeItem): OpenaiTreeItem {
    return element
  }
}

import * as crypto from 'crypto'
import { TreeItem, TreeItemCollapsibleState, Uri, ThemeIcon } from 'vscode'
import { IEmbedding } from '@app/interfaces'

export class OpenaiTreeItem extends TreeItem implements IEmbedding {
  public timestamp: number
  public embeddingId: string
  children: TreeItem[] | undefined

  constructor(public uri: Uri, public content: string, children?: TreeItem[]) {
    const path = uri.path
    const label = path.substring(path.lastIndexOf('/') + 1)
    super(
      label,
      children === undefined
        ? TreeItemCollapsibleState.None
        : TreeItemCollapsibleState.Expanded
    )

    this.timestamp = new Date().getTime()
    this.embeddingId = crypto.randomUUID()

    this.iconPath = children === undefined ? ThemeIcon.File : ThemeIcon.Folder
    this.tooltip = 'embedded-resource'
    this.children = children
  }
}

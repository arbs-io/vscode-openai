import { IEmbeddingFileLite } from '@app/interfaces'
import { TreeItem, TreeItemCollapsibleState, Uri, ThemeIcon } from 'vscode'

export class EmbeddingTreeItem extends TreeItem {
  children: TreeItem[] | undefined

  constructor(
    public embeddingFileLite: IEmbeddingFileLite,
    children?: TreeItem[]
  ) {
    const label = embeddingFileLite.name
    super(
      label,
      children === undefined
        ? TreeItemCollapsibleState.None
        : TreeItemCollapsibleState.Expanded
    )
    this.resourceUri = Uri.parse(embeddingFileLite.url!)
    this.iconPath = children === undefined ? ThemeIcon.File : ThemeIcon.Folder
    this.tooltip = `name: ${embeddingFileLite.name}\nchuncks: ${embeddingFileLite.chunks?.length}\nsize: ${embeddingFileLite.size}`
    this.children = children
  }
}

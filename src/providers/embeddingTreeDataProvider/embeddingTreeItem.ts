import { IEmbeddingFileLite } from '@app/interfaces'
import { TreeItem, TreeItemCollapsibleState, Uri, ThemeIcon } from 'vscode'

export class EmbeddingTreeItem extends TreeItem {
  children: TreeItem[] | undefined

  constructor(
    public embeddingFileLite: IEmbeddingFileLite,
    children?: TreeItem[]
  ) {
    // const decodeURI = decodeURIComponent(url.path)
    // const label = decodeURI.substring(decodeURI.lastIndexOf('/') + 1)
    const label = embeddingFileLite.embeddingId
    super(
      label,
      children === undefined
        ? TreeItemCollapsibleState.None
        : TreeItemCollapsibleState.Expanded
    )
    // this.resourceUri = url
    this.iconPath = children === undefined ? ThemeIcon.File : ThemeIcon.Folder
    this.tooltip = 'embedded-resource'
    this.children = children
  }
}

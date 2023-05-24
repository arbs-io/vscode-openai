import { TreeItem, TreeItemCollapsibleState, Uri, ThemeIcon } from 'vscode'

export class OpenaiTreeItem extends TreeItem {
  children: TreeItem[] | undefined

  constructor(
    public timestamp: number,
    public embeddingId: string,
    public uri: Uri,
    public content: string,
    children?: TreeItem[]
  ) {
    const decodeURI = decodeURIComponent(uri.path)
    const label = decodeURI.substring(decodeURI.lastIndexOf('/') + 1)
    super(
      label,
      children === undefined
        ? TreeItemCollapsibleState.None
        : TreeItemCollapsibleState.Expanded
    )
    this.resourceUri = uri
    this.iconPath = children === undefined ? ThemeIcon.File : ThemeIcon.Folder
    this.tooltip = 'embedded-resource'
    this.children = children
  }
}

import { TreeItem, TreeItemCollapsibleState, Uri, ThemeIcon } from 'vscode'

export class OpenaiTreeItem extends TreeItem {
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

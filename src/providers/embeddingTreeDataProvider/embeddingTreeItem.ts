import { IEmbeddingFileLite } from '@app/interfaces';
import { TreeItem, TreeItemCollapsibleState, Uri, ThemeIcon } from 'vscode';

export class EmbeddingTreeItem extends TreeItem {
  children: TreeItem[] | undefined;
  private _embeddingId: string;

  constructor(embeddingFileLite: IEmbeddingFileLite, children?: TreeItem[]) {
    super(
      embeddingFileLite.name,
      children === undefined
        ? TreeItemCollapsibleState.None
        : TreeItemCollapsibleState.Expanded
    );
    this._embeddingId = embeddingFileLite.embeddingId;
    this.resourceUri = Uri.parse(embeddingFileLite.url!);
    this.iconPath = children === undefined ? ThemeIcon.File : ThemeIcon.Folder;
    this.tooltip = `name: ${embeddingFileLite.name}\nchuncks: ${embeddingFileLite.chunks?.length}\nsize: ${embeddingFileLite.size}`;
    this.children = children;
  }

  public get embeddingId(): string {
    return this._embeddingId;
  }
}

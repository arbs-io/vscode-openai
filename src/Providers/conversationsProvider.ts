import {
  TreeDataProvider,
  TreeItem,
  TreeItemCollapsibleState,
  window,
} from 'vscode'
import { IConversation } from '@appInterfaces/IConversation'
import { LocalStorageService } from 'vscode-utils'

export class ConversationProvider implements TreeDataProvider<Conversation> {
  getTreeItem(element: Conversation): TreeItem {
    return element
  }

  getChildren(element?: Conversation): Thenable<Conversation[]> {
    const keys = LocalStorageService.instance.keys()
    const conversations: IConversation[] = []
    keys.forEach((key) => {
      console.log(key)
      if (key.startsWith('conversation-')) {
        const conversation =
          LocalStorageService.instance.getValue<IConversation>(key)
        if (conversation !== undefined) {
          conversations.push(conversation)
        }
      }
    })
    return new Promise((resolve, reject) => {
      // do some async task
      conversations
    })
  }
}

class Conversation extends TreeItem {
  constructor(
    public readonly label: string,
    private version: string,
    public readonly collapsibleState: TreeItemCollapsibleState
  ) {
    super(label, collapsibleState)
    this.tooltip = `${this.label}-${this.version}`
    this.description = this.version
  }
}

import { ViewColumn, window, workspace } from 'vscode'
import { IConversation } from '@app/types'

export const openConversationJson = (conversation: IConversation): void => {
  workspace
    .openTextDocument({
      content: JSON.stringify(conversation.chatMessages, undefined, 4),
      language: 'json',
    })
    .then((doc) =>
      window.showTextDocument(doc, {
        preserveFocus: true,
        preview: false,
        viewColumn: ViewColumn.One,
      })
    )
}

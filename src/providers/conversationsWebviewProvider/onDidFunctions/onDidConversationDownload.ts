import { IConversation } from '@app/interfaces'
import { ViewColumn, window, workspace } from 'vscode'

export const onDidConversationDownload = (
  conversation: IConversation
): void => {
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

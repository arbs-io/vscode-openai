import { IConversation } from '@app/interfaces'
import { ViewColumn, window, workspace } from 'vscode'

export const onDidOpenConversationMarkdown = (
  conversation: IConversation
): void => {
  let content = `# ${conversation.persona.roleName}\n`

  content = content + `## Summary\n`
  content = content + `${conversation.summary}\n`

  content = content + `## Content\n`
  conversation.chatMessages.forEach((msg) => {
    if (msg.mine) {
      content = content + `> **Question:** ${msg.content}\n\n`
    } else {
      content = content + `${msg.content}\n\n`
    }
  })

  workspace
    .openTextDocument({
      content: content,
      language: 'markdown',
    })
    .then((doc) =>
      window.showTextDocument(doc, {
        preserveFocus: true,
        preview: false,
        viewColumn: ViewColumn.One,
      })
    )
}

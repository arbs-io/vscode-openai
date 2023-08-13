import { ViewColumn, window, workspace } from 'vscode'
import { Command } from '../commandManager'
import { IConversation } from '@app/types'

export default class OpenConversationMarkdownCommand implements Command {
  public readonly id = '_vscode-openai.conversation.open.markdown'

  public execute(args: { data: IConversation }) {
    const conversation = args.data
    let content = `# ${conversation.persona.roleName}\n## Summary\n${conversation.summary}\n## Content\n`
    conversation.chatMessages.forEach((msg) => {
      content =
        content + `${msg.mine ? '> **Question:**' : ''} ${msg.content}\n\n`
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
}

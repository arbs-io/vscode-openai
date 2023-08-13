import { ViewColumn, window, workspace } from 'vscode'
import { Command } from '../commandManager'
import { IConversation } from '@app/types'

export default class OpenConversationJsonCommand implements Command {
  public readonly id = 'vscode-openai.conversation.open.json'

  public execute(args: { data: IConversation }) {
    workspace
      .openTextDocument({
        content: JSON.stringify(args.data.chatMessages, undefined, 4),
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
}

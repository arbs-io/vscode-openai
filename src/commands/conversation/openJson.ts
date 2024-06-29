import { ViewColumn, window, workspace } from 'vscode'
import { Command } from '../commandManager'
import { IConversation } from '@app/interfaces'

export default class ShowConversationJsonCommand implements Command {
  public readonly id = '_vscode-openai.conversation.show.json'

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

import { window } from 'vscode'
import { Command } from '../commandManager'
import { IConversation } from '@app/types'
import { ConversationStorageService } from '@app/services'

export default class DeleteConversationCommand implements Command {
  public readonly id = 'vscode-openai.conversation.delete'

  public execute(args: { data: IConversation }) {
    window
      .showInformationMessage(
        'Are you sure you want to delete this conversation?',
        'Yes',
        'No'
      )
      .then((answer) => {
        if (answer === 'Yes') {
          ConversationStorageService.instance.delete(args.data.conversationId)
        }
      })
  }
}

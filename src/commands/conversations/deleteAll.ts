import { window } from 'vscode'
import { Command } from '../commandManager'
import { ConversationStorageService } from '@app/services'

export default class DeleteAllConversationsCommand implements Command {
  public readonly id = 'vscode-openai.conversations.delete-all'

  public async execute() {
    window
      .showInformationMessage(
        'Are you sure you want to delete ALL conversation?',
        'Yes',
        'No'
      )
      .then((answer) => {
        if (answer === 'Yes') {
          ConversationStorageService.instance.deleteAll()
        }
      })
  }
}
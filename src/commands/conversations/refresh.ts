import { Command } from '../commandManager'
import { ConversationStorageService } from '@app/services'

export default class RefreshConversationsCommand implements Command {
  public readonly id = 'vscode-openai.conversations.refresh'

  public async execute() {
    ConversationStorageService.instance.refresh()
  }
}

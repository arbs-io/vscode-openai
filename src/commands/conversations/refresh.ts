import { Command } from '../commandManager'
import { ConversationStorageService } from '@app/services'

export default class RefreshCommand implements Command {
  public readonly id = 'vscode-openai.conversations.refresh'
  public constructor() {}

  public async execute() {
    ConversationStorageService.instance.refresh()
  }
}

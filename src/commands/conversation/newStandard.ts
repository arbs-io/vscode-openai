import { Command } from '../commandManager'
import { IConversation } from '@app/types'
import { getSystemPersonas } from '@app/models'
import { ConversationStorageService } from '@app/services'

export default class NewConversationStandardCommand implements Command {
  public readonly id = 'vscode-openai.conversation.new.standard'

  public async execute() {
    const persona = getSystemPersonas().find(
      (a) => a.roleName === 'General Chat'
    )!
    const conversation: IConversation =
      await ConversationStorageService.instance.create(persona)
    ConversationStorageService.instance.update(conversation)
    ConversationStorageService.instance.show(conversation.conversationId)
  }
}

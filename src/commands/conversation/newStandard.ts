import { Command } from '../commandManager'
import { IConversation } from '@app/types'
import { getSystemPersonas } from '@app/models'
import { ConversationStorageService } from '@app/services'
import { VSCODE_OPENAI_QP_PERSONA } from '@app/constants'

export default class NewConversationStandardCommand implements Command {
  public readonly id = 'vscode-openai.conversation.new.standard'

  public async execute() {
    const persona = getSystemPersonas().find(
      (a) => a.roleName === VSCODE_OPENAI_QP_PERSONA.GENERAL
    )!
    const conversation: IConversation =
      await ConversationStorageService.instance.create(persona)
    ConversationStorageService.instance.update(conversation)
    ConversationStorageService.instance.show(conversation.conversationId)
  }
}

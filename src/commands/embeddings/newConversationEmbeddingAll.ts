import { ICommand } from '@app/commands'
import { IConversation } from '@app/interfaces'
import { ConversationStorageService } from '@app/services'
import { getQueryResourcePersona } from '@app/models'
import { VSCODE_OPENAI_EMBEDDING } from '@app/constants'

export default class NewConversationEmbeddingAllCommand implements ICommand {
  public readonly id = 'vscode-openai.embeddings.new.conversation-all'

  public async execute() {
    const persona = getQueryResourcePersona()
    const conversation: IConversation =
      await ConversationStorageService.instance.create(
        persona,
        VSCODE_OPENAI_EMBEDDING.RESOURCE_QUERY_ALL
      )
    ConversationStorageService.instance.update(conversation)
    ConversationStorageService.instance.show(conversation.conversationId)
  }
}

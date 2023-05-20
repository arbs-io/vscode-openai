import { IConversation, IPersonaOpenAI } from '@app/interfaces'
import { ConversationService } from '@app/services'

export const onDidConversationCreate = (persona: IPersonaOpenAI): void => {
  const conversation: IConversation =
    ConversationService.instance.create(persona)
  ConversationService.instance.update(conversation)
  ConversationService.instance.show(conversation.conversationId)
}

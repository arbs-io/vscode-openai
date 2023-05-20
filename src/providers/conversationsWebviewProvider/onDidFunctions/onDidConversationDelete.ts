import { IConversation } from '@app/interfaces'
import { ConversationService } from '@app/services'

export const onDidConversationDelete = (conversation: IConversation): void => {
  ConversationService.instance.delete(conversation.conversationId)
}

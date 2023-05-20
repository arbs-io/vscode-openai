import { IConversation } from '@app/interfaces'
import { ConversationService } from '@app/services'

export const onDidConversationOpen = (conversation: IConversation): void => {
  ConversationService.instance.show(conversation.conversationId)
}

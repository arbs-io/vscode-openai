import { IConversation } from '@app/interfaces'
import { ConversationStorageService } from '@app/services'

export const onDidOpenConversationWebview = (
  conversation: IConversation
): void => {
  ConversationStorageService.instance.show(conversation.conversationId)
}

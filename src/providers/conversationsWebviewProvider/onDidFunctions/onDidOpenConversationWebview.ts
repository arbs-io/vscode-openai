import { IConversation } from '@app/types'
import { ConversationStorageService } from '@app/services'

export const onDidOpenConversationWebview = (
  conversation: IConversation
): void => {
  ConversationStorageService.instance.show(conversation.conversationId)
}

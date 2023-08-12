import { IConversation } from '@app/types'
import { openConversationJson } from '@app/utilities/conversation'

export const onDidOpenConversationJson = (
  conversation: IConversation
): void => {
  openConversationJson(conversation)
}

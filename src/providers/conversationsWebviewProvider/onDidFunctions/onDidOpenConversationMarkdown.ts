import { IConversation } from '@app/types'
import { openConversationMarkdown } from '@app/utilities/conversation'

export const onDidOpenConversationMarkdown = (
  conversation: IConversation
): void => {
  openConversationMarkdown(conversation)
}

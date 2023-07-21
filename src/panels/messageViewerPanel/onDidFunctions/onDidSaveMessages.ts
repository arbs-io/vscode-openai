import { window } from 'vscode'
import { IChatCompletion, IConversation } from '@app/interfaces'
import { ConversationStorageService } from '@app/services'
import { ResponseFormat, createChatCompletion } from '@app/utilities/openai'

export const onDidSaveMessages = (
  conversation: IConversation,
  chatMessages: IChatCompletion[]
): void => {
  try {
    if (!conversation) return

    conversation.chatMessages = chatMessages
    ConversationStorageService.instance.update(conversation)

    //Add summary to conversation
    if (
      conversation.chatMessages.length > 5 &&
      conversation.summary === '<New Conversation>'
    ) {
      //Deep clone for summary
      const summary = JSON.parse(JSON.stringify(conversation)) as IConversation
      const chatCompletion: IChatCompletion = {
        content:
          'Please summarise the content above. The summary must be less than 70 words. Only provide the facts within the content.',
        author: 'summary',
        timestamp: new Date().toLocaleString(),
        mine: false,
        completionTokens: 0,
        promptTokens: 0,
        totalTokens: 0,
      }
      summary.chatMessages.push(chatCompletion)
      createChatCompletion(summary, ResponseFormat.Markdown).then((result) => {
        if (!conversation) return
        if (result?.content) conversation.summary = result?.content
      })
    }
  } catch (error) {
    window.showErrorMessage(error as string)
  }
}

import { window } from 'vscode'
import { IChatCompletion, IConversation } from '@app/interfaces'
import { ConversationService } from '@app/services'
import { ResponseFormat, createChatCompletion } from '@app/utilities/openai'

export const onDidSaveMessages = (
  conversation: IConversation,
  chatMessages: IChatCompletion[]
): void => {
  try {
    if (!conversation) return

    conversation.chatMessages = chatMessages
    ConversationService.instance.update(conversation)

    //Add summary to conversation
    if (
      conversation.chatMessages.length > 5 &&
      conversation.summary === '<New Conversation>'
    ) {
      //Deep clone for summary
      const summary = JSON.parse(JSON.stringify(conversation)) as IConversation
      const chatCompletion: IChatCompletion = {
        content:
          'Summarise the conversation in one sentence. Be as concise as possible and only provide the facts. Start the sentence with the key points. Using no more than 150 characters',
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

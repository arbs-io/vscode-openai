import { ConfigurationConversationService } from '@app/services'
import { IConversation } from '@app/types'
import { ResponseFormat } from '.'

export async function ChatCompletionRequestMessageStandard(
  conversation: IConversation,
  responseFormat: ResponseFormat
): Promise<
  Array<{ role: 'system' | 'user' | 'assistant' | 'function'; content: string }>
> {
  const chatCompletion: Array<{
    role: 'system' | 'user' | 'assistant' | 'function'
    content: string
  }> = []

  const content = [
    `${conversation.persona.prompt.system}`,
    responseFormat,
  ].join('\n')

  chatCompletion.push({
    role: 'system',
    content: content,
  })

  const conversationHistory =
    ConfigurationConversationService.instance.conversationHistory
  conversation.chatMessages
    .splice(conversationHistory * -1)
    .forEach((chatMessage) => {
      chatCompletion.push({
        role: chatMessage.mine ? 'user' : 'assistant',
        content: chatMessage.content,
      })
    })

  return chatCompletion
}

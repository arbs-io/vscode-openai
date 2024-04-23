import { OpenAI } from 'openai'
import { ConfigurationConversationService } from '@app/services'
import { IConversation } from '@app/types'

export async function ChatCompletionRequestMessageStandard(
  conversation: IConversation
): Promise<Array<OpenAI.ChatCompletionMessageParam>> {
  const chatCompletion: Array<OpenAI.ChatCompletionMessageParam> = []
  const content = [`${conversation.persona.prompt.system}`].join('\n')

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

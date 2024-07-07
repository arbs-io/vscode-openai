import { OpenAI } from 'openai'
import { ConversationConfig as ccs } from '@app/services'
import { IConversation } from '@app/interfaces'

export async function ChatCompletionRequestMessageStandard(
  conversation: IConversation
): Promise<Array<OpenAI.ChatCompletionMessageParam>> {
  const chatCompletion: Array<OpenAI.ChatCompletionMessageParam> = []
  const content = [`${conversation.persona.prompt.system}`].join('\n')

  chatCompletion.push({
    role: 'system',
    content: content,
  })

  const conversationHistory = ccs.conversationHistory
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

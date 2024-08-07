import { OpenAI } from 'openai'
import { ConversationConfig as convCfg } from '@app/services'
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

  const conversationHistory = forceToOdd(convCfg.conversationHistory)

  let isUserRole = true
  conversation.chatMessages
    .splice(conversationHistory * -1)
    .forEach((chatMessage) => {
      chatCompletion.push({
        role: isUserRole ? 'user' : 'assistant',
        content: chatMessage.content,
      })
      isUserRole = !isUserRole
    })

  return chatCompletion
}

// Some model require the first role to be user and the last. Therefore
// breaking some alter roles for even number of history items. Because
// we always have a system role in the request...
function forceToOdd(value: number): number {
  if (value % 2 === 0) {
    return value - 1
  } else {
    return value
  }
}

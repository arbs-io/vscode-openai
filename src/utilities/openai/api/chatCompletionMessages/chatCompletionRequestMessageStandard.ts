import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from 'openai'
import { ConfigurationConversationService } from '@app/services'
import { IConversation } from '@app/interfaces'
import { ResponseFormat } from '.'

export async function ChatCompletionRequestMessageStandard(
  conversation: IConversation,
  responseFormat: ResponseFormat
): Promise<ChatCompletionRequestMessage[]> {
  const chatCompletion: ChatCompletionRequestMessage[] = []

  const content = [
    `${conversation.persona.prompt.system}`,
    responseFormat,
  ].join('\n')

  chatCompletion.push({
    role: ChatCompletionRequestMessageRoleEnum.System,
    content: content,
  })

  const conversationHistory =
  ConfigurationConversationService.instance.conversationHistory
  conversation.chatMessages
    .splice(conversationHistory * -1)
    .forEach((chatMessage) => {
      chatCompletion.push({
        role: chatMessage.mine
          ? ChatCompletionRequestMessageRoleEnum.User
          : ChatCompletionRequestMessageRoleEnum.Assistant,
        content: chatMessage.content,
      })
    })
  return chatCompletion
}

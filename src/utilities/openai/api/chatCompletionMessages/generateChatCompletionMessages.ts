import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from 'openai'
import { ConfigurationService } from '@app/services'
import { IConversation, IMessage } from '@app/interfaces'
import { ResponseFormat } from '.'

export async function GenerateChatCompletionMessages(
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

  const conversationHistory = ConfigurationService.instance.conversationHistory
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

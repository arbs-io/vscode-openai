import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai'
import { ExtensionStatusBarItem } from '@app/utilities/vscode'
import { ConfigurationService } from '@app/services'
import { IConversation, IMessage } from '@app/interfaces'
import { errorHandler } from './errorHandler'

async function buildMessages(
  conversation: IConversation
): Promise<ChatCompletionRequestMessage[]> {
  const chatCompletion: ChatCompletionRequestMessage[] = []

  chatCompletion.push({
    role: ChatCompletionRequestMessageRoleEnum.System,
    content: `You are a ${conversation.persona.prompt.system}`,
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

export async function createChatCompletion(
  conversation: IConversation
): Promise<IMessage | undefined> {
  try {
    ExtensionStatusBarItem.instance.showStatusBarInformation(
      'sync~spin',
      '- waiting'
    )
    const apiKey = await ConfigurationService.instance.getApiKey()
    if (!apiKey) return undefined

    const configuration = new Configuration({
      apiKey: apiKey,
      basePath: ConfigurationService.instance.inferenceUrl,
    })
    const openai = new OpenAIApi(configuration)

    const chatCompletions = await buildMessages(conversation)

    const completion = await openai.createChatCompletion(
      {
        model: ConfigurationService.instance.defaultModel,
        messages: chatCompletions,
        temperature: 0.2,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      },
      await ConfigurationService.instance.getRequestConfig()
    )

    const content = completion.data.choices[0].message?.content
    if (!content) return undefined
    const message: IMessage = {
      content: content,
      completionTokens: completion.data.usage?.completion_tokens
        ? completion.data.usage?.completion_tokens
        : 0,
      promptTokens: completion.data.usage?.prompt_tokens
        ? completion.data.usage?.prompt_tokens
        : 0,
      totalTokens: completion.data.usage?.total_tokens
        ? completion.data.usage?.total_tokens
        : 0,
    }

    ExtensionStatusBarItem.instance.showStatusBarInformation(
      'vscode-openai',
      ''
    )
    return message
  } catch (error: any) {
    errorHandler(error)
    throw error
  }
}

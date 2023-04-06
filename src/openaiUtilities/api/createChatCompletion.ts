import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
  Configuration,
  OpenAIApi,
} from 'openai'
import {
  ExtensionStatusBarItem,
  ConfigurationService,
} from '../../vscodeUtilities'
import { IConversation, IChatCompletion, IMessage } from '../../interfaces'
import { errorHandler } from './errorHandler'

async function buildMessages(
  conversation: IConversation
): Promise<ChatCompletionRequestMessage[]> {
  const chatCompletion: ChatCompletionRequestMessage[] = []

  chatCompletion.push({
    role: ChatCompletionRequestMessageRoleEnum.System,
    content: `You are a ${conversation.persona.prompt.system}`,
  })

  conversation.chatMessages.forEach((chatMessage) => {
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
    const requestConfig = await ConfigurationService.instance.get()

    ExtensionStatusBarItem.instance.showStatusBarInformation(
      'sync~spin',
      '- waiting'
    )
    if (!requestConfig.apiKey) return undefined

    const configuration = new Configuration({
      apiKey: requestConfig.apiKey,
      basePath: requestConfig.inferenceUrl,
    })
    const openai = new OpenAIApi(configuration)

    const chatCompletions = await buildMessages(conversation)

    const completion = await openai.createChatCompletion(
      {
        model: requestConfig.defaultModel,
        messages: chatCompletions,
        temperature: 0.2,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      },
      requestConfig.requestConfig
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

    ExtensionStatusBarItem.instance.showStatusBarInformation('unlock', '')
    return message
  } catch (error: any) {
    errorHandler(error)
    throw error
  }
}

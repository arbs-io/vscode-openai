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
import {
  createErrorNotification,
  createInfoNotification,
} from '@app/utilities/node'

export enum ResponseFormat {
  Markdown = '- vscode-openai response should be in markdown and always displays code as markdown in markdown fenced code block, with the language tag. For example "```xml", "```cpp" and "```go"',
  SourceCode = `- vscode-openai response must be able to compile. Only providing source code must be plain text and not markdown or markdown fenced code block. All information must be in "comment" format, for example "//" for cpp, "#" for python, ...`,
}

let sessionToken = 0
async function buildMessages(
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

export async function createChatCompletion(
  conversation: IConversation,
  responseFormat: ResponseFormat
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

    const chatCompletions = await buildMessages(conversation, responseFormat)

    const requestConfig = await ConfigurationService.instance.getRequestConfig()
    const completion = await openai.createChatCompletion(
      {
        model: ConfigurationService.instance.defaultModel,
        messages: chatCompletions,
        temperature: 0.2,
        frequency_penalty: 0.5,
        presence_penalty: 0.5,
      },
      requestConfig
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

    sessionToken = sessionToken + message.totalTokens

    LogChatCompletion(message)
    ExtensionStatusBarItem.instance.showStatusBarInformation(
      'vscode-openai',
      ''
    )
    return message
  } catch (error: any) {
    errorHandler(error)
  }
}

const LogChatCompletion = (message: IMessage) => {
  try {
    const infoMap = new Map<string, string>()
    const instance = ConfigurationService.instance
    infoMap.set('service_provider', instance.serviceProvider)
    infoMap.set('default_model', instance.defaultModel)
    infoMap.set('tokens_prompt', message.promptTokens.toString())
    infoMap.set('tokens_completion', message.completionTokens.toString())
    infoMap.set('tokens_total', message.totalTokens.toString())
    infoMap.set('tokens_session', sessionToken.toString())

    createInfoNotification(Object.fromEntries(infoMap), 'chat-completion')
  } catch (error) {
    createErrorNotification(error)
  }
}

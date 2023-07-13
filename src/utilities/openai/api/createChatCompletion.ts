import { Configuration, OpenAIApi } from 'openai'
import { BackoffOptions, backOff } from 'exponential-backoff'
import { StatusBarServiceProvider } from '@app/utilities/vscode'
import {
  ConfigurationConversationService,
  ConfigurationSettingService,
} from '@app/services'
import { IConversation, IMessage } from '@app/interfaces'
import { errorHandler } from './errorHandler'
import {
  ChatCompletionRequestMessageEmbedding,
  ChatCompletionRequestMessageStandard,
  LogChatCompletion,
  ResponseFormat,
} from './chatCompletionMessages'

export async function createChatCompletion(
  conversation: IConversation,
  responseFormat: ResponseFormat
): Promise<IMessage | undefined> {
  try {
    StatusBarServiceProvider.instance.showStatusBarInformation(
      'sync~spin',
      '- build-conversation'
    )
    const apiKey = await ConfigurationSettingService.instance.getApiKey()
    if (!apiKey) return undefined

    const configuration = new Configuration({
      apiKey: apiKey,
      basePath: ConfigurationSettingService.instance.inferenceUrl,
    })
    const openai = new OpenAIApi(configuration)

    const chatCompletionMessages = conversation.embeddingId
      ? await ChatCompletionRequestMessageEmbedding(conversation)
      : await ChatCompletionRequestMessageStandard(conversation, responseFormat)

    const requestConfig =
      await ConfigurationSettingService.instance.getRequestConfig()

    StatusBarServiceProvider.instance.showStatusBarInformation(
      'sync~spin',
      '- completion'
    )

    const backoffOptions: BackoffOptions = {
      numOfAttempts: ConfigurationConversationService.instance.numOfAttempts,
      retry: async (_e: any, _attemptNumber: number) => {
        const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
        await sleep(1000)
        return true
      },
    }

    const completion = await backOff(
      () =>
        openai.createChatCompletion(
          {
            model: ConfigurationSettingService.instance.defaultModel,
            messages: chatCompletionMessages,
            temperature: ConfigurationConversationService.instance.temperature,
            frequency_penalty:
              ConfigurationConversationService.instance.frequencyPenalty,
            presence_penalty:
              ConfigurationConversationService.instance.presencePenalty,
          },
          requestConfig
        ),
      backoffOptions
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

    LogChatCompletion(message)
    StatusBarServiceProvider.instance.showStatusBarInformation(
      'vscode-openai',
      ''
    )
    return message
  } catch (error: any) {
    errorHandler(error)
  }
}

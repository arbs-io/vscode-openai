import { Configuration, OpenAIApi } from 'openai'
import { BackoffOptions, backOff } from 'exponential-backoff'
import { StatusBarHelper } from '@app/utilities/vscode'
import { ConfigurationService } from '@app/services'
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
    StatusBarHelper.instance.showStatusBarInformation(
      'sync~spin',
      '- build-conversation'
    )
    const apiKey = await ConfigurationService.instance.getApiKey()
    if (!apiKey) return undefined

    const configuration = new Configuration({
      apiKey: apiKey,
      basePath: ConfigurationService.instance.inferenceUrl,
    })
    const openai = new OpenAIApi(configuration)

    const chatCompletionMessages = conversation.embeddingId
      ? await ChatCompletionRequestMessageEmbedding(conversation)
      : await ChatCompletionRequestMessageStandard(conversation, responseFormat)

    const requestConfig = await ConfigurationService.instance.getRequestConfig()

    StatusBarHelper.instance.showStatusBarInformation(
      'sync~spin',
      '- completion'
    )

    const backoffOptions: BackoffOptions = {
      numOfAttempts: 20,
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
            model: ConfigurationService.instance.defaultModel,
            messages: chatCompletionMessages,
            temperature: 0.2,
            frequency_penalty: 0.5,
            presence_penalty: 0.5,
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
    StatusBarHelper.instance.showStatusBarInformation('vscode-openai', '')
    return message
  } catch (error: any) {
    errorHandler(error)
  }
}

import { OpenAI } from 'openai'
import { StatusBarServiceProvider } from '@app/apis/vscode'
import { ConfigurationConversationService } from '@app/services'
import { IChatCompletionConfig, IConversation, IMessage } from '@app/interfaces'
import { errorHandler } from './errorHandler'
import {
  ChatCompletionRequestMessageEmbedding,
  ChatCompletionRequestMessageStandard,
  LogChatCompletion,
} from './chatCompletionMessages'

export async function createChatCompletion(
  conversation: IConversation,
  chatCompletionConfig: IChatCompletionConfig
): Promise<IMessage | undefined> {
  try {
    StatusBarServiceProvider.instance.showStatusBarInformation(
      'sync~spin',
      '- build-conversation'
    )

    const azureApiVersion = chatCompletionConfig.azureApiVersion
    const apiKey = await chatCompletionConfig.apiKey
    if (!apiKey) return undefined

    const openai = new OpenAI({
      apiKey: apiKey,
      defaultQuery: { 'api-version': azureApiVersion },
      defaultHeaders: { 'api-key': apiKey },
      baseURL: chatCompletionConfig.baseURL,
      maxRetries: ConfigurationConversationService.instance.numOfAttempts,
    })

    const chatCompletionMessages = conversation.embeddingId
      ? await ChatCompletionRequestMessageEmbedding(conversation)
      : await ChatCompletionRequestMessageStandard(conversation)

    const requestConfig = await chatCompletionConfig.requestConfig

    StatusBarServiceProvider.instance.showStatusBarInformation(
      'sync~spin',
      '- completion'
    )

    const results = await openai.chat.completions.create(
      {
        model: chatCompletionConfig.model,
        messages: chatCompletionMessages,
        temperature: ConfigurationConversationService.instance.temperature,
        frequency_penalty:
          ConfigurationConversationService.instance.frequencyPenalty,
        presence_penalty:
          ConfigurationConversationService.instance.presencePenalty,
        top_p: ConfigurationConversationService.instance.topP,
        max_tokens: ConfigurationConversationService.instance.maxTokens,
      },
      requestConfig
    )

    const content = results.choices[0].message.content
    if (!content) return undefined
    const message: IMessage = {
      content: content,
      completionTokens: results.usage?.completion_tokens
        ? results.usage?.completion_tokens
        : 0,
      promptTokens: results.usage?.prompt_tokens
        ? results.usage?.prompt_tokens
        : 0,
      totalTokens: results.usage?.total_tokens
        ? results.usage?.total_tokens
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
  return undefined
}

import { OpenAI } from 'openai'
import { StatusBarServiceProvider } from '@app/apis/vscode'
import { ConversationConfig as convCfg } from '@app/services'
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
      maxRetries: convCfg.numOfAttempts,
    })

    const chatCompletionMessages = conversation.embeddingId
      ? await ChatCompletionRequestMessageEmbedding(conversation)
      : await ChatCompletionRequestMessageStandard(conversation)

    const requestConfig = await chatCompletionConfig.requestConfig

    StatusBarServiceProvider.instance.showStatusBarInformation(
      'sync~spin',
      '- completion'
    )

    const cfg: any = {
      model: chatCompletionConfig.model,
      messages: chatCompletionMessages,
    }

    if (convCfg.presencePenalty !== 0)
      cfg.presence_penalty = convCfg.presencePenalty
    if (convCfg.frequencyPenalty !== 0)
      cfg.frequency_penalty = convCfg.frequencyPenalty
    if (convCfg.temperature !== 0.2) cfg.temperature = convCfg.temperature
    if (convCfg.topP !== 1) cfg.top_p = convCfg.topP
    if (convCfg.maxTokens !== undefined) cfg.max_tokens = convCfg.maxTokens

    const results = await openai.chat.completions.create(cfg, requestConfig)

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

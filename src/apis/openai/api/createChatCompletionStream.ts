import { StatusBarServiceProvider } from '@app/apis/vscode'
import { ConversationConfig as convCfg } from '@app/services'
import {
  IChatCompletion,
  IChatCompletionConfig,
  IConversation,
  IMessage,
} from '@app/interfaces'

import { createOpenAI, errorHandler } from '@app/apis/openai'
import {
  ChatCompletionCreateParamsStreaming,
  ChatCompletionRequestMessageEmbedding,
  ChatCompletionRequestMessageStandard,
} from '@app/apis/openai/api/chatCompletionMessages'
import { createInfoNotification } from '@app/apis/node'
import { MessageViewerPanel } from '@app/panels'

export async function createChatCompletionStream(
  conversation: IConversation,
  chatCompletionConfig: IChatCompletionConfig
): Promise<IMessage | undefined> {
  try {
    StatusBarServiceProvider.instance.showStatusBarInformation(
      'sync~spin',
      '- build-conversation'
    )

    const openai = await createOpenAI(chatCompletionConfig.baseURL)
    const chatCompletionMessages = conversation.embeddingId
      ? await ChatCompletionRequestMessageEmbedding(conversation)
      : await ChatCompletionRequestMessageStandard(conversation)

    const requestConfig = await chatCompletionConfig.requestConfig

    StatusBarServiceProvider.instance.showStatusBarInformation(
      'sync~spin',
      '- completion'
    )

    const cfg: ChatCompletionCreateParamsStreaming = {
      model: chatCompletionConfig.model,
      messages: chatCompletionMessages,
      stream: true,
    }

    if (convCfg.presencePenalty !== 0)
      cfg.presence_penalty = convCfg.presencePenalty
    if (convCfg.frequencyPenalty !== 0)
      cfg.frequency_penalty = convCfg.frequencyPenalty
    if (convCfg.temperature !== 0.2) cfg.temperature = convCfg.temperature
    if (convCfg.topP !== 1) cfg.top_p = convCfg.topP
    if (convCfg.maxTokens !== undefined) cfg.max_tokens = convCfg.maxTokens

    const author = `${conversation?.persona.roleName} (${conversation?.persona.configuration.service})`
    const chatCompletion: IChatCompletion = {
      content: '',
      author: author,
      timestamp: new Date().toLocaleString(),
      mine: false,
      completionTokens: 0,
      promptTokens: 0,
      totalTokens: 0,
    }
    MessageViewerPanel.postMessage(
      'onWillAnswerMessage',
      JSON.stringify(chatCompletion)
    )

    const results = await openai.chat.completions.create(cfg, requestConfig)

    for await (const chunk of results) {
      const content = chunk.choices[0]?.delta?.content ?? ''
      createInfoNotification(content)
      MessageViewerPanel.postMessage('onWillAnswerMessageStream', content)
    }

    StatusBarServiceProvider.instance.showStatusBarInformation(
      'vscode-openai',
      ''
    )
    return undefined
  } catch (error: any) {
    errorHandler(error)
  }
  return undefined
}

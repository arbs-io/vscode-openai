import { StatusBarServiceProvider } from '@app/apis/vscode'
import { ConversationConfig as convCfg } from '@app/services'
import {
  IChatCompletion,
  IChatCompletionConfig,
  IConversation,
  IMessage,
} from '@app/interfaces'

import { createOpenAI } from '@app/apis/openai'
import {
  ChatCompletionCreateParamsStreaming,
  ChatCompletionRequestMessageEmbedding,
  ChatCompletionRequestMessageStandard,
  LogChatCompletion,
} from '@app/apis/openai/api/chatCompletionMessages'
import { MessageViewerPanel } from '@app/panels'

export async function createChatCompletionStream(
  conversation: IConversation,
  chatCompletionConfig: IChatCompletionConfig
): Promise<boolean> {
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
      '- stream'
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

    const results = await openai.chat.completions.create(cfg, requestConfig)

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

    let tokenCount = 0
    let fullContent = ''
    for await (const chunk of results) {
      const content = chunk.choices[0]?.delta?.content ?? ''
      MessageViewerPanel.postMessage('onWillAnswerMessageStream', content)
      fullContent += content
      tokenCount++
    }

    const message: IMessage = {
      content: fullContent,
      completionTokens: 0,
      promptTokens: 0,
      totalTokens: tokenCount || 0,
    }
    LogChatCompletion(message)

    StatusBarServiceProvider.instance.showStatusBarInformation(
      'vscode-openai',
      ''
    )
  } catch (error: any) {
    StatusBarServiceProvider.instance.showStatusBarInformation(
      'sync~spin',
      '- stream (failed)'
    )
    return false
  }
  return true
}

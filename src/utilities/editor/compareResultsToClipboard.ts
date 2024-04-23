import {
  ConfigurationSettingService,
  ConversationStorageService,
} from '@app/services'
import {
  IChatCompletion,
  IChatCompletionConfig,
  IConversation,
  IPersonaOpenAI,
} from '@app/types'
import { createChatCompletion } from '@app/apis/openai'
import { compareFileToClipboard } from '@app/apis/vscode'

export const compareResultsToClipboard = async (
  persona: IPersonaOpenAI | undefined,
  prompt: string | undefined
): Promise<void> => {
  if (persona && prompt) {
    const conversation: IConversation =
      await ConversationStorageService.instance.create(persona)

    const chatCompletion: IChatCompletion = {
      content: prompt,
      author: 'vscode-openai-editor',
      timestamp: new Date().toLocaleString(),
      mine: false,
      completionTokens: 0,
      promptTokens: 0,
      totalTokens: 0,
    }

    const chatCompletionConfig: IChatCompletionConfig = {
      azureApiVersion: ConfigurationSettingService.azureApiVersion,
      apiKey: ConfigurationSettingService.getApiKey(),
      baseURL: ConfigurationSettingService.inferenceUrl,
      model: ConfigurationSettingService.defaultModel,
      requestConfig: ConfigurationSettingService.getRequestConfig(),
    }

    conversation.chatMessages.splice(0) //clear welcome message
    conversation.chatMessages.push(chatCompletion)
    const result = await createChatCompletion(
      conversation,
      chatCompletionConfig
    )
    compareFileToClipboard(result?.content ? result?.content : '')
  }
}

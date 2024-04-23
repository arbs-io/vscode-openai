import {
  IChatCompletion,
  IChatCompletionConfig,
  IConversation,
} from '@app/types'
import { getSystemPersonas } from '@app/models'
import {
  ConfigurationSettingService,
  ConversationStorageService,
} from '@app/services'
import { createChatCompletion } from '@app/apis/openai'
import { VSCODE_OPENAI_QP_PERSONA } from '@app/constants'
import { workspace } from 'vscode'

// This function generates comments for the given git differences using OpenAI's chatbot API.
// It takes a string representing the git differences as input and returns a Promise that resolves to a string.
export const getComments = async (diff: string): Promise<string> => {
  const persona = getSystemPersonas().find(
    (a) => a.roleName === VSCODE_OPENAI_QP_PERSONA.DEVELOPER
  )
  if (persona) {
    const conversation: IConversation =
      await ConversationStorageService.instance.create(persona)

    const personaPrompt = workspace
      .getConfiguration('vscode-openai')
      .get(`prompts.persona.scm`) as string

    const prompt = [personaPrompt, diff].join('\n')

    const chatCompletion: IChatCompletion = {
      content: prompt,
      author: 'vscode-openai-editor',
      timestamp: new Date().toLocaleString(),
      mine: false,
      completionTokens: 0,
      promptTokens: 0,
      totalTokens: 0,
    }
    conversation.chatMessages.push(chatCompletion)

    const chatCompletionConfig: IChatCompletionConfig = {
      azureApiVersion: ConfigurationSettingService.azureApiVersion,
      apiKey: ConfigurationSettingService.getApiKey(),
      baseURL: ConfigurationSettingService.scmUrl,
      model: ConfigurationSettingService.scmModel,
      requestConfig: ConfigurationSettingService.getRequestConfig(),
    }

    const result = await createChatCompletion(
      conversation,
      chatCompletionConfig
    )
    return result?.content ? result?.content : ''
  }
  return ''
}

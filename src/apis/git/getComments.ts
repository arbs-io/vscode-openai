import { IChatCompletion, IConversation } from '@app/interfaces'
import { getSystemPersonas } from '@app/models'
import { ConversationStorageService } from '@app/services'
import { createChatCompletionMessage } from '@app/apis/openai'
import { VSCODE_OPENAI_QP_PERSONA } from '@app/constants'
import { workspace } from 'vscode'
import {
  ChatCompletionConfig,
  ChatCompletionModelType,
} from '@app/services/configuration'

// This function generates comments for the given git differences using OpenAI's chatbot API.
// It takes a string representing the git differences as input and returns a Promise that resolves to a string.
export const getComments = async (diff: string): Promise<string> => {
  try {
    const persona = getSystemPersonas().find(
      (a) => a.roleName === VSCODE_OPENAI_QP_PERSONA.DEVELOPER
    )

    if (!persona) {
      throw new Error('Developer persona not found.')
    }
    const conversation: IConversation =
      await ConversationStorageService.instance.create(persona)

    const personaPrompt = workspace
      .getConfiguration('vscode-openai')
      .get(`prompts.persona.scm`) as string

    const prompt = `${personaPrompt}\n${diff}`

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

    const cfg = ChatCompletionConfig.create(ChatCompletionModelType.SCM)

    let result = ''
    function messageCallback(_type: string, data: IChatCompletion): void {
      result = data.content
    }

    await createChatCompletionMessage(conversation, cfg, messageCallback)
    return result ?? ''
  } catch (error) {
    console.error('Failed to generate comments:', error)
    return '' // Return empty string in case of error
  }
}

import { IChatCompletion, IConversation } from '@app/types'
import { getSystemPersonas } from '@app/models'
import { ConversationStorageService } from '@app/services'
import { createChatCompletion } from '@app/apis/openai'
import { VSCODE_OPENAI_QP_PERSONA } from '@app/constants'
import { workspace } from 'vscode'
import { ChatCompletionConfigFactory } from '@app/services/configurationServices'

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

    const cfg = ChatCompletionConfigFactory.createConfig('scm_model')

    const result = await createChatCompletion(conversation, cfg)
    return result?.content ?? ''
  } catch (error) {
    console.error('Failed to generate comments:', error)
    return '' // Return empty string in case of error
  }
}

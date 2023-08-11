import { IChatCompletion, IConversation } from '@app/types'
import { getSystemPersonas } from '@app/models'
import { ConversationStorageService } from '@app/services'
import { createChatCompletion, ResponseFormat } from '@app/apis/openai'

// This function generates comments for the given git differences using OpenAI's chatbot API.
// It takes a string representing the git differences as input and returns a Promise that resolves to a string.
export const getComments = async (diff: string): Promise<string> => {
  const persona = getSystemPersonas().find(
    (a) => a.roleName === 'Developer/Programmer'
  )
  if (persona) {
    const conversation: IConversation =
      await ConversationStorageService.instance.create(persona)

    const prompt = [
      'Each line should be less than 72 characters.',
      'Use the following format:',
      'The changes made in this commit include:',
      '- Added [file name]',
      '- Modified [file name] to [brief description of change]',
      '- Deleted [file name]',
      'Please summarise the following git diff',
      diff,
    ].join('\n')

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
    const result = await createChatCompletion(
      conversation,
      ResponseFormat.SourceCode
    )
    return result?.content ? result?.content : ''
  }
  return ''
}

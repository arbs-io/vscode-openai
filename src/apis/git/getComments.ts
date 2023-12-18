import { IChatCompletion, IConversation } from '@app/types'
import { getSystemPersonas } from '@app/models'
import { ConversationStorageService } from '@app/services'
import { createChatCompletion } from '@app/apis/openai'

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
      'Given the following git diff information, please provide a brief summary of the changes.',
      '- Each line MUST be LESS than 50 characters.',
      '- The summary MUST include important aspects of the modifications.',
      '- The comments MUST be in plain text format, suitable for human readable.',
      'Use the following format:',
      '🟢 [file name] for new files',
      '🛠️ [file name] -> [brief description of change] for modified files',
      '🔴 [file name] for deleted files',
      'The Git diff to summarise is below:',
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
    const result = await createChatCompletion(conversation)
    return result?.content ? result?.content : ''
  }
  return ''
}

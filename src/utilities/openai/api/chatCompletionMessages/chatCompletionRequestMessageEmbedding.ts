import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from 'openai'
import { ConfigurationService, EmbeddingStorageService } from '@app/services'
import { IConversation, IEmbeddingFileLite } from '@app/interfaces'
import { searchFileChunks } from '@app/utilities/embedding'

const MAX_FILES_LENGTH = 2000 * 3
const MAX_RESULTS = 15

export async function ChatCompletionRequestMessageEmbedding(
  conversation: IConversation
): Promise<ChatCompletionRequestMessage[]> {
  const chatCompletion: ChatCompletionRequestMessage[] = []

  chatCompletion.push({
    role: ChatCompletionRequestMessageRoleEnum.System,
    content: conversation.persona.prompt.system,
  })

  const searchQuery =
    conversation.chatMessages[conversation.chatMessages.length - 1].content

  let embeddingFileLites: IEmbeddingFileLite[] = []
  conversation.embeddingId!.forEach((embeddingId) => {
    const embeddingFileLite = EmbeddingStorageService.instance.get(embeddingId)
    if (embeddingFileLite) embeddingFileLites = [...[embeddingFileLite]]
  })

  const searchFiles = await searchFileChunks({
    searchQuery: searchQuery,
    files: embeddingFileLites,
    maxResults: MAX_RESULTS,
  })

  const filesString = searchFiles
    .map((searchFiles) => `###\n"${searchFiles.filename}"\n${searchFiles.text}`)
    .join('\n')
    .slice(0, MAX_FILES_LENGTH)

  const content =
    `Question: ${searchQuery}\n\n` + `Files:\n${filesString}\n\n` + `Answer:`

  const conversationHistory = ConfigurationService.instance.conversationHistory
  chatCompletion.push({
    role: ChatCompletionRequestMessageRoleEnum.Assistant,
    content: content,
  })

  return chatCompletion
}

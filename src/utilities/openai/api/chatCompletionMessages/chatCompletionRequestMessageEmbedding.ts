import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from 'openai'
import { EmbeddingStorageService } from '@app/services'
import { IConversation, IEmbeddingFileLite } from '@app/interfaces'
import { searchFileChunks } from '@app/utilities/embedding'
import { StatusBarHelper } from '@app/utilities/vscode'

export async function ChatCompletionRequestMessageEmbedding(
  conversation: IConversation
): Promise<ChatCompletionRequestMessage[]> {
  const MAX_RESULTS = 10

  StatusBarHelper.instance.showStatusBarInformation(
    'sync~spin',
    `- search file chunks (${MAX_RESULTS})`
  )

  const chatCompletion: ChatCompletionRequestMessage[] = []

  chatCompletion.push({
    role: ChatCompletionRequestMessageRoleEnum.System,
    content: conversation.persona.prompt.system,
  })

  const searchQuery =
    conversation.chatMessages[conversation.chatMessages.length - 1].content

  const embeddingFileLites: Array<IEmbeddingFileLite> = []
  conversation.embeddingId!.forEach((embeddingId) => {
    const embeddingFileLite = EmbeddingStorageService.instance.get(embeddingId)
    if (embeddingFileLite) embeddingFileLites.push(embeddingFileLite)
  })

  const searchFiles = await searchFileChunks({
    searchQuery: searchQuery,
    files: embeddingFileLites,
    maxResults: MAX_RESULTS,
  })

  StatusBarHelper.instance.showStatusBarInformation(
    'sync~spin',
    `- found file chunks (${searchFiles.length})`
  )

  const filesString = searchFiles
    .map((searchFiles) => `###\n"${searchFiles.filename}"\n${searchFiles.text}`)
    .join('\n')
    .slice(0)

  const content =
    `Question: ${searchQuery}\n\n` + `Files:\n${filesString}\n\n` + `Answer:`

  chatCompletion.push({
    role: ChatCompletionRequestMessageRoleEnum.Assistant,
    content: content,
  })

  StatusBarHelper.instance.showStatusBarInformation('vscode-openai', '')

  return chatCompletion
}

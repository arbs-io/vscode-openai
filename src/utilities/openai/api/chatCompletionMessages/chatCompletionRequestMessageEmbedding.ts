import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageRoleEnum,
} from 'openai'
import { ConfigurationService, EmbeddingStorageService } from '@app/services'
import { IConversation, IEmbeddingFileLite } from '@app/interfaces'
import { searchFileChunks } from '@app/utilities/embedding'

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

  const abc = await searchFileChunks({
    searchQuery: searchQuery,
    files: embeddingFileLites,
    maxResults: 10,
  })

  const conversationHistory = ConfigurationService.instance.conversationHistory
  conversation.chatMessages
    .splice(conversationHistory * -1)
    .forEach((chatMessage) => {
      chatCompletion.push({
        role: chatMessage.mine
          ? ChatCompletionRequestMessageRoleEnum.User
          : ChatCompletionRequestMessageRoleEnum.Assistant,
        content: chatMessage.content,
      })
    })
  return chatCompletion
}

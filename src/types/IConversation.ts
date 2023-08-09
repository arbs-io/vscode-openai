import { IPersonaOpenAI, IChatCompletion } from '@app/types'

export interface IConversation {
  timestamp: number
  conversationId: string
  persona: IPersonaOpenAI
  summary: string
  embeddingId?: string
  chatMessages: IChatCompletion[]
}

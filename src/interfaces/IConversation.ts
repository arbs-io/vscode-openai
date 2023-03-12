import { IChatMessage } from './IChatMessage'

export interface IConversation {
  conversationId: string
  personaId: string
  summary: string
  chatMessages: IChatMessage[]
}

import { IPersonaOpenAI } from './IPersonaOpenAI'
import { IChatMessage } from './IChatMessage'

export interface IConversation {
  timestamp: number
  conversationId: string
  persona: IPersonaOpenAI
  summary: string
  chatMessages: IChatMessage[]
}

import { IPersonaOpenAI, IChatMessage } from '.'

export interface IConversation {
  timestamp: number
  conversationId: string
  persona: IPersonaOpenAI
  summary: string
  chatMessages: IChatMessage[]
}

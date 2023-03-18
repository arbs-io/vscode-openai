import { IPersonaOpenAI, IChatMessage } from '.'

export interface IConversation {
  conversationId: string
  persona: IPersonaOpenAI
  summary: string
  chatMessages: IChatMessage[]
}

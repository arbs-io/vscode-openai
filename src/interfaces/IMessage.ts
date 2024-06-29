export interface IMessage {
  content: string
  completionTokens: number
  promptTokens: number
  totalTokens: number
}

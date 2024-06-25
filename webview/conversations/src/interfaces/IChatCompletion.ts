export interface IChatCompletion {
  content: string
  author: string
  timestamp: string
  mine: boolean
  completionTokens: number
  promptTokens: number
  totalTokens: number
}

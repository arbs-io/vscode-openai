import { IChatCompletion } from '@app/interfaces'

export type ChatCompletionStreamCallback = (type: string, data: string) => void

export type ChatCompletionMessageCallback = (
  type: string,
  data: IChatCompletion
) => void

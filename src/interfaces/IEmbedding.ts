import { Uri } from 'vscode'

export interface IEmbedding {
  timestamp: number
  embeddingId: string
  uri: Uri
  content: string
}

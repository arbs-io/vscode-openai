import { Uri } from 'vscode'

export interface IEmbeddingResourceStorage {
  timestamp: number
  embeddingId: string
  uri: Uri
  content: string
}

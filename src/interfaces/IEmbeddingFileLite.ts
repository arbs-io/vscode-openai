import { IEmbeddingText } from '.'

export interface IEmbeddingFileLite {
  expanded?: boolean
  name: string
  url?: string
  type?: string
  score?: number
  size?: number
  embedding?: number[] // The file embedding -- or mean embedding if there are multiple embeddings for the file
  chunks?: IEmbeddingText[] // The chunks of text and their embeddings
  extractedText?: string // The extracted text from the file
}

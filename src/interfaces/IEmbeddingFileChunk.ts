import { IEmbeddingText } from '.';

export interface IEmbeddingFileChunk extends IEmbeddingText {
  filename: string
  score?: number
}

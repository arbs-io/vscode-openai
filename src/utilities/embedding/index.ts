export {
  ITextExtract,
  extractTextFromBuffer,
  extractTextFromFile,
} from './extractText'

export { fileTypeInfo, GuessedFile } from './magicBytes'

export { chunkText } from './chunk/chunkText'
export { ITextEmbedding } from './chunk/ITextEmbedding'
export { getEmbeddingsForText } from './chunk/getEmbeddingsForText'

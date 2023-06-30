export {
  ITextExtract,
  extractTextFromBuffer,
  extractTextFromFile,
  embeddingResource,
} from './extractText'

export { fileTypeInfo, GuessedFile } from './magicBytes'

export { chunkText } from './chunk/chunkText'
export { getEmbeddingsForText } from './chunk/getEmbeddingsForText'
export { searchFileChunks } from './chunk/searchFileChunks'

export {
  ITextExtract,
  extractTextFromBuffer,
  extractTextFromFile,
} from './extractText'

export { fileTypeInfo, GuessedFile } from './magicBytes'

export { chunkText } from './chunk/chunkText'
export { getEmbeddingsForText } from './chunk/getEmbeddingsForText'
export { searchFileChunks } from './chunk/searchFileChunks'

export { default as pdfParse } from './pdf-parse'

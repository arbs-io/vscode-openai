import { createEmbedding } from '@app/utilities/openai'
import { StatusBarServiceProvider } from '@app/utilities/vscode'
import { chunkText } from '../'
import { IEmbeddingText } from '@app/types'
import { ConfigurationEmbeddingService } from '@app/services'

// This function takes a text and returns an array of embeddings for each chunk of the text
// The text is split into chunks of a given maximum charcter length
// The embeddings are computed in batches of a given size
export async function getEmbeddingsForText(
  content: string
): Promise<IEmbeddingText[]> {
  StatusBarServiceProvider.instance.showStatusBarInformation(
    'sync~spin',
    '- chunk data'
  )

  const batchSize = 1
  const MAX_CHAR_LENGTH =
    ConfigurationEmbeddingService.instance.maxCharacterLength
  const textChunks = chunkText({ content, maxCharLength: MAX_CHAR_LENGTH })

  let chunkCounter = 1
  const batches = []
  for (let i = 0; i < textChunks.length; i += batchSize) {
    batches.push(textChunks.slice(i, i + batchSize))
    StatusBarServiceProvider.instance.showStatusBarInformation(
      'sync~spin',
      `- chunk data (${chunkCounter++})`
    )
  }

  let itemCount = batches.length

  const batchPromises = batches.map((batch) =>
    createEmbedding({
      input: batch,
      itemCount: itemCount--,
      batchLength: batches.length,
    })
  )

  const embeddings = (await Promise.all(batchPromises)).flat()

  const textEmbeddings = embeddings.map((embedding, index) => {
    return <IEmbeddingText>{
      embedding: embedding,
      text: textChunks[index],
    }
  })
  StatusBarServiceProvider.instance.showStatusBarInformation(
    'vscode-openai',
    ''
  )
  return textEmbeddings
}

import { createEmbedding } from '@app/utilities/openai'
import { StatusBarHelper } from '@app/utilities/vscode'
import { chunkText } from '../'
import { IEmbeddingText } from '@app/interfaces'

const MAX_CHAR_LENGTH = 300 * 4

// This function takes a text and returns an array of embeddings for each chunk of the text
// The text is split into chunks of a given maximum charcter length
// The embeddings are computed in batches of a given size
export async function getEmbeddingsForText({
  text,
  maxCharLength = MAX_CHAR_LENGTH,
  batchSize = 1,
}: {
  text: string
  maxCharLength?: number
  batchSize?: number
}): Promise<IEmbeddingText[]> {
  StatusBarHelper.instance.showStatusBarInformation('sync~spin', '- chunk data')

  const textChunks = chunkText({ text, maxCharLength })

  let chunkCounter = 1
  const batches = []
  for (let i = 0; i < textChunks.length; i += batchSize) {
    batches.push(textChunks.slice(i, i + batchSize))
    StatusBarHelper.instance.showStatusBarInformation(
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
  StatusBarHelper.instance.showStatusBarInformation('vscode-openai', '')
  return textEmbeddings
}

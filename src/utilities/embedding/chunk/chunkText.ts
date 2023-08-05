// Define the strategy interface
// The IChunkingStrategy interface defines a single method, chunk, which takes
// a string and a maximum character length, and returns an array of strings.
interface IChunkingStrategy {
  chunk(content: string, maxCharLength: number): string[]
}

// SentenceChunkingStrategy is a class that implements the IChunkingStrategy
// interface. It defines a method, chunk, which splits a string into chunks
// based on sentence boundaries.
class SentenceChunkingStrategy implements IChunkingStrategy {
  chunk(content: string, maxCharLength: number): string[] {
    const chunks: string[] = []
    let currentChunk = ''
    const sentences = content.replace(/\n/g, ' ').split(/([.])/)

    sentences.forEach((sentence) => {
      const trimmedSentence = sentence.trim()
      if (!trimmedSentence) return

      const chunkLength = currentChunk.length + trimmedSentence.length + 1
      const lowerBound = maxCharLength - maxCharLength * 0.5
      const upperBound = maxCharLength + maxCharLength * 0.5

      if (
        (chunkLength >= lowerBound &&
          chunkLength <= upperBound &&
          currentChunk) ||
        chunkLength > upperBound
      ) {
        currentChunk = currentChunk.replace(/^[. ]+/, '').trim()
        if (currentChunk) chunks.push(currentChunk)
        currentChunk = chunkLength > upperBound ? trimmedSentence : ''
      } else {
        currentChunk += `${
          trimmedSentence === '.' ? '' : ' '
        }${trimmedSentence}`
      }
    })

    if (currentChunk) {
      chunks.push(currentChunk)
    }

    return chunks
  }
}

// Define the builder
class ChunkBuilder {
  private strategy: IChunkingStrategy

  constructor(strategy: IChunkingStrategy) {
    this.strategy = strategy
  }

  build(content: string, maxCharLength: number): string[] {
    return this.strategy.chunk(content, maxCharLength)
  }
}

// ChunkBuilderFactory is a singleton class that provides a single instance
// of ChunkBuilder.
class ChunkBuilderFactory {
  private static instance: ChunkBuilder

  static getInstance(): ChunkBuilder {
    if (!ChunkBuilderFactory.instance) {
      ChunkBuilderFactory.instance = new ChunkBuilder(
        new SentenceChunkingStrategy()
      )
    }

    return ChunkBuilderFactory.instance
  }
}

// The chunkText function is a utility function that uses the
// ChunkBuilderFactory to get an instance of ChunkBuilder, and then uses
// that instance to chunk a string.
export function chunkText({
  content,
  maxCharLength,
}: {
  content: string
  maxCharLength: number
}): string[] {
  const builder = ChunkBuilderFactory.getInstance()
  return builder.build(content, maxCharLength)
}

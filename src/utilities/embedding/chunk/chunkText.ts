export function chunkText({
  content,
  maxCharLength,
}: {
  content: string
  maxCharLength: number
}): string[] {
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
      currentChunk += `${trimmedSentence === '.' ? '' : ' '}${trimmedSentence}`
    }
  })

  if (currentChunk) {
    chunks.push(currentChunk)
  }

  return chunks
}

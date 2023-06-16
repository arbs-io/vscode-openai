export function chunkText({
  text,
  maxCharLength = 250 * 4,
}: {
  text: string
  maxCharLength?: number
}): string[] {
  const chunks: string[] = []
  let currentChunk = ''
  const sentences = text.replace(/\n/g, ' ').split(/([.])/)

  for (const sentence of sentences) {
    const trimmedSentence = sentence.trim()
    if (!trimmedSentence) continue
    const chunkLength = currentChunk.length + trimmedSentence.length + 1
    const lowerBound = maxCharLength - maxCharLength * 0.5
    const upperBound = maxCharLength + maxCharLength * 0.5

    if (
      chunkLength >= lowerBound &&
      chunkLength <= upperBound &&
      currentChunk
    ) {
      currentChunk = currentChunk.replace(/^[. ]+/, '').trim()
      if (currentChunk) chunks.push(currentChunk)
      currentChunk = ''
    } else if (chunkLength > upperBound) {
      currentChunk = currentChunk.replace(/^[. ]+/, '').trim()
      if (currentChunk) chunks.push(currentChunk)
      currentChunk = trimmedSentence
    } else {
      currentChunk += `${trimmedSentence === '.' ? '' : ' '}${trimmedSentence}`
    }
  }
  if (currentChunk) {
    chunks.push(currentChunk)
  }
  return chunks
}

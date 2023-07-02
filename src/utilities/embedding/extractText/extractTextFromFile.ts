import * as fs from 'fs'
import { ITextExtract, extractTextFromBuffer } from '.'

export async function extractTextFromFile({
  filepath,
  filetype,
}: {
  filepath: string
  filetype?: string
}): Promise<ITextExtract | undefined> {
  const bufferArray: Uint8Array = await new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filepath)
    const chunks: any[] = []
    fileStream.on('data', (chunk) => {
      chunks.push(chunk)
    })
    fileStream.on('error', (error) => {
      reject(error)
    })
    fileStream.on('end', () => {
      const uint8Array = new Uint8Array(Buffer.concat(chunks))
      resolve(uint8Array)
    })
  })
  return await extractTextFromBuffer({ bufferArray, filetype })
}

import * as fs from 'fs'
import { createDebugNotification, createInfoNotification } from '@app/apis/node'
import {
  extractContentFromBuffer,
  FileInfo,
} from '@arbs.io/extract-text-content-wasm'

export async function extractTextFromBuffer({
  bufferArray,
}: {
  bufferArray: Uint8Array
}): Promise<FileInfo | undefined> {
  try {
    const bufferContent = extractContentFromBuffer(bufferArray)

    const cfgMap = new Map<string, string>()
    cfgMap.set('extension', bufferContent.extension)
    cfgMap.set('mimetype', bufferContent.mimetype)
    cfgMap.set('length', bufferContent.content?.length.toString() ?? '0')
    createInfoNotification(Object.fromEntries(cfgMap), 'file_information')

    if (bufferContent) return bufferContent

    return undefined
  } catch (error) {
    createDebugNotification(`Failed to detect binary file type`)
  }
}

export async function extractTextFromFile({
  filepath,
}: {
  filepath: string
}): Promise<FileInfo | undefined> {
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
  return await extractTextFromBuffer({ bufferArray })
}

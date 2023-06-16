import * as fs from 'fs'
import { URL } from 'url'

export async function urlReadBuffer(transferFile: URL): Promise<Uint8Array> {
  return await new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(transferFile)
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
}

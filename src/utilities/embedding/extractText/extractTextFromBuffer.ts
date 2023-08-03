import { ITextExtract } from '.'
import {
  createDebugNotification,
  createInfoNotification,
} from '@app/utilities/node'
import { extractContentFromBuffer } from '@arbs.io/extract-text-content-wasm'

export async function extractTextFromBuffer({
  bufferArray,
}: {
  bufferArray: Uint8Array
}): Promise<ITextExtract | undefined> {
  try {
    const bufferContent = extractContentFromBuffer(bufferArray)

    const cfgMap = new Map<string, string>()
    cfgMap.set('extension', bufferContent.extension)
    cfgMap.set('mimetype', bufferContent.mimetype)
    cfgMap.set('length', bufferContent.content?.length.toString() ?? '0')
    createInfoNotification(Object.fromEntries(cfgMap), 'file_information')

    if (bufferContent.content) {
      const textExtract: ITextExtract = {
        mimeType: bufferContent.mimetype,
        content: bufferContent.content,
      }
      return textExtract
    } else return undefined
  } catch (error) {
    createDebugNotification(`Failed to detect binary file type`)
  }
}

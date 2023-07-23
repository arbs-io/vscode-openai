import mammoth from 'mammoth'
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { ITextExtract } from '.'
import { GuessedFile, fileTypeInfo } from '../'
import {
  createDebugNotification,
  createErrorNotification,
} from '@app/utilities/node'
import {
  detect_buffer_extension,
  detect_buffer_mime_type,
} from '@arbs.io/extract-text-content-wasm'

export async function extractTextFromBuffer({
  bufferArray,
  filetype,
}: {
  bufferArray: Uint8Array
  filetype?: string
}): Promise<ITextExtract | undefined> {
  const fileTypeInfos: Array<GuessedFile> = fileTypeInfo(bufferArray)
  let mimeType = ''

  try {
    const detectBufferExtension = detect_buffer_extension(bufferArray)
    createDebugNotification(
      `detectBufferExtension: ${detectBufferExtension ?? 'unknown'}`
    )
    const detectBufferMimeType = detect_buffer_mime_type(bufferArray)
    createDebugNotification(
      `detectBufferMimeType: ${detectBufferMimeType ?? 'unknown'}`
    )
  } catch (error) {
    createDebugNotification(`Failed to detect binary file type`)
  }

  mimeType =
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  if (fileTypeInfos.some((e) => e.mime === mimeType)) {
    // i.e. docx file
    const buffer = Buffer.from(bufferArray.buffer)
    const docxResult = await mammoth.extractRawText({
      buffer: buffer,
    })
    const textExtract: ITextExtract = {
      mimeType: mimeType,
      content: docxResult.value,
    }
    return textExtract
  }

  const plainText = ['text/markdown', 'text/csv', 'text/html']
  if (plainText.some((e) => e === filetype)) {
    const html = new TextDecoder().decode(bufferArray)
    const textExtract: ITextExtract = {
      mimeType: filetype!,
      content: NodeHtmlMarkdown.translate(html),
    }
    return textExtract
  }
  if (filetype === 'text/plain') {
    const textExtract: ITextExtract = {
      mimeType: filetype,
      content: new TextDecoder().decode(bufferArray),
    }
    return textExtract
  }

  createErrorNotification(
    'Unsupported file type. expected (docx, html, txt and markdown)'
  )
  return undefined
}

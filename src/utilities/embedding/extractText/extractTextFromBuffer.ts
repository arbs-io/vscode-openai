import mammoth from 'mammoth'
import { NodeHtmlMarkdown } from 'node-html-markdown'
import { ITextExtract } from '.'
import { GuessedFile, fileTypeInfo } from '../'

export async function extractTextFromBuffer({
  bufferArray,
  filetype,
}: {
  bufferArray: Uint8Array
  filetype?: string
}): Promise<ITextExtract> {
  const fileTypeInfos: Array<GuessedFile> = fileTypeInfo(bufferArray)
  let mimeType = ''

  // let mimeType = 'application/pdf'
  // if (fileTypeInfos.some((e) => e.mime === mimeType)) {
  //   const pdfData = await pdfParse(Buffer.from(bufferArray.buffer))
  //   const textExtract: ITextExtract = {
  //     mimeType: mimeType,
  //     content: pdfData.text,
  //   }
  //   return textExtract
  // }

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

  throw new Error(
    'Unsupported file type. support types (docx, html, txt and markdown) ~ coming soon (pdf)'
  )
}

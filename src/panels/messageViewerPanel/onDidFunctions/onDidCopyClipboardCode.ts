import { env } from 'vscode'
import { showMessageWithTimeout } from '@app/apis/vscode'
import { ICodeDocument } from '@app/types'

export const onDidCopyClipboardCode = (codeDocument: ICodeDocument): void => {
  env.clipboard.writeText(codeDocument.content)
  showMessageWithTimeout(
    `Successfully copied ${codeDocument.language} code to clipboard`,
    2000
  )
}

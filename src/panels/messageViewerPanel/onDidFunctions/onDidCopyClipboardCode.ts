import { env } from 'vscode'
import { showMessageWithTimeout } from '@app/utilities/vscode'
import { ICodeDocument } from '@app/interfaces'

export const onDidCopyClipboardCode = (codeDocument: ICodeDocument): void => {
  env.clipboard.writeText(codeDocument.content)
  showMessageWithTimeout(
    `Successfully copied ${codeDocument.language} code to clipboard`,
    2000
  )
}

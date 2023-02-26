import { window } from 'vscode'

export async function inputApiKeyOpenAI(): Promise<boolean> {
  const result = await window.showInputBox({
    placeHolder: 'For example: sk-Uzm...MgS3',
    validateInput: (text) => {
      window.showInformationMessage(`Validating: ${text}`)
      return text.length === 51 && text.startsWith('sk-')
        ? null
        : 'Invalid Api Key'
    },
  })

  if (result !== undefined) {
    window.showInformationMessage(`SecretStorageService Api Key: ${result}`)
    return true
  }
  window.showWarningMessage(`OpenAI Api Key has not been set`)
  return false
}

import { window } from 'vscode'

export async function getInputBox() {
  const result = await window.showInputBox({
    value: 'abcdef',
    valueSelection: [2, 4],
    placeHolder: 'For example: fedcba. But not: 123',
    validateInput: (text) => {
      window.showInformationMessage(`Validating: ${text}`)
      return text === '123' ? 'Not 123!' : null
    },
  })
  window.showInformationMessage(`Got: ${result}`)
}

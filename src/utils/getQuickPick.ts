import { window } from 'vscode'

export async function getQuickPick() {
  let i = 0
  const result = await window.showQuickPick(['eins', 'zwei', 'drei'], {
    placeHolder: 'eins, zwei or drei',
    onDidSelectItem: (item) =>
      window.showInformationMessage(`Focus ${++i}: ${item}`),
  })
  window.showInformationMessage(`Got: ${result}`)
}

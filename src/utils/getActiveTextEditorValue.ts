import { Range, window } from 'vscode'

export function getActiveTextEditorValue(): string {
  const editor = window.activeTextEditor
  let value = ''
  if (editor) {
    const selection = editor.selection
    if (selection && !selection.isEmpty) {
      const selectionRange = new Range(
        selection.start.line,
        selection.start.character,
        selection.end.line,
        selection.end.character
      )
      value = editor.document.getText(selectionRange)
    } else {
      value = editor.document.getText()
    }
  }
  return value
}
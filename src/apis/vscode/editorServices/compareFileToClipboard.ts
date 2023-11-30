import { commands, env, window } from 'vscode'

export async function compareFileToClipboard(newValue: string) {
  const originalValue = await env.clipboard.readText()
  try {
    const editor = window.activeTextEditor
    if (editor) {
      await env.clipboard.writeText(newValue)
      await commands.executeCommand(
        'workbench.files.action.compareWithClipboard',
        editor.document.uri
      )
    }
  } catch (error) {
    window.showErrorMessage(error as string)
  } finally {
    await env.clipboard.writeText(originalValue)
  }
}

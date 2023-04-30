import { ExtensionContext } from 'vscode'
import { OpenaiEditorCommand } from './openaiEditorCommand'

export function registerOpenaiEditor(context: ExtensionContext) {
  const registry = new OpenaiEditorCommand()
  registry.registerCommands(context)
}

import { ExtensionContext } from 'vscode'
import { registerEditorCompletion } from './registerEditorCompletion'
import { registerApiKeyCommand } from './registerApiKeyCommand'
import { registerDefaultModelCommand } from './registerDefaultModelCommand'
import { registerSidebarProvider } from './registerSidebarProvider'

export function registerCommands(context: ExtensionContext) {
  registerApiKeyCommand(context)
  registerDefaultModelCommand(context)
  registerEditorCompletion(context)
  registerSidebarProvider(context)
}

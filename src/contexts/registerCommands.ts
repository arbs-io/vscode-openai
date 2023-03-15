import { ExtensionContext } from 'vscode'
import { registerCompletionCommand } from './registerCompletionCommand'
import { registerApiKeyCommand } from './registerApiKeyCommand'
import { registerDefaultModelCommand } from './registerDefaultModelCommand'
import { registerSidebarProvider } from './registerSidebarProvider'

export function registerCommands(context: ExtensionContext) {
  registerApiKeyCommand(context)
  registerDefaultModelCommand(context)
  registerCompletionCommand(context)
  registerSidebarProvider(context)
}

import { ExtensionContext } from 'vscode'
import { registerCompletionCommand } from './registerCompletionCommand'
import { registerApiKeyCommand } from './registerApiKeyCommand'
import { registerDefaultModel } from './registerDefaultModel'

export function registerCommands(context: ExtensionContext) {
	registerApiKeyCommand(context)
  registerDefaultModel(context)
  registerCompletionCommand(context)
}

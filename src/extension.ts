import { ExtensionContext } from 'vscode'
import { registerCommands } from './contexts/registerCommands'
import { registerSetOpenAIKeyCommand } from './contexts/registerSetOpenAIKeyCommand'
import SecretStorageService from './services/secretStorageService'

export function activate(context: ExtensionContext) {
  SecretStorageService.init(context)

  registerCommands(context)
  registerSetOpenAIKeyCommand(context)
}

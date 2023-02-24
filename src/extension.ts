import { ExtensionContext } from 'vscode'
import { registerCommands } from './contexts/registerCommands'
import SecretStorageService from './services/secretStorageService'

export function activate(context: ExtensionContext) {
  SecretStorageService.init(context)
  registerCommands(context)
}

import { commands, ExtensionContext } from 'vscode'
import { registerCommands } from './contexts/registerCommands'
import { registerApiKeyCommand } from './contexts/registerApiKeyCommand'
import { validateApiKey } from './openai/apiKey'
import SecretStorageService from './services/secretStorageService'
import LocalStorageService from './services/localStorageService'

export function activate(context: ExtensionContext) {
  // Disable functionality until we validate auth
  commands.executeCommand('setContext', 'openai.isApiKeyValid', false)

  SecretStorageService.init(context)
  LocalStorageService.init(context)

  registerCommands(context)
  registerApiKeyCommand(context)

  validateApiKey() //On activation check if the api key is valid
}

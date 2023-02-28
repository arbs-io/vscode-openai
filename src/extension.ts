import { commands, ExtensionContext } from 'vscode'
import { registerApiKeyCommand } from './contexts/registerApiKeyCommand'
import { validateApiKey } from './openai/apiKey'
import SecretStorageService from './services/secretStorageService'
import LocalStorageService from './services/localStorageService'
import { registerDefaultModel } from './contexts/registerDefaultModel'

export function activate(context: ExtensionContext) {
  // Disable functionality until we validate auth
  commands.executeCommand('setContext', 'vscode-openai.context.apikey', false)

  SecretStorageService.init(context)
  LocalStorageService.init(context)

  registerApiKeyCommand(context)
  registerDefaultModel(context)

  validateApiKey() //On activation check if the api key is valid
}

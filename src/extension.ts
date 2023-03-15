import { commands, ExtensionContext } from 'vscode'
import { validateApiKey } from './openaiUtilities'
import {
  ExtensionStatusBarItem,
  GlobalStorageService,
  SecretStorageService,
} from './vscodeUtilities'
import { registerCommands } from './contexts/registerCommands'

export function activate(context: ExtensionContext) {
  // Disable functionality until we validate auth
  commands.executeCommand('setContext', 'vscode-openai.context.apikey', false)

  SecretStorageService.init(context)
  GlobalStorageService.init(context)
  ExtensionStatusBarItem.init(context)

  registerCommands(context)

  validateApiKey() //On activation check if the api key is valid
}

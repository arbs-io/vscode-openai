import { commands, ExtensionContext } from 'vscode'
import { validateApiKey } from './openaiUtilities'
import {
  ConfigurationService,
  ExtensionStatusBarItem,
  GlobalStorageService,
  SecretStorageService,
} from './vscodeUtilities'
import {
  ConversationService,
  registerApiKeyCommand,
  registerChangeConfiguration,
  registerDefaultModelCommand,
  registerEditorCompletion,
  registerSidebarProvider,
} from './contexts'

export function activate(context: ExtensionContext) {
  // Disable functionality until we validate auth
  commands.executeCommand('setContext', 'vscode-openai.context.apikey', false)

  //register storage (Singletons)
  SecretStorageService.init(context)
  GlobalStorageService.init(context)

  //load configuration
  ConfigurationService.init(context)

  ExtensionStatusBarItem.init(context)

  //registerCommands
  registerApiKeyCommand(context)
  registerDefaultModelCommand(context)
  registerEditorCompletion(context)
  registerSidebarProvider(context)
  registerChangeConfiguration(context)

  ConversationService.init(context)

  validateApiKey() //On activation check if the api key is valid
}

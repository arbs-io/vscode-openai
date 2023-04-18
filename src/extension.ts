import { commands, ExtensionContext } from 'vscode'
import { validateApiKey } from './utilities/openai'
import {
  ExtensionStatusBarItem,
  GlobalStorageService,
  SecretStorageService,
} from './utilities/vscode'
import {
  registerChangeConfiguration,
  registerEditorCompletion,
  registerOpenaiServiceCommand,
  registerSidebarProvider,
} from './contexts'
import { ConfigurationService, ConversationService } from './services'

export function activate(context: ExtensionContext) {
  // Disable functionality until we validate auth
  commands.executeCommand('setContext', 'vscode-openai.context.apikey', false)

  //register storage (Singletons)
  SecretStorageService.init(context)
  GlobalStorageService.init(context)

  //load configuration
  ConfigurationService.init()

  ExtensionStatusBarItem.init(context)

  //registerCommands
  registerEditorCompletion(context)
  registerSidebarProvider(context)
  registerChangeConfiguration(context)
  registerOpenaiServiceCommand(context)

  ConversationService.init(context)

  validateApiKey() //On activation check if the api key is valid
}

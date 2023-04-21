import { commands, ExtensionContext } from 'vscode'
import { validateApiKey } from '@app/utilities/openai'
import {
  ExtensionStatusBarItem,
  GlobalStorageService,
  logDebug,
  logInfo,
  SecretStorageService,
} from '@app/utilities/vscode'
import {
  registerChangeConfiguration,
  registerEditorCompletion,
  registerOpenaiServiceCommand,
  registerSidebarProvider,
} from '@app/contexts'
import { ConfigurationService, ConversationService } from '@app/services'

export function activate(context: ExtensionContext) {
  logDebug('activate')

  // Disable functionality until we validate auth
  commands.executeCommand('setContext', 'vscode-openai.context.apikey', false)

  //register storage (Singletons)
  logDebug('loading storage')
  SecretStorageService.init(context)
  GlobalStorageService.init(context)

  //load configuration
  logDebug('loading configuration')
  ConfigurationService.init()

  logDebug('vscode initialise components')
  ExtensionStatusBarItem.init(context)

  //registerCommands
  logDebug('vscode register commands')
  registerEditorCompletion(context)
  registerSidebarProvider(context)
  registerChangeConfiguration(context)
  registerOpenaiServiceCommand(context)

  logDebug('starting conversation service')
  ConversationService.init(context)

  logDebug('checking openai service authentication')
  validateApiKey() //On activation check if the api key is valid

  logInfo('started')
}

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
  registerOpenaiActivityBarProvider,
} from '@app/contexts'
import { ConfigurationService, ConversationService } from '@app/services'

export function activate(context: ExtensionContext) {
  logInfo('activate vscode-openai')

  // Disable functionality until we validate auth
  commands.executeCommand('setContext', 'vscode-openai.context.apikey', false)

  //register storage (Singletons)
  logDebug('initialise storage services')
  SecretStorageService.init(context)
  GlobalStorageService.init(context)

  //load configuration
  logDebug('initialise configuration service')
  ConfigurationService.init()

  logDebug('initialise components')
  ExtensionStatusBarItem.init(context)

  //registerCommands
  logDebug('register commands')
  registerEditorCompletion(context)
  registerOpenaiActivityBarProvider(context)
  registerChangeConfiguration(context)
  registerOpenaiServiceCommand(context)

  logDebug('starting conversation service')
  ConversationService.init(context)

  logDebug('verifying authentication openai service')
  validateApiKey() //On activation check if the api key is valid

  logInfo('vscode-openai ready')
}

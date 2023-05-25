import { commands, ExtensionContext } from 'vscode'
import { validateApiKey } from '@app/utilities/openai'
import {
  ExtensionStatusBarItem,
  GlobalStorageService,
  TelemetryService,
  SecretStorageService,
  setFeatureFlag,
} from '@app/utilities/vscode'
import {
  registerChangeConfiguration,
  registerOpenaiEditor,
  registerOpenaiServiceCommand,
  registerOpenaiActivityBarProvider,
  registerOpenaiSCMCommand,
  registerOpenSettings,
  registerConversationCommand,
} from '@app/contexts'
import {
  VSCODE_OPENAI_EXTENSION,
  VSCODE_OPENAI_SCM,
  VSCODE_OPENAI_EMBEDDING,
} from '@app/constants'
import {
  ConfigurationService,
  ConversationService,
  EmbeddingService,
} from '@app/services'
import {
  createDebugNotification,
  createErrorNotification,
  createInfoNotification,
} from '@app/utilities/node'

export function activate(context: ExtensionContext) {
  try {
    // Disable functionality until we validate auth
    setFeatureFlag(VSCODE_OPENAI_EXTENSION.ENABLED_COMMAND_ID, false)
    setFeatureFlag(VSCODE_OPENAI_SCM.ENABLED_COMMAND_ID, false)
    setFeatureFlag(VSCODE_OPENAI_EMBEDDING.ENABLED_COMMAND_ID, false)

    // Enable logging and telemetry
    TelemetryService.init(context)
    createInfoNotification('activate vscode-openai')

    //register storage (Singletons)
    createDebugNotification('initialise storage services')
    SecretStorageService.init(context)
    GlobalStorageService.init(context)

    //load configuration
    createDebugNotification('initialise configuration service')
    ConfigurationService.init()
    ConfigurationService.LogConfigurationService()

    createDebugNotification('initialise components')
    ExtensionStatusBarItem.init(context)

    //registerCommands
    createDebugNotification('register commands')
    registerOpenaiEditor(context)
    registerOpenaiActivityBarProvider(context)
    registerChangeConfiguration(context)
    registerOpenaiServiceCommand(context)
    registerOpenaiSCMCommand(context)
    registerOpenSettings(context)
    registerConversationCommand(context)

    createDebugNotification('starting conversation service')
    ConversationService.init(context)
    EmbeddingService.init()

    createDebugNotification('verifying authentication openai service')
    validateApiKey() //On activation check if the api key is valid

    createInfoNotification('vscode-openai ready')
  } catch (error: unknown) {
    createErrorNotification(error)
  }
}

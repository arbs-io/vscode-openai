import { ExtensionContext } from 'vscode'

import { CommandManager, registerVscodeOpenAICommands } from './commands'
import { StatusBarServiceProvider, TelemetryService } from '@app/apis/vscode'

import { registerVscodeOpenAIServices } from '@app/services'
import {
  createDebugNotification,
  createErrorNotification,
  createInfoNotification,
} from '@app/apis/node'
import {
  EmbeddingTreeDataProvider,
  conversationsWebviewViewProvider,
} from './providers'
import { disableServiceFeature } from './services/featureFlagServices'

export function activate(context: ExtensionContext) {
  try {
    disableServiceFeature()

    // Enable logging and telemetry
    TelemetryService.init(context)
    createInfoNotification('activate vscode-openai')

    registerVscodeOpenAIServices(context)

    createDebugNotification('initialise components')
    StatusBarServiceProvider.init(context)
    StatusBarServiceProvider.instance.showStatusBarInformation(
      'vscode-openai',
      ''
    )

    // registerCommands
    createDebugNotification('initialise vscode commands')
    const commandManager = new CommandManager()
    const embeddingTree = new EmbeddingTreeDataProvider(context)
    context.subscriptions.push(
      registerVscodeOpenAICommands(context, commandManager, embeddingTree)
    )
    conversationsWebviewViewProvider(context)

    createInfoNotification('vscode-openai ready')
  } catch (error: unknown) {
    createErrorNotification(error)
  }
}

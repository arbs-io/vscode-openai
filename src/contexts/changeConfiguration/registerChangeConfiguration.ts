import { ExtensionContext, workspace } from 'vscode'
import { createErrorNotification } from '@app/utilities/node'
import { ManagedApiKey } from './managedApiKey'

export function registerChangeConfiguration(_context: ExtensionContext): void {
  try {
    const managedApiKeyInstance = ManagedApiKey.getInstance()
    const eventAffectsConfigurations = [
      'vscode-openai.serviceProvider',
      'vscode-openai.authentication',
      'vscode-openai.baseUrl',
      'vscode-openai.defaultModel',
      'vscode-openai.azureDeployment',
      'vscode-openai.azureApiVersion',
    ]

    workspace.onDidChangeConfiguration(async (event) => {
      try {
        if (
          eventAffectsConfigurations.some((config) =>
            event.affectsConfiguration(config)
          )
        ) {
          await managedApiKeyInstance.verify()
        }
      } catch (error) {
        createErrorNotification(error)
      }
    })
  } catch (error) {
    createErrorNotification(error)
  }
}

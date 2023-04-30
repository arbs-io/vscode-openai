import { ExtensionContext, workspace } from 'vscode'
import { verifyApiKey } from '@app/utilities/openai'
import { waitFor } from '@app/utilities/node'

// Creational Pattern: Singleton
class ManagedApiKey {
  private static instance: ManagedApiKey
  private _isQueued = false

  // private constructor() {}

  public static getInstance(): ManagedApiKey {
    if (!ManagedApiKey.instance) {
      ManagedApiKey.instance = new ManagedApiKey()
    }

    return ManagedApiKey.instance
  }

  public async verify(): Promise<void> {
    if (this._isQueued === true) return

    this._isQueued = true

    // Structural Pattern: Facade
    const eventAffectsConfigurations = [
      'vscode-openai.serviceProvider',
      'vscode-openai.authentication',
      'vscode-openai.baseUrl',
      'vscode-openai.defaultModel',
      'vscode-openai.azureDeployment',
      'vscode-openai.azureApiVersion',
    ]

    // Behavioral Pattern: Observer
    workspace.onDidChangeConfiguration(async (event) => {
      if (
        eventAffectsConfigurations.some((config) =>
          event.affectsConfiguration(config)
        )
      ) {
        await this.verify()
      }
    })

    // Concurrency Pattern: Async/Await
    await waitFor(500, () => false)

    // Structural Pattern: Adapter
    await verifyApiKey()

    this._isQueued = false
  }
}

export function registerChangeConfiguration(context: ExtensionContext): void {
  const managedApiKeyInstance = ManagedApiKey.getInstance()

  // Behavioral Pattern: Observer
  workspace.onDidChangeConfiguration(async (event) => {
    if (
      event.affectsConfiguration('vscode-openai.serviceProvider') ||
      event.affectsConfiguration('vscode-openai.authentication') ||
      event.affectsConfiguration('vscode-openai.baseUrl') ||
      event.affectsConfiguration('vscode-openai.defaultModel') ||
      event.affectsConfiguration('vscode-openai.azureDeployment') ||
      event.affectsConfiguration('vscode-openai.azureApiVersion')
    ) {
      await managedApiKeyInstance.verify()
    }
  })
}

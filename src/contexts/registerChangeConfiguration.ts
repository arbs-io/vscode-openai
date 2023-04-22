import { ExtensionContext, workspace } from 'vscode'
import { verifyApiKey } from '@app/utilities/openai'
import { waitFor } from '@app/utilities/node'

export function registerChangeConfiguration(context: ExtensionContext) {
  workspace.onDidChangeConfiguration(async (event) => {
    if (
      event.affectsConfiguration('vscode-openai.serviceProvider') ||
      event.affectsConfiguration('vscode-openai.authentication') ||
      event.affectsConfiguration('vscode-openai.baseUrl') ||
      event.affectsConfiguration('vscode-openai.defaultModel') ||
      event.affectsConfiguration('vscode-openai.azureDeployment') ||
      event.affectsConfiguration('vscode-openai.azureApiVersion')
    ) {
      await managedApiKey.verify()
    }
  })
}

class managedApiKey {
  static _isQueued = false
  static async verify() {
    if (this._isQueued === true) return

    this._isQueued = true
    await waitFor(500, () => {
      return false
    })
    await verifyApiKey()
    this._isQueued = false
  }
}

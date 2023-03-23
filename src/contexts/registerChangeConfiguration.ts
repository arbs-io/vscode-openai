import { ExtensionContext, workspace } from 'vscode'
import { verifyApiKey } from '../openaiUtilities'
import { SecretStorageService } from '../vscodeUtilities'

export function registerChangeConfiguration(context: ExtensionContext) {
  workspace.onDidChangeConfiguration((event) => {
    const serviceProvider = event.affectsConfiguration(
      'vscode-openai.serviceProvider'
    )
    if (serviceProvider) {
      changedServiceProvider()
    }
  })
}

function changedServiceProvider() {
  SecretStorageService.instance.setAuthApiKey('Invalid Api Key')
  verifyApiKey()
}

import { ExtensionContext, workspace } from 'vscode'
import { verifyApiKey } from '@app/utilities/openai'

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
      await verifyApiKey()
    }
  })
}

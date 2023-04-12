import { ExtensionContext, workspace } from 'vscode'
import { verifyApiKey } from '../utilities/openai'
import { ConfigurationService } from '../services'

export function registerChangeConfiguration(context: ExtensionContext) {
  workspace.onDidChangeConfiguration(async (event) => {
    if (event.affectsConfiguration('vscode-openai.serviceProvider')) {
      if (ConfigurationService.instance.serviceProvider === 'Azure-OpenAI') {
        ConfigurationService.instance.baseUrl =
          'https://instance.openai.azure.com/openai'
      } else if (ConfigurationService.instance.serviceProvider === 'OpenAI') {
        ConfigurationService.instance.baseUrl = 'https://api.openai.com/v1'
      }
    }

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

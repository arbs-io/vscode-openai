import { ExtensionContext, workspace } from 'vscode'
import { verifyApiKey } from '../openaiUtilities'
import {
  ConfigurationPropertiesService,
  SecretStorageService,
} from '../vscodeUtilities'

export function registerChangeConfiguration(context: ExtensionContext) {
  workspace.onDidChangeConfiguration(async (event) => {
    if (event.affectsConfiguration('vscode-openai.serviceProvider')) {
      await SecretStorageService.instance.invalidateApiKey()
      await ConfigurationPropertiesService.instance
        .load()
        .then((x) => verifyApiKey())
    }

    if (
      event.affectsConfiguration('vscode-openai.authentication') ||
      event.affectsConfiguration('vscode-openai.baseUrl') ||
      event.affectsConfiguration('vscode-openai.defaultModel') ||
      event.affectsConfiguration('vscode-openai.azureDeployment') ||
      event.affectsConfiguration('vscode-openai.azureApiVersion')
    ) {
      await ConfigurationPropertiesService.instance.load()
    }
  })
}

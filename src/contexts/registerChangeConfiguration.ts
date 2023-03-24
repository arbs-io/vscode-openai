import { ExtensionContext, workspace, commands } from 'vscode'
import { verifyApiKey } from '../openaiUtilities'
import {
  ConfigurationPropertiesService,
  SecretStorageService,
} from '../vscodeUtilities'

export function registerChangeConfiguration(context: ExtensionContext) {
  workspace.onDidChangeConfiguration((event) => {
    if (event.affectsConfiguration('vscode-openai.serviceProvider')) {
      SecretStorageService.instance.setAuthApiKey('<invalid-key>')
      // commands.executeCommand(
      //   'setContext',
      //   'vscode-openai.context.apikey',
      //   false
      // )
      ConfigurationPropertiesService.instance.load().then((x) => verifyApiKey())
    }

    if (
      event.affectsConfiguration('vscode-openai.authentication') ||
      event.affectsConfiguration('vscode-openai.baseUrl') ||
      event.affectsConfiguration('vscode-openai.defaultModel') ||
      event.affectsConfiguration('vscode-openai.azureDeployment') ||
      event.affectsConfiguration('vscode-openai.azureApiVersion')
    ) {
      ConfigurationPropertiesService.instance.load()
    }
  })
}

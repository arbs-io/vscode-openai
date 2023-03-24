import { commands, workspace } from 'vscode'
import { Configuration, OpenAIApi } from 'openai'
import { ConfigurationPropertiesService } from '../../vscodeUtilities'
import {
  ExtensionStatusBarItem,
  SecretStorageService,
} from '../../vscodeUtilities'

export async function validateApiKey() {
  const requestConfig = await ConfigurationPropertiesService.instance.get()
  if (
    requestConfig.apiKey !== undefined &&
    requestConfig.apiKey !== '<invalid-key>'
  ) {
    ExtensionStatusBarItem.instance.showStatusBarInformation(
      'loading~spin',
      'Connecting'
    )
    verifyApiKey()
  } else {
    commands.executeCommand('setContext', 'vscode-openai.context.apikey', false)
    ExtensionStatusBarItem.instance.showStatusBarError(
      'lock',
      'Invalid Api-Key'
    )
  }
}

export async function verifyApiKey(): Promise<boolean> {
  try {
    const requestConfig = await ConfigurationPropertiesService.instance.get()
    const configuration = new Configuration({
      apiKey: requestConfig.apiKey,
      basePath: requestConfig.baseUrl,
    })
    const openai = new OpenAIApi(configuration)
    const response = await openai.listModels(requestConfig.requestConfig)
    if (response.status === 200) {
      commands.executeCommand(
        'setContext',
        'vscode-openai.context.apikey',
        true
      )
      ExtensionStatusBarItem.instance.showStatusBarInformation('unlock', '')
      return true
    }
  } catch (error: any) {
    await SecretStorageService.instance.setAuthApiKey('<invalid-key>')
  }
  ExtensionStatusBarItem.instance.showStatusBarError('lock', 'Invalid Api-Key')
  return false
}

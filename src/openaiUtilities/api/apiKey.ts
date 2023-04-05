import { commands } from 'vscode'
import { Configuration, OpenAIApi } from 'openai'
import { ConfigurationService } from '../../vscodeUtilities'
import { ExtensionStatusBarItem } from '../../vscodeUtilities'
import { errorHandler } from './errorHandler'

export async function validateApiKey() {
  ExtensionStatusBarItem.instance.showStatusBarInformation(
    'loading~spin',
    '- initializing'
  )
  await verifyApiKey()
}

export async function verifyApiKey(): Promise<boolean> {
  try {
    const requestConfig = await ConfigurationService.instance.get()
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
    errorHandler(error)
  }
  return false
}

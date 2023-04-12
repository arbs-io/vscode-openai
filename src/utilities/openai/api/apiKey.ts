import { commands } from 'vscode'
import { Configuration, OpenAIApi } from 'openai'
import { ConfigurationService } from '../../../services'
import { ExtensionStatusBarItem } from '../../vscode'
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
    const configuration = new Configuration({
      apiKey: await ConfigurationService.instance.getApiKey(),
      basePath: ConfigurationService.instance.baseUrl,
    })
    const openai = new OpenAIApi(configuration)
    const response = await openai.listModels(
      await ConfigurationService.instance.getRequestConfig()
    )
    if (response.status === 200) {
      commands.executeCommand(
        'setContext',
        'vscode-openai.context.apikey',
        true
      )
      ExtensionStatusBarItem.instance.showStatusBarInformation('vscode-openai', '')
      return true
    }
  } catch (error: any) {
    errorHandler(error)
  }
  return false
}

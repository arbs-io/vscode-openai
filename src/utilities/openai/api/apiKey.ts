import { commands } from 'vscode'
import { Configuration, OpenAIApi } from 'openai'
import { ConfigurationService } from '@app/services'
import { ExtensionStatusBarItem, logInfo } from '@app/utilities/vscode'
import { errorHandler } from './errorHandler'
import { VSCODE_OPENAI_EXTENSION } from '@app/contexts'
import { sendTelemetryError } from '@app/utilities/node'

export async function validateApiKey() {
  try {
    ExtensionStatusBarItem.instance.showStatusBarInformation(
      'loading~spin',
      '- initializing'
    )
    await verifyApiKey()
  } catch (error) {
    sendTelemetryError(error)
  }
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
        VSCODE_OPENAI_EXTENSION.ENABLED_COMMAND_ID,
        true
      )
      logInfo('verifyApiKey success')
      ExtensionStatusBarItem.instance.showStatusBarInformation(
        'vscode-openai',
        ''
      )
      return true
    }
  } catch (error: any) {
    errorHandler(error)
  }
  return false
}

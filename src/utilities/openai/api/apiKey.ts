import { Configuration, OpenAIApi } from 'openai'
import { SettingConfigurationService, featureVerifyApiKey } from '@app/services'
import { StatusBarHelper, setFeatureFlag } from '@app/utilities/vscode'
import { errorHandler } from './errorHandler'
import { VSCODE_OPENAI_EXTENSION } from '@app/constants'
import {
  createErrorNotification,
  createInfoNotification,
} from '@app/utilities/node'

export async function validateApiKey() {
  try {
    await verifyApiKey()
  } catch (error) {
    createErrorNotification(error)
  }
}

export async function verifyApiKey(): Promise<boolean> {
  try {
    if (!featureVerifyApiKey()) return true

    StatusBarHelper.instance.showStatusBarInformation(
      'loading~spin',
      '- verify authentication'
    )
    const configuration = new Configuration({
      apiKey: await SettingConfigurationService.instance.getApiKey(),
      basePath: SettingConfigurationService.instance.baseUrl,
    })
    const openai = new OpenAIApi(configuration)
    const response = await openai.listModels(
      await SettingConfigurationService.instance.getRequestConfig()
    )
    if (response.status === 200) {
      setFeatureFlag(VSCODE_OPENAI_EXTENSION.ENABLED_COMMAND_ID, true)
      createInfoNotification('verifyApiKey success')
      StatusBarHelper.instance.showStatusBarInformation('vscode-openai', '')
      return true
    }
  } catch (error: any) {
    errorHandler(error)
    setFeatureFlag(VSCODE_OPENAI_EXTENSION.ENABLED_COMMAND_ID, false)
  }
  return false
}

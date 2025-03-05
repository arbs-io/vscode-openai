import { authentication } from 'vscode'
import {
  SettingConfig as settingCfg,
} from '@app/services'

export async function getAzureOpenAIAccessToken(): Promise<string> {
  const msSession = await authentication.getSession(
    settingCfg.azureEnvironment,
    [settingCfg.azureEndpoint, 'offline_access'],
    { createIfNone: true }
  )
  return msSession.accessToken
}

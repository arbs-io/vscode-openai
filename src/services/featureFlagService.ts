import { VSCODE_OPENAI_EMBEDDING } from '@app/constants'
import { SettingConfigurationService } from '@app/services'
import { setFeatureFlag } from '@app/utilities/vscode'

export const SUPPORT_EMBEDDING = ['OpenAI', 'Azure-OpenAI']
export const SUPPORT_VERIFY_APIKEY = ['OpenAI', 'Azure-OpenAI', 'VSCode-OpenAI']

export function enableServiceFeature() {
  const cfg = SettingConfigurationService.instance

  setFeatureFlag(VSCODE_OPENAI_EMBEDDING.ENABLED_COMMAND_ID, false)
  if (SUPPORT_EMBEDDING.includes(cfg.serviceProvider)) {
    setFeatureFlag(VSCODE_OPENAI_EMBEDDING.ENABLED_COMMAND_ID, true)
  }

  setFeatureFlag(VSCODE_OPENAI_EMBEDDING.SETUP_REQUIRED_COMMAND_ID, false)
  if (
    SettingConfigurationService.instance.embeddingModel === 'setup-required'
  ) {
    setFeatureFlag(VSCODE_OPENAI_EMBEDDING.SETUP_REQUIRED_COMMAND_ID, true)
  }
}

export function featureVerifyApiKey(): boolean {
  const cfg = SettingConfigurationService.instance
  if (SUPPORT_VERIFY_APIKEY.includes(cfg.serviceProvider)) {
    return true
  }
  return false
}

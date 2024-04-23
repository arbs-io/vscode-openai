import {
  VSCODE_OPENAI_EMBEDDING,
  VSCODE_OPENAI_EXTENSION,
} from '@app/constants'
import { ConfigurationSettingService } from '@app/services'
import { setFeatureFlag } from '@app/apis/vscode'

export const SUPPORT_EMBEDDING = ['OpenAI', 'Azure-OpenAI']
export const SUPPORT_VERIFY_APIKEY = ['OpenAI', 'Azure-OpenAI', 'VSCode-OpenAI']

export function disableServiceFeature() {
  // Disable functionality until we validate auth
  setFeatureFlag(VSCODE_OPENAI_EXTENSION.ENABLED_COMMAND_ID, false)
  setFeatureFlag(VSCODE_OPENAI_EMBEDDING.ENABLED_COMMAND_ID, false)
}

export function enableServiceFeature() {
  setFeatureFlag(VSCODE_OPENAI_EXTENSION.ENABLED_COMMAND_ID, true)

  setFeatureFlag(VSCODE_OPENAI_EMBEDDING.ENABLED_COMMAND_ID, false)
  if (SUPPORT_EMBEDDING.includes(ConfigurationSettingService.serviceProvider)) {
    setFeatureFlag(VSCODE_OPENAI_EMBEDDING.ENABLED_COMMAND_ID, true)
  }

  setFeatureFlag(VSCODE_OPENAI_EMBEDDING.SETUP_REQUIRED_COMMAND_ID, false)
  if (ConfigurationSettingService.embeddingModel === 'setup-required') {
    setFeatureFlag(VSCODE_OPENAI_EMBEDDING.SETUP_REQUIRED_COMMAND_ID, true)
  }
}

export function featureVerifyApiKey(): boolean {
  if (
    SUPPORT_VERIFY_APIKEY.includes(ConfigurationSettingService.serviceProvider)
  ) {
    return true
  }
  return false
}

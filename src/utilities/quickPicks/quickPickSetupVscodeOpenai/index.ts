import { ExtensionContext } from 'vscode'
import { MultiStepInput, SecretStorageService } from '@app/apis/vscode'
import { SettingConfig as settingCfg } from '@app/services'
import { IQuickPickSetupVscodeOpenai } from './IQuickPickSetupVscodeOpenai'
import { getApiKey } from './getApiKey'
import { step01Authentication } from './step01Authentication'

export async function quickPickSetupVscodeOpenai(
  _context: ExtensionContext
): Promise<void> {
  async function collectInputs() {
    const state = {} as Partial<IQuickPickSetupVscodeOpenai>
    state.title = 'Configure Service Provider (vscode-openai)'
    await MultiStepInput.run((input) => step01Authentication(input, state))
    return state as IQuickPickSetupVscodeOpenai
  }

  await collectInputs()
  const accessToken = await getApiKey()
  if (!accessToken) return

  await SecretStorageService.instance.setAuthApiKey(accessToken)
  settingCfg.serviceProvider = 'VSCode-OpenAI'
  settingCfg.baseUrl = `https://api.arbs.io/openai/inference/v1`
  settingCfg.defaultModel = 'gpt-4o'
  settingCfg.azureDeployment = 'gpt-4o'
  settingCfg.scmModel = 'gpt-4o'
  settingCfg.scmDeployment = 'gpt-4o'
  settingCfg.embeddingModel = 'text-embedding-ada-002'
  settingCfg.embeddingsDeployment = 'text-embedding-ada-002'
  settingCfg.azureApiVersion = '2024-02-01'
}

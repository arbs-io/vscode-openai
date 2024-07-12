import { ExtensionContext } from 'vscode'
import { SettingConfig as settingCfg } from '@app/services'
import { SecretStorageService, MultiStepInput } from '@app/apis/vscode'
import { IQuickPickSetup } from './interface'
import {
  showInputBoxApiKey,
  showInputBoxBaseUrl,
  showInputBoxInferenceModel,
} from './commands/custom'

/**
 * This function sets up a quick pick menu for configuring the OpenAI service provider.
 * @param _context - The extension context.
 * @returns void
 */
export async function quickPickSetupCustomOpenai(
  _context: ExtensionContext
): Promise<void> {
  async function collectInputs(): Promise<IQuickPickSetup> {
    let state = {} as Partial<IQuickPickSetup>
    state.serviceProvider = 'Custom-OpenAI'
    state.title = 'Configure Service Provider (openai.com)'
    state.step = 0
    const steps = [
      (input: MultiStepInput) => showInputBoxBaseUrl(input, state),
      (input: MultiStepInput) => showInputBoxApiKey(input, state),
      (input: MultiStepInput) => showInputBoxInferenceModel(input, state),
    ]
    state.totalSteps = steps.length

    await MultiStepInput.run(async (input) => {
      for (const step of steps) {
        await step(input)
      }
    })

    return state as IQuickPickSetup
  }

  //Start openai.com configuration processes
  const state = await collectInputs()

  await SecretStorageService.instance.setAuthApiKey(state.authApiKey)
  settingCfg.serviceProvider = state.serviceProvider
  settingCfg.baseUrl = state.baseUrl
  settingCfg.defaultModel = state.modelInferenceCustom
  settingCfg.azureDeployment = 'setup-required'
  settingCfg.scmModel = state.modelInferenceCustom
  settingCfg.scmDeployment = 'setup-required'
  settingCfg.embeddingModel = 'setup-required'
  settingCfg.embeddingsDeployment = 'setup-required'
  settingCfg.azureApiVersion = '2024-02-01'
}

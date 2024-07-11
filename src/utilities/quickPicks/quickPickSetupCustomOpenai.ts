import { ExtensionContext, Uri } from 'vscode'
import { SettingConfig as settingCfg } from '@app/services'
import { SecretStorageService, MultiStepInput } from '@app/apis/vscode'
import { IQuickPickSetup } from './interface'
import {
  showInputBoxCustomApiKey,
  showInputBoxCustomBaseUrl,
  showInputBoxCustomInferenceModel,
} from './commands'

/**
 * This function sets up a quick pick menu for configuring the OpenAI service provider.
 * @param _context - The extension context.
 * @returns void
 */
export async function quickPickSetupCustomOpenai(
  _context: ExtensionContext
): Promise<void> {
  // async function collectInputs() {
  //   const state = {} as Partial<IQuickPickSetup>
  //   await MultiStepInput.run((input) => inputOpenaiBaseUrl(input, state))
  //   return state as IQuickPickSetup
  // }

  async function collectInputs(): Promise<IQuickPickSetup> {
    let state = {} as Partial<IQuickPickSetup>
    state.serviceProvider = 'Azure-OpenAI'
    state.title = 'Configure Service Provider (openai.com)'
    state.step = 1
    const steps = [
      (input: MultiStepInput) => showInputBoxCustomBaseUrl(input, state),
      (input: MultiStepInput) => showInputBoxCustomApiKey(input, state),
      (input: MultiStepInput) => showInputBoxCustomInferenceModel(input, state),
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
  settingCfg.serviceProvider = 'Custom-OpenAI'
  settingCfg.baseUrl = state.baseUrl
  settingCfg.defaultModel = state.modelInferenceCustom
  settingCfg.azureDeployment = 'setup-required'
  settingCfg.scmModel = state.modelInferenceCustom
  settingCfg.scmDeployment = 'setup-required'
  settingCfg.embeddingModel = 'setup-required'
  settingCfg.embeddingsDeployment = 'setup-required'
  settingCfg.azureApiVersion = '2024-02-01'
}

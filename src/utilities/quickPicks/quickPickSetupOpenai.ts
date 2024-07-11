import { ExtensionContext } from 'vscode'
import { SettingConfig as settingCfg } from '@app/services'
import { SecretStorageService, MultiStepInput } from '@app/apis/vscode'
import { IQuickPickSetup } from './interface'
import {
  showInputBoxApiKey,
  showInputBoxBaseUrl,
  showQuickPickEmbeddingModel,
  showQuickPickInferenceModel,
  showQuickPickScmModel,
} from './commands/openai'

export async function quickPickSetupOpenai(
  _context: ExtensionContext
): Promise<void> {
  async function collectInputs(): Promise<IQuickPickSetup> {
    let state = {} as Partial<IQuickPickSetup>
    state.serviceProvider = 'OpenAI'
    state.title = 'Configure Service Provider (openai.com)'
    state.baseUrl = 'https://api.openai.com/v1'
    state.step = 1
    const steps = [
      (input: MultiStepInput) => showInputBoxBaseUrl(input, state),
      (input: MultiStepInput) => showInputBoxApiKey(input, state),
      (input: MultiStepInput) => showQuickPickInferenceModel(input, state),
      (input: MultiStepInput) => showQuickPickScmModel(input, state),
      (input: MultiStepInput) => showQuickPickEmbeddingModel(input, state),
    ]
    state.totalSteps = steps.length

    await MultiStepInput.run(async (input) => {
      for (const step of steps) {
        await step(input)
      }
    })

    return state as IQuickPickSetup
  }

  function cleanQuickPick(label: string) {
    return label.replace(`$(symbol-function)  `, '')
  }

  //Start openai.com configuration processes
  const state = await collectInputs()

  await SecretStorageService.instance.setAuthApiKey(state.authApiKey)
  const inferenceModel = cleanQuickPick(state.modelInference.label)
  const scmModel = cleanQuickPick(state.modelScm.label)
  const embeddingModel = cleanQuickPick(state.modelEmbedding.label)

  settingCfg.serviceProvider = state.serviceProvider
  settingCfg.baseUrl = state.baseUrl
  settingCfg.defaultModel = inferenceModel
  settingCfg.azureDeployment = 'setup-required'
  settingCfg.scmModel = scmModel
  settingCfg.scmDeployment = 'setup-required'
  settingCfg.embeddingModel = embeddingModel
  settingCfg.embeddingsDeployment = 'setup-required'
  settingCfg.azureApiVersion = '2024-02-01'
}

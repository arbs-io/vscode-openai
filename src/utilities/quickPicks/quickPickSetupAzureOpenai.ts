import { ExtensionContext } from 'vscode'
import { SettingConfig as settingCfg } from '@app/services'
import { SecretStorageService, MultiStepInput } from '@app/apis/vscode'
import { IQuickPickSetup } from './interface'
import {
  showInputBoxAzureBaseUrl,
  showQuickPickAzureAuthentication,
  showInputBoxAzureApiKey,
  showQuickPickAzureInferenceModel,
  showQuickPickAzureScmModel,
  showQuickPickAzureEmbeddingModel,
} from './commands'

export async function quickPickSetupAzureOpenai(
  _context: ExtensionContext
): Promise<void> {
  async function collectInputs(): Promise<IQuickPickSetup> {
    let state = {} as Partial<IQuickPickSetup>
    state.serviceProvider = 'Azure-OpenAI'
    state.title = 'Configure Service Provider (openai.azure.com)'
    state.step = 1
    const steps = [
      (input: MultiStepInput) => showInputBoxAzureBaseUrl(input, state),
      (input: MultiStepInput) => showQuickPickAzureAuthentication(input, state),
      (input: MultiStepInput) => showInputBoxAzureApiKey(input, state),
      (input: MultiStepInput) => showQuickPickAzureInferenceModel(input, state),
      (input: MultiStepInput) => showQuickPickAzureScmModel(input, state),
      (input: MultiStepInput) => showQuickPickAzureEmbeddingModel(input, state),
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

  const inferenceModel = state.modelInference.description as string
  const inferenceDeploy = cleanQuickPick(state.modelInference.label)

  const scmModel = state.modelScm.description as string
  const scmDeploy = cleanQuickPick(state.modelScm.label)

  let embeddingModel = 'setup-required'
  let embeddingDeploy = 'setup-required'
  if (state.modelEmbedding) {
    embeddingModel = state.modelEmbedding.description as string
    embeddingDeploy = cleanQuickPick(state.modelEmbedding.label)
  }

  await SecretStorageService.instance.setAuthApiKey(state.authApiKey)
  settingCfg.serviceProvider = state.serviceProvider
  settingCfg.baseUrl = state.baseUrl
  settingCfg.defaultModel = inferenceModel
  settingCfg.azureDeployment = inferenceDeploy
  settingCfg.scmModel = scmModel
  settingCfg.scmDeployment = scmDeploy
  settingCfg.embeddingModel = embeddingModel
  settingCfg.embeddingsDeployment = embeddingDeploy
  settingCfg.azureApiVersion = '2024-02-01'
}

/**
 * This function runs a multistep configuration for vscode-openai
 * 	Steps:
 * 		1 - Select the authentication type
 * 		Store and activate configuration
 */

import { QuickPickItem, ExtensionContext } from 'vscode'
import { MultiStepInput } from '@app/apis/vscode'
import { SettingConfig as settingCfg } from '@app/services'
import { ModelCapability } from '@app/apis/openai'
import {
  getAvailableModelsAzure,
  getAvailableModelsOpenai,
} from './getAvailableModels'

/**
 * This function sets up a quick pick menu for configuring the OpenAI service provider.
 * @param context - The extension context.
 * @returns void
 */
export async function quickPickChangeModel(
  _context: ExtensionContext
): Promise<void> {
  interface State {
    title: string
    step: number
    totalSteps: number
    quickPickInferenceModel: QuickPickItem
    quickPickScmModel: QuickPickItem
    quickPickEmbeddingModel: QuickPickItem
  }

  async function collectInputs(): Promise<State> {
    const state = {} as Partial<State>
    await MultiStepInput.run((input) => selectChatModel(input, state))
    return state as State
  }

  const title = 'Change chat and embedding model'

  /**
   * This function displays a quick pick menu for selecting an OpenAI model and updates the application's state accordingly.
   * @param input - The multi-step input object.
   * @param state - The current state of the application.
   */
  async function selectChatModel(input: MultiStepInput, state: Partial<State>) {
    // Display quick pick menu for selecting an OpenAI model and update application's state accordingly.
    // Return void since this is not used elsewhere in the code.

    const models = await fetchAvailableModels(ModelCapability.ChatCompletion)
    state.quickPickInferenceModel = await input.showQuickPick({
      title,
      step: 1,
      totalSteps: 3,
      ignoreFocusOut: false,
      placeholder:
        'Selected chat completion model (if empty, no valid models found)',
      items: models,
      activeItem: state.quickPickInferenceModel,
      shouldResume: shouldResume,
    })

    return (input: MultiStepInput) => selectScmModel(input, state)
  }

  /**
   * This function displays a quick pick menu for selecting an OpenAI model and updates the application's state accordingly.
   * @param input - The multi-step input object.
   * @param state - The current state of the application.
   */
  async function selectScmModel(input: MultiStepInput, state: Partial<State>) {
    // Display quick pick menu for selecting an OpenAI model and update application's state accordingly.
    // Return void since this is not used elsewhere in the code.

    const models = await fetchAvailableModels(ModelCapability.ChatCompletion)
    state.quickPickScmModel = await input.showQuickPick({
      title,
      step: 2,
      totalSteps: 3,
      ignoreFocusOut: false,
      placeholder: 'Selected SCM (git) model (if empty, no valid models found)',
      items: models,
      activeItem: state.quickPickScmModel,
      shouldResume: shouldResume,
    })

    return (input: MultiStepInput) => selectEmbeddingModel(input, state)
  }

  /**
   * This function displays a quick pick menu for selecting an OpenAI model and updates the application's state accordingly.
   * @param input - The multi-step input object.
   * @param state - The current state of the application.
   */
  async function selectEmbeddingModel(
    input: MultiStepInput,
    state: Partial<State>
  ) {
    // Display quick pick menu for selecting an OpenAI model and update application's state accordingly.
    // Return void since this is not used elsewhere in the code.

    const models = await fetchAvailableModels(ModelCapability.Embedding)
    state.quickPickEmbeddingModel = await input.showQuickPick({
      title,
      step: 3,
      totalSteps: 3,
      ignoreFocusOut: false,
      placeholder:
        'Selected chat completion model (if empty, no valid models found)',
      items: models,
      activeItem: state.quickPickEmbeddingModel,
      shouldResume: shouldResume,
    })
  }

  async function fetchAvailableModels(
    modelCapabiliy: ModelCapability
  ): Promise<QuickPickItem[]> {
    let models: QuickPickItem[] = []
    switch (settingCfg.serviceProvider) {
      case 'OpenAI':
        models = await getAvailableModelsOpenai(
          await settingCfg.getApiKey(),
          settingCfg.baseUrl,
          modelCapabiliy
        )
        break
      case 'Azure-OpenAI':
        models = await getAvailableModelsAzure(
          await settingCfg.getApiKey(),
          settingCfg.baseUrl,
          modelCapabiliy
        )
        break

      default:
        return []
    }
    return models
  }

  function shouldResume(): Promise<boolean> {
    // Implementation to handle resuming the UI
    return Promise.resolve(true)
  }

  function cleanQuickPick(label: string) {
    return label.replace(`$(symbol-function)  `, '')
  }

  //Start openai.com configuration processes
  const state = await collectInputs()

  let inferenceModel = 'setup-required'
  let inferenceDeploy = 'setup-required'
  let scmModel = 'setup-required'
  let scmDeploy = 'setup-required'
  let embeddingModel = 'setup-required'
  let embeddingDeploy = 'setup-required'

  switch (settingCfg.serviceProvider) {
    case 'OpenAI': {
      inferenceModel = cleanQuickPick(state.quickPickInferenceModel.label)
      scmModel = cleanQuickPick(state.quickPickScmModel.label)
      embeddingModel = cleanQuickPick(state.quickPickEmbeddingModel.label)
      break
    }
    case 'Azure-OpenAI': {
      inferenceModel = state.quickPickInferenceModel.description as string
      inferenceDeploy = cleanQuickPick(state.quickPickInferenceModel.label)

      scmModel = state.quickPickScmModel.description as string
      scmDeploy = cleanQuickPick(state.quickPickScmModel.label)

      if (state.quickPickEmbeddingModel) {
        embeddingModel = state.quickPickEmbeddingModel.description as string
        embeddingDeploy = cleanQuickPick(state.quickPickEmbeddingModel.label)
      }
      break
    }

    default:
      break
  }

  settingCfg.defaultModel = inferenceModel
  settingCfg.azureDeployment = inferenceDeploy
  settingCfg.scmModel = scmModel
  settingCfg.scmDeployment = scmDeploy
  settingCfg.embeddingModel = embeddingModel
  settingCfg.embeddingsDeployment = embeddingDeploy
}

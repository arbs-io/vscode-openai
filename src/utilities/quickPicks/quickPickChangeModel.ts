/**
 * This function runs a multistep configuration for vscode-openai
 * 	Steps:
 * 		1 - Select the authentication type
 * 		Store and activate configuration
 */

import { QuickPickItem, ExtensionContext } from 'vscode'
import { MultiStepInput } from '@app/apis/vscode'
import { ConfigurationSettingService } from '@app/services'
import { ModelCapabiliy } from '@app/apis/openai'
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

  async function collectInputs() {
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

    const models = await getAvailableModels(ModelCapabiliy.ChatCompletion)
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

    const models = await getAvailableModels(ModelCapabiliy.ChatCompletion)
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

    const models = await getAvailableModels(ModelCapabiliy.Embedding)
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

  async function getAvailableModels(
    modelCapabiliy: ModelCapabiliy
  ): Promise<QuickPickItem[]> {
    let models: QuickPickItem[] = []
    switch (ConfigurationSettingService.serviceProvider) {
      case 'OpenAI':
        models = await getAvailableModelsOpenai(
          await ConfigurationSettingService.getApiKey(),
          ConfigurationSettingService.baseUrl,
          modelCapabiliy
        )
        break
      case 'Azure-OpenAI':
        models = await getAvailableModelsAzure(
          await ConfigurationSettingService.getApiKey(),
          ConfigurationSettingService.baseUrl,
          modelCapabiliy
        )
        break

      default:
        break
    }
    return models
  }

  function shouldResume() {
    // Could show a notification with the option to resume.
    return new Promise<boolean>((_resolve, _reject) => {
      /* noop */
    })
  }

  function cleanQuickPick(label: string) {
    return label.replace(`$(symbol-function)  `, '')
  }

  //Start openai.com configuration processes
  const state = await collectInputs()

  const inferenceModel = cleanQuickPick(state.quickPickInferenceModel.label)
  const scmModel = cleanQuickPick(state.quickPickScmModel.label)
  const embeddingModel = cleanQuickPick(state.quickPickEmbeddingModel.label)

  ConfigurationSettingService.defaultModel = inferenceModel
  ConfigurationSettingService.scmModel = scmModel
  ConfigurationSettingService.embeddingModel = embeddingModel
}

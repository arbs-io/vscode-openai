/**
 * This function runs a multistep configuration for vscode-openai
 * 	Steps:
 * 		1 - Base Url (openai.com/v1)
 * 		2 - ApiKey for openai.com service
 * 		3 - Select availible openai model that support chat completion
 * 		Store and activate configuration
 */

import { QuickPickItem, ExtensionContext, Uri } from 'vscode'
import { ConfigurationSettingService } from '@app/services'
import { ModelCapabiliy } from '@app/apis/openai'
import { SecretStorageService, MultiStepInput } from '@app/apis/vscode'
import { getAvailableModelsOpenai } from './getAvailableModels'

/**
 * This function sets up a quick pick menu for configuring the OpenAI service provider.
 * @param _context - The extension context.
 * @returns void
 */
export async function quickPickSetupOpenai(
  _context: ExtensionContext
): Promise<void> {
  interface State {
    title: string
    step: number
    totalSteps: number
    openaiBaseUrl: string
    openaiApiKey: string
    quickPickInferenceModel: QuickPickItem
    quickPickEmbeddingModel: QuickPickItem
  }

  async function collectInputs() {
    const state = {} as Partial<State>
    await MultiStepInput.run((input) => inputOpenaiBaseUrl(input, state))
    return state as State
  }

  const title = 'Configure Service Provider (openai.com)'

  /**
   * This function collects user input for the service baseurl and returns it as a state object.
   * @param input - The multi-step input object.
   * @param state - The current state of the application.
   * @returns A function that prompts the user to select an OpenAI model.
   */
  async function inputOpenaiBaseUrl(
    input: MultiStepInput,
    state: Partial<State>
  ) {
    state.openaiBaseUrl = await input.showInputBox({
      title,
      step: 1,
      totalSteps: 4,
      ignoreFocusOut: true,
      value:
        typeof state.openaiBaseUrl === 'string'
          ? state.openaiBaseUrl
          : 'https://api.openai.com/v1',
      valueSelection:
        typeof state.openaiBaseUrl === 'string' ? undefined : [0, 25],
      prompt:
        '$(globe)  Enter the instance name. Provide the base url default https://api.openai.com/v1"',
      placeholder: 'https://api.openai.com/v1',
      validate: validateOpenaiBaseUrl,
      shouldResume: shouldResume,
    })
    return (input: MultiStepInput) => inputOpenaiApiKey(input, state)
  }

  /**
   * This function collects user input for the OpenAI API key and returns it as a state object.
   * @param input - The multi-step input object.
   * @param state - The current state of the application.
   * @returns A function that prompts the user to select an OpenAI model.
   */
  async function inputOpenaiApiKey(
    input: MultiStepInput,
    state: Partial<State>
  ) {
    state.openaiApiKey = await input.showInputBox({
      title,
      step: 2,
      totalSteps: 4,
      ignoreFocusOut: true,
      value: typeof state.openaiApiKey === 'string' ? state.openaiApiKey : '',
      prompt: `$(key)  Enter the openai.com Api-Key`,
      placeholder: 'sk-8i6055nAY3eAwARfHFjiT5BlbkFJAEFUvG5GwtAV2RiwP87h',
      validate: validateOpenaiApiKey,
      shouldResume: shouldResume,
    })
    return (input: MultiStepInput) => selectChatCompletionModel(input, state)
  }

  /**
   * This function displays a quick pick menu for selecting an OpenAI model and updates the application's state accordingly.
   * @param input - The multi-step input object.
   * @param state - The current state of the application.
   */
  async function selectChatCompletionModel(
    input: MultiStepInput,
    state: Partial<State>
  ) {
    const models = await getAvailableModelsOpenai(
      state.openaiApiKey!,
      state.openaiBaseUrl!,
      ModelCapabiliy.ChatCompletion
    )
    // Display quick pick menu for selecting an OpenAI model and update application's state accordingly.
    // Return void since this is not used elsewhere in the code.
    state.quickPickInferenceModel = await input.showQuickPick({
      title,
      step: 3,
      totalSteps: 4,
      ignoreFocusOut: true,
      placeholder:
        'Selected chat completion model (if empty, no valid models found)',
      items: models,
      activeItem: state.quickPickInferenceModel,
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
  ): Promise<void> {
    const models = await getAvailableModelsOpenai(
      state.openaiApiKey!,
      state.openaiBaseUrl!,
      ModelCapabiliy.Embedding
    )
    // Display quick pick menu for selecting an OpenAI model and update application's state accordingly.
    // Return void since this is not used elsewhere in the code.
    state.quickPickEmbeddingModel = await input.showQuickPick({
      title,
      step: 4,
      totalSteps: 4,
      ignoreFocusOut: true,
      placeholder: 'Selected embedding model (if empty, no valid models found)',
      items: models,
      activeItem: state.quickPickEmbeddingModel,
      shouldResume: shouldResume,
    })
  }

  /**
   * This function validates whether an API key is valid or not based on its length and prefix.
   * @param name - The name of the API key to be validated.
   * @returns An error message if validation fails or undefined if validation passes.
   */
  async function validateOpenaiApiKey(
    name: string
  ): Promise<string | undefined> {
    const OPENAI_APIKEY_MIN_LENGTH = 1
    const OPENAI_APIKEY_STARTSWITH = 'sk-'
    const OPENAI_OAUTH2_BEARER_STARTSWITH = 'Bearer'
    const OPENAI_OAUTH2_TOKEN_STARTSWITH = 'ey'

    // Native openai service key or oauth2 token
    return name.length >= OPENAI_APIKEY_MIN_LENGTH &&
      (name.startsWith(OPENAI_APIKEY_STARTSWITH) ||
        name.startsWith(OPENAI_OAUTH2_BEARER_STARTSWITH) ||
        name.startsWith(OPENAI_OAUTH2_TOKEN_STARTSWITH))
      ? undefined
      : 'Invalid Api-Key or Token'
  }

  /**
   * This function validates whether an instance name is valid or not based on resolving the host.
   * @param name - The name of the API key to be validated.
   * @returns An error message if validation fails or undefined if validation passes.
   */
  async function validateOpenaiBaseUrl(
    baseUrl: string
  ): Promise<string | undefined> {
    return Uri.parse(baseUrl) ? undefined : 'Invalid Uri'
  }

  function shouldResume() {
    // Could show a notification with the option to resume.
    return new Promise<boolean>((_resolve, _reject) => {
      /* noop */
    })
  }

  //Start openai.com configuration processes
  const state = await collectInputs()

  await SecretStorageService.instance.setAuthApiKey(state.openaiApiKey)
  const inferenceModel = state.quickPickInferenceModel.label.replace(
    `$(symbol-function)  `,
    ''
  )
  const embeddingModel = state.quickPickEmbeddingModel.label.replace(
    `$(symbol-function)  `,
    ''
  )

  await ConfigurationSettingService.loadConfigurationService({
    serviceProvider: 'OpenAI',
    baseUrl: state.openaiBaseUrl,
    defaultModel: inferenceModel,
    embeddingModel: embeddingModel,
    azureDeployment: 'setup-required',
    embeddingsDeployment: 'setup-required',
    azureApiVersion: '2023-05-15',
  })
}

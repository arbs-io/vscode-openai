/**
 * This function runs a multistep configuration for vscode-openai
 * 	Steps:
 * 		1 - Base Url (openai.com/v1)
 * 		2 - ApiKey for openai.com service
 * 		3 - Select availible openai model that support chat completion
 * 		Store and activate configuration
 */

import {
  QuickPickItem,
  window,
  CancellationToken,
  ExtensionContext,
  Uri,
} from 'vscode'
import { ConfigurationService } from '@app/services'
import { openaiListModels } from '@app/utilities/openai'
import { SecretStorageService, MultiStepInput } from '@app/utilities/vscode'

/**
 * This function sets up a quick pick menu for configuring the OpenAI service provider.
 * @param context - The extension context.
 * @returns void
 */
export async function quickPickSetupOpenai(
  context: ExtensionContext
): Promise<void> {
  interface State {
    title: string
    step: number
    totalSteps: number
    openaiBaseUrl: string
    openaiApiKey: string
    openaiModel: QuickPickItem
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
      totalSteps: 3,
      ignoreFocusOut: true,
      value:
        typeof state.openaiBaseUrl === 'string'
          ? state.openaiBaseUrl
          : 'https://api.openai.com/v1',
      valueSelection:
        typeof state.openaiBaseUrl === 'string' ? undefined : [0, 25],
      prompt:
        'Enter you instance name. Provide the base url default https://api.openai.com/v1"',
      placeholder: 'chatbot',
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
  ): Promise<(input: MultiStepInput) => Promise<void>> {
    state.openaiApiKey = await input.showInputBox({
      title,
      step: 2,
      totalSteps: 3,
      ignoreFocusOut: true,
      value: typeof state.openaiApiKey === 'string' ? state.openaiApiKey : '',
      prompt: 'Enter you openai.com Api-Key',
      placeholder: 'sk-8i6055nAY3eAwARfHFjiT5BlbkFJAEFUvG5GwtAV2RiwP87h',
      validate: validateOpenaiApiKey,
      shouldResume: shouldResume,
    })
    return (input: MultiStepInput) => selectOpenaiModel(input, state)
  }

  /**
   * This function displays a quick pick menu for selecting an OpenAI model and updates the application's state accordingly.
   * @param input - The multi-step input object.
   * @param state - The current state of the application.
   */
  async function selectOpenaiModel(
    input: MultiStepInput,
    state: Partial<State>
  ): Promise<void> {
    const models = await getAvailableModels(
      state.openaiBaseUrl!,
      state.openaiApiKey!,
      undefined /* TODO: token */
    )
    // Display quick pick menu for selecting an OpenAI model and update application's state accordingly.
    // Return void since this is not used elsewhere in the code.
    state.openaiModel = await input.showQuickPick({
      title,
      step: 3,
      totalSteps: 3,
      ignoreFocusOut: true,
      placeholder: 'Selected OpenAI Model',
      items: models,
      activeItem: state.openaiModel,
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
    const OPENAI_APIKEY_MIN_LENGTH = 51
    const OPENAI_APIKEY_STARTSWITH = 'sk-'

    return name.length >= OPENAI_APIKEY_MIN_LENGTH &&
      name.startsWith(OPENAI_APIKEY_STARTSWITH)
      ? undefined
      : 'Invalid Api Key'
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

  /**
   * This function retrieves available models from Open AI using an API key. It returns a list of QuickPickItems representing each available model.
   * @param openapiAPIKey - The API key used to authenticate with Open AI.
   * @param token - A cancellation token that can be used to cancel this operation. Not currently implemented in this codebase so defaults to undefined.
   * @returns A list of QuickPickItems representing each available model returned by the API call to Open AI.
   */
  async function getAvailableModels(
    baseUrl: string,
    apiKey: string,
    token?: CancellationToken
  ): Promise<QuickPickItem[]> {
    const chatCompletionModels = await openaiListModels(baseUrl, apiKey)

    // Map each returned label into a QuickPickItem object with label property set as label value returned by API call.
    return chatCompletionModels.map((label) => ({ label }))
  }

  function shouldResume() {
    // Could show a notification with the option to resume.
    return new Promise<boolean>((resolve, reject) => {
      // noop
    })
  }

  //Start openai.com configuration processes
  const state = await collectInputs()
  ConfigurationService.instance.serviceProvider = 'OpenAI'
  ConfigurationService.instance.baseUrl = state.openaiBaseUrl
  ConfigurationService.instance.defaultModel = state.openaiModel.label
  SecretStorageService.instance.setAuthApiKey(state.openaiApiKey)
}

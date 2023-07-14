/**
 * This function runs a multistep configuration for vscode-openai
 * 	Steps:
 * 		1 - Base Url (openai.com/v1)
 * 		2 - ApiKey for openai.com service
 * 		3 - Select availible openai model that support chat completion
 * 		Store and activate configuration
 */

import { QuickPickItem, CancellationToken, ExtensionContext } from 'vscode'
import { ConfigurationSettingService } from '@app/services'
import { SecretStorageService, MultiStepInput } from '@app/utilities/vscode'

/**
 * This function sets up a quick pick menu for configuring the OpenAI service provider.
 * @param _context - The extension context.
 * @returns void
 */
export async function quickPickSetupCredalOpenai(
  _context: ExtensionContext
): Promise<void> {
  interface State {
    title: string
    step: number
    totalSteps: number
    openaiApiKey: string
    quickPickInferenceModel: QuickPickItem
  }

  async function collectInputs() {
    const state = {} as Partial<State>
    await MultiStepInput.run((input) => inputOpenaiApiKey(input, state))
    return state as State
  }

  const title = 'Configure Service Provider (credal.ai)'

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
      step: 1,
      totalSteps: 2,
      ignoreFocusOut: true,
      value: typeof state.openaiApiKey === 'string' ? state.openaiApiKey : '',
      prompt: '$(key)  Enter you openai.com Api-Key',
      placeholder: 'eyJh...CJ9.eyJ1dW...NDk2fQ.hiBLQ...66W18',
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
    const models = await getAvailableModels()
    // Display quick pick menu for selecting an OpenAI model and update application's state accordingly.
    // Return void since this is not used elsewhere in the code.
    state.quickPickInferenceModel = await input.showQuickPick({
      title,
      step: 2,
      totalSteps: 2,
      ignoreFocusOut: true,
      placeholder:
        '$(symbol-function)  Selected Chat Completion DeploymentModel (if empty, no valid chat completion models found)',
      items: models,
      activeItem: state.quickPickInferenceModel,
      shouldResume: shouldResume,
    })

    // return (input: MultiStepInput) => selectEmbeddingModel(input, state)
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
    const OPENAI_OAUTH2_STARTSWITH = 'ey'

    // Native openai service key or oauth2 token
    return name.length >= OPENAI_APIKEY_MIN_LENGTH &&
      name.startsWith(OPENAI_OAUTH2_STARTSWITH)
      ? undefined
      : 'Invalid Api-Key or Token'
  }

  /**
   * This function retrieves available models from Open AI using an API key. It returns a list of QuickPickItems representing each available model.
   * @param openapiAPIKey - The API key used to authenticate with Open AI.
   * @param _token - A cancellation token that can be used to cancel this operation. Not currently implemented in this codebase so defaults to undefined.
   * @returns A list of QuickPickItems representing each available model returned by the API call to Open AI.
   */
  async function getAvailableModels(
    _token?: CancellationToken
  ): Promise<QuickPickItem[]> {
    const chatCompletionModels = ['gpt-3.5-turbo', 'gpt-4']

    // Map each returned label into a QuickPickItem object with label property set as label value returned by API call.
    return chatCompletionModels.map((label) => ({ label }))
  }

  function shouldResume() {
    // Could show a notification with the option to resume.
    return new Promise<boolean>((_resolve, _reject) => {
      /* noop */
    })
  }

  //Start openai.com configuration processes
  const state = await collectInputs()
  const inferenceModel = state.quickPickInferenceModel.label

  await SecretStorageService.instance.setAuthApiKey(state.openaiApiKey)
  await ConfigurationSettingService.loadConfigurationService({
    serviceProvider: 'CredalAI',
    baseUrl: 'https://app.credal.ai/api/openai',
    defaultModel: inferenceModel,
    embeddingModel: 'setup-required',
    azureDeployment: 'setup-required',
    embeddingsDeployment: 'setup-required',
    azureApiVersion: '2023-05-15',
  })
}

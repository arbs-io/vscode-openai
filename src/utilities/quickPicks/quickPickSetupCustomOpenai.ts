import { ExtensionContext, Uri } from 'vscode'
import { SettingConfig } from '@app/services'
import { SecretStorageService, MultiStepInput } from '@app/apis/vscode'

/**
 * This function sets up a quick pick menu for configuring the OpenAI service provider.
 * @param _context - The extension context.
 * @returns void
 */
export async function quickPickSetupCustomOpenai(
  _context: ExtensionContext
): Promise<void> {
  interface State {
    title: string
    step: number
    totalSteps: number
    openaiBaseUrl: string
    openaiApiKey: string
    inferenceModel: string
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
      value: typeof state.openaiBaseUrl === 'string' ? state.openaiBaseUrl : '',
      prompt:
        '$(globe)  Enter the instance name. Provide the base url default https://localhost/v1"',
      placeholder: 'https://localhost/v1',
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
      totalSteps: 3,
      ignoreFocusOut: true,
      value: typeof state.openaiApiKey === 'string' ? state.openaiApiKey : '',
      prompt: `$(key)  Enter the openai.com Api-Key`,
      placeholder: '25c1f091-bbec-4e4c-bb87-200efa145446',
      validate: validateIgnored,
      shouldResume: shouldResume,
    })
    return (input: MultiStepInput) => inputChatCompletionModel(input, state)
  }

  /**
   * This function displays a quick pick menu for selecting an OpenAI model and updates the application's state accordingly.
   * @param input - The multi-step input object.
   * @param state - The current state of the application.
   */
  async function inputChatCompletionModel(
    input: MultiStepInput,
    state: Partial<State>
  ) {
    state.inferenceModel = await input.showInputBox({
      title,
      step: 3,
      totalSteps: 3,
      ignoreFocusOut: true,
      value:
        typeof state.inferenceModel === 'string' ? state.inferenceModel : '',
      prompt: `$(symbol-function)  Enter the model name`,
      placeholder: ' Llama-2-70B',
      validate: validateIgnored,
      shouldResume: shouldResume,
    })
  }

  /**
   * This function validates whether an API key is valid or not based on its length and prefix.
   * @param _name - The name of the API key to be validated.
   * @returns An error message if validation fails or undefined if validation passes.
   */
  async function validateIgnored(_name: string): Promise<string | undefined> {
    return undefined
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
  SettingConfig.serviceProvider = 'Custom-OpenAI'
  SettingConfig.baseUrl = state.openaiBaseUrl
  SettingConfig.defaultModel = state.inferenceModel
  SettingConfig.azureDeployment = 'setup-required'
  SettingConfig.scmModel = state.inferenceModel
  SettingConfig.scmDeployment = 'setup-required'
  SettingConfig.embeddingModel = 'setup-required'
  SettingConfig.embeddingsDeployment = 'setup-required'
  SettingConfig.azureApiVersion = '2024-02-01'
}

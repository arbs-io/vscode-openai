/**
 * This function runs a multistep configuration for vscode-openai
 * 	Steps:
 * 		1 - Base Url (instance.openai.azure.com/openai)
 * 		2 - ApiKey for openai.azure.com service
 * 		3 - Select availible openai model that support chat completion
 * 		Store and activate configuration
 */

import { QuickPickItem, ExtensionContext, Uri } from 'vscode'
import { ConfigurationSettingService } from '@app/services'
import { ModelCapability } from '@app/apis/openai'
import { SecretStorageService, MultiStepInput } from '@app/apis/vscode'
import { getAvailableModelsAzure } from './getAvailableModels'

/**
 * This function sets up a quick pick menu for configuring the OpenAI service provider.
 * @param context - The extension context.
 * @returns void
 */
export async function quickPickSetupAzureOpenai(
  _context: ExtensionContext
): Promise<void> {
  interface State {
    title: string
    step: number
    totalSteps: number
    openaiBaseUrl: string
    openaiApiKey: string
    quickPickInferenceModel: QuickPickItem
    quickPickScmModel: QuickPickItem
    quickPickEmbeddingModel: QuickPickItem
  }

  async function collectInputs() {
    const state = {} as Partial<State>
    await MultiStepInput.run((input) => inputOpenaiBaseUrl(input, state))
    return state as State
  }

  const title = 'Configure Service Provider (openai.azure.com)'

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
      totalSteps: 5,
      ignoreFocusOut: true,
      value:
        typeof state.openaiBaseUrl === 'string'
          ? state.openaiBaseUrl
          : 'https://instance.openai.azure.com/openai',
      valueSelection:
        typeof state.openaiBaseUrl === 'string' ? undefined : [8, 16],
      prompt:
        '$(globe)  Enter the instance name. Provide the base url for example "https://instance.openai.azure.com/openai"',
      placeholder: 'https://instance.openai.azure.com/openai',
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
      totalSteps: 5,
      ignoreFocusOut: true,
      value: typeof state.openaiApiKey === 'string' ? state.openaiApiKey : '',
      prompt: '$(key)  Enter the openai.com Api-Key',
      placeholder: 'ed4af062d8567543ad104587ea4505ce',
      validate: validateAzureOpenaiApiKey,
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
    const models = await getAvailableModelsAzure(
      state.openaiApiKey!,
      state.openaiBaseUrl!,
      ModelCapability.ChatCompletion
    )
    // Display quick pick menu for selecting an OpenAI model and update application's state accordingly.
    // Return void since this is not used elsewhere in the code.
    state.quickPickInferenceModel = await input.showQuickPick({
      title,
      step: 3,
      totalSteps: 5,
      ignoreFocusOut: true,
      placeholder:
        'Selected chat completion deployment/model (if empty, no valid models found)',
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
    const models = await getAvailableModelsAzure(
      state.openaiApiKey!,
      state.openaiBaseUrl!,
      ModelCapability.ChatCompletion
    )
    // Display quick pick menu for selecting an OpenAI model and update application's state accordingly.
    // Return void since this is not used elsewhere in the code.
    state.quickPickScmModel = await input.showQuickPick({
      title,
      step: 4,
      totalSteps: 5,
      ignoreFocusOut: true,
      placeholder:
        'Selected SCM (git) deployment/model (if empty, no valid models found)',
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
  ) {
    const models = await getAvailableModelsAzure(
      state.openaiApiKey!,
      state.openaiBaseUrl!,
      ModelCapability.Embedding
    )

    if (models.length > 0) {
      // Display quick pick menu for selecting an OpenAI model and update application's state accordingly.
      // Return void since this is not used elsewhere in the code.
      state.quickPickEmbeddingModel = await input.showQuickPick({
        title,
        step: 5,
        totalSteps: 5,
        ignoreFocusOut: true,
        placeholder: `Selected embedding deployment/model (if empty, no valid models found)`,
        items: models,
        activeItem: state.quickPickEmbeddingModel,
        shouldResume: shouldResume,
      })
    } else {
      state.quickPickEmbeddingModel = undefined
    }
  }

  /**
   * This function validates whether an API key is valid or not based on its length and prefix.
   * @param name - The name of the API key to be validated.
   * @returns An error message if validation fails or undefined if validation passes.
   */
  async function validateAzureOpenaiApiKey(
    name: string
  ): Promise<string | undefined> {
    const OPENAI_APIKEY_LENGTH = 32
    // Native azure service key or oauth2 token
    return name.length >= OPENAI_APIKEY_LENGTH
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
  function cleanQuickPick(label: string) {
    return label.replace(`$(symbol-function)  `, '')
  }

  //Start openai.com configuration processes
  const state = await collectInputs()

  const inferenceModel = state.quickPickInferenceModel.description as string
  const inferenceDeploy = cleanQuickPick(state.quickPickInferenceModel.label)

  const scmModel = state.quickPickScmModel.description as string
  const scmDeploy = cleanQuickPick(state.quickPickScmModel.label)

  let embeddingModel = 'setup-required'
  let embeddingDeploy = 'setup-required'
  if (state.quickPickEmbeddingModel) {
    embeddingModel = state.quickPickEmbeddingModel.description as string
    embeddingDeploy = cleanQuickPick(state.quickPickEmbeddingModel.label)
  }

  await SecretStorageService.instance.setAuthApiKey(state.openaiApiKey)
  ConfigurationSettingService.serviceProvider = 'Azure-OpenAI'
  ConfigurationSettingService.baseUrl = state.openaiBaseUrl
  ConfigurationSettingService.defaultModel = inferenceModel
  ConfigurationSettingService.azureDeployment = inferenceDeploy
  ConfigurationSettingService.scmModel = scmModel
  ConfigurationSettingService.scmDeployment = scmDeploy
  ConfigurationSettingService.embeddingModel = embeddingModel
  ConfigurationSettingService.embeddingsDeployment = embeddingDeploy
  ConfigurationSettingService.azureApiVersion = '2023-05-15'
}

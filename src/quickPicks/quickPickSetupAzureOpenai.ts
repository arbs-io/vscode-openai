/**
 * This function runs a multistep configuration for vscode-openai
 * 	Steps:
 * 		1 - Base Url (instance.openai.azure.com/openai)
 * 		2 - ApiKey for openai.azure.com service
 * 		3 - Select availible openai model that support chat completion
 * 		Store and activate configuration
 */

import { QuickPickItem, CancellationToken, ExtensionContext, Uri } from 'vscode'
import { ConfigurationService } from '@app/services'
import {
  azureListDeployments,
  DeploymentCapabiliy,
} from '@app/utilities/openai'
import { SecretStorageService, MultiStepInput } from '@app/utilities/vscode'

/**
 * This function sets up a quick pick menu for configuring the OpenAI service provider.
 * @param context - The extension context.
 * @returns void
 */
export async function quickPickSetupAzureOpenai(
  context: ExtensionContext
): Promise<void> {
  interface State {
    title: string
    step: number
    totalSteps: number
    openaiBaseUrl: string
    openaiApiKey: string
    openaiChatCompletionModel: QuickPickItem
    openaiEmbeddingModel: QuickPickItem
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
      totalSteps: 4,
      ignoreFocusOut: true,
      value:
        typeof state.openaiBaseUrl === 'string'
          ? state.openaiBaseUrl
          : 'https://instance.openai.azure.com/openai',
      valueSelection:
        typeof state.openaiBaseUrl === 'string' ? undefined : [8, 16],
      prompt:
        'Enter you instance name. Provide the base url for example "https://instance.openai.azure.com/openai"',
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
  ) {
    state.openaiApiKey = await input.showInputBox({
      title,
      step: 2,
      totalSteps: 4,
      ignoreFocusOut: true,
      value: typeof state.openaiApiKey === 'string' ? state.openaiApiKey : '',
      prompt: 'Enter you openai.com Api-Key',
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
    const models = await getAvailableModels(
      state.openaiApiKey!,
      state.openaiBaseUrl!,
      DeploymentCapabiliy.ChatCompletion,
      undefined /* TODO: token */
    )
    // Display quick pick menu for selecting an OpenAI model and update application's state accordingly.
    // Return void since this is not used elsewhere in the code.
    state.openaiChatCompletionModel = await input.showQuickPick({
      title,
      step: 3,
      totalSteps: 4,
      ignoreFocusOut: true,
      placeholder:
        'Selected Chat Completion DeploymentModel (if empty, no valid chat completion models found)',
      items: models,
      activeItem: state.openaiChatCompletionModel,
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
    const models = await getAvailableModels(
      state.openaiApiKey!,
      state.openaiBaseUrl!,
      DeploymentCapabiliy.Embedding,
      undefined /* TODO: token */
    )
    // Display quick pick menu for selecting an OpenAI model and update application's state accordingly.
    // Return void since this is not used elsewhere in the code.
    state.openaiEmbeddingModel = await input.showQuickPick({
      title,
      step: 4,
      totalSteps: 4,
      ignoreFocusOut: true,
      placeholder:
        'Selected Embedding  DeploymentModel (if empty, no valid chat completion models found)',
      items: models,
      activeItem: state.openaiEmbeddingModel,
      shouldResume: shouldResume,
    })
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
    return name.length === OPENAI_APIKEY_LENGTH ? undefined : 'Invalid Api Key'
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
    openapiAPIKey: string,
    openapiBaseUrl: string,
    deploymentCapabiliy: DeploymentCapabiliy,
    token?: CancellationToken
  ): Promise<QuickPickItem[]> {
    const chatCompletionModels = await azureListDeployments(
      openapiAPIKey,
      openapiBaseUrl,
      deploymentCapabiliy
    )

    const quickPickItems: QuickPickItem[] = []
    chatCompletionModels?.forEach((deployment) => {
      quickPickItems.push({
        label: deployment.deployment,
        description: deployment.model,
      })
    })
    return quickPickItems
  }

  function shouldResume() {
    // Could show a notification with the option to resume.
    return new Promise<boolean>((resolve, reject) => {
      // noop
    })
  }

  //Start openai.com configuration processes
  const state = await collectInputs()
  ConfigurationService.instance.serviceProvider = 'Azure-OpenAI'
  ConfigurationService.instance.baseUrl = state.openaiBaseUrl
  ConfigurationService.instance.azureDeployment =
    state.openaiChatCompletionModel.label
  ConfigurationService.instance.defaultModel = state.openaiChatCompletionModel
    .description as string
  ConfigurationService.instance.azureEmbeddingsDeployment =
    state.openaiEmbeddingModel.label
  SecretStorageService.instance.setAuthApiKey(state.openaiApiKey)
}

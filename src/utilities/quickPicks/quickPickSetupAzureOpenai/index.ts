import { QuickPickItem, ExtensionContext, Uri } from 'vscode'
import { SettingConfig as settingCfg } from '@app/services'
import { ModelCapability } from '@app/apis/openai'
import { SecretStorageService, MultiStepInput } from '@app/apis/vscode'
import { getAvailableModelsAzure } from '../getAvailableModels'
import { IQuickPickSetupAzureOpenAI } from './IQuickPickSetupAzureOpenAI'
import { step01InputBaseUrl } from './step01InputBaseUrl'
export async function quickPickSetupAzureOpenai(
  _context: ExtensionContext
): Promise<void> {
  async function collectInputs() {
    const state = {} as Partial<IQuickPickSetupAzureOpenAI>
    state.title = 'Configure Service Provider (openai.azure.com)'
    await MultiStepInput.run((input) => step01InputBaseUrl(input, state))
    return state as IQuickPickSetupAzureOpenAI
  }

  // async function inputOpenaiBaseUrl(
  //   input: MultiStepInput,
  //   state: Partial<IQuickPickSetupAzureOpenAI>
  // ) {
  //   state.openaiBaseUrl = await input.showInputBox({
  //     title: state.title!,
  //     step: 1,
  //     totalSteps: 6,
  //     ignoreFocusOut: true,
  //     value:
  //       typeof state.openaiBaseUrl === 'string'
  //         ? state.openaiBaseUrl
  //         : 'https://instance.openai.azure.com/openai',
  //     valueSelection:
  //       typeof state.openaiBaseUrl === 'string' ? undefined : [8, 16],
  //     prompt:
  //       '$(globe)  Enter the instance name. Provide the base url for example "https://instance.openai.azure.com/openai"',
  //     placeholder: 'https://instance.openai.azure.com/openai',
  //     validate: validateOpenaiBaseUrl,
  //     shouldResume: shouldResume,
  //   })
  //   return (input: MultiStepInput) => selectAuthentication(input, state)
  // }

  async function selectAuthentication(
    input: MultiStepInput,
    state: Partial<IQuickPickSetupAzureOpenAI>
  ) {
    const getAvailableRuntimes: QuickPickItem[] = [
      {
        label: '$(github)  GitHub',
        description:
          'Use your github.com profile to sign into to vscode-openai service',
      },
      {
        label: '$(azure)  Microsoft',
        description:
          'Use microsoft profile to sign into to azure openai service',
      },
    ]
    // Display quick pick menu for selecting an OpenAI model and update application's IQuickPickSetupAzureOpenAI accordingly.
    // Return void since this is not used elsewhere in the code.
    state.authType = await input.showQuickPick({
      title: state.title!,
      step: 2,
      totalSteps: 6,
      ignoreFocusOut: true,
      placeholder: 'Selected OpenAI Model',
      items: getAvailableRuntimes,
      activeItem: state.authType,
      shouldResume: shouldResume,
    })

    return (input: MultiStepInput) => inputOpenaiApiKey(input, state)
  }

  async function inputOpenaiApiKey(
    input: MultiStepInput,
    state: Partial<IQuickPickSetupAzureOpenAI>
  ) {
    state.openaiApiKey = await input.showInputBox({
      title: state.title!,
      step: 3,
      totalSteps: 6,
      ignoreFocusOut: true,
      value: typeof state.openaiApiKey === 'string' ? state.openaiApiKey : '',
      prompt: '$(key)  Enter the openai.com Api-Key',
      placeholder: 'ed4af062d8567543ad104587ea4505ce',
      validate: validateAzureOpenaiApiKey,
      shouldResume: shouldResume,
    })
    return (input: MultiStepInput) => selectChatCompletionModel(input, state)
  }

  async function selectChatCompletionModel(
    input: MultiStepInput,
    state: Partial<IQuickPickSetupAzureOpenAI>
  ) {
    const models = await getAvailableModelsAzure(
      state.openaiApiKey!,
      state.openaiBaseUrl!,
      ModelCapability.ChatCompletion
    )
    // Display quick pick menu for selecting an OpenAI model and update application's IQuickPickSetupAzureOpenAI accordingly.
    // Return void since this is not used elsewhere in the code.
    state.quickPickInferenceModel = await input.showQuickPick({
      title: state.title!,
      step: 4,
      totalSteps: 6,
      ignoreFocusOut: true,
      placeholder:
        'Selected chat completion deployment/model (if empty, no valid models found)',
      items: models,
      activeItem: state.quickPickInferenceModel,
      shouldResume: shouldResume,
    })

    return (input: MultiStepInput) => selectScmModel(input, state)
  }

  async function selectScmModel(
    input: MultiStepInput,
    state: Partial<IQuickPickSetupAzureOpenAI>
  ) {
    const models = await getAvailableModelsAzure(
      state.openaiApiKey!,
      state.openaiBaseUrl!,
      ModelCapability.ChatCompletion
    )
    // Display quick pick menu for selecting an OpenAI model and update application's IQuickPickSetupAzureOpenAI accordingly.
    // Return void since this is not used elsewhere in the code.
    state.quickPickScmModel = await input.showQuickPick({
      title: state.title!,
      step: 5,
      totalSteps: 6,
      ignoreFocusOut: true,
      placeholder:
        'Selected SCM (git) deployment/model (if empty, no valid models found)',
      items: models,
      activeItem: state.quickPickInferenceModel,
      shouldResume: shouldResume,
    })

    return (input: MultiStepInput) => selectEmbeddingModel(input, state)
  }

  async function selectEmbeddingModel(
    input: MultiStepInput,
    state: Partial<IQuickPickSetupAzureOpenAI>
  ) {
    const models = await getAvailableModelsAzure(
      state.openaiApiKey!,
      state.openaiBaseUrl!,
      ModelCapability.Embedding
    )

    if (models.length > 0) {
      // Display quick pick menu for selecting an OpenAI model and update application's IQuickPickSetupAzureOpenAI accordingly.
      // Return void since this is not used elsewhere in the code.
      state.quickPickEmbeddingModel = await input.showQuickPick({
        title: state.title!,
        step: 6,
        totalSteps: 6,
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

  async function validateAzureOpenaiApiKey(
    name: string
  ): Promise<string | undefined> {
    const OPENAI_APIKEY_LENGTH = 32
    // Native azure service key or oauth2 token
    return name.length >= OPENAI_APIKEY_LENGTH
      ? undefined
      : 'Invalid Api-Key or Token'
  }

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
  settingCfg.serviceProvider = 'Azure-OpenAI'
  settingCfg.baseUrl = state.openaiBaseUrl
  settingCfg.defaultModel = inferenceModel
  settingCfg.azureDeployment = inferenceDeploy
  settingCfg.scmModel = scmModel
  settingCfg.scmDeployment = scmDeploy
  settingCfg.embeddingModel = embeddingModel
  settingCfg.embeddingsDeployment = embeddingDeploy
  settingCfg.azureApiVersion = '2024-02-01'
}

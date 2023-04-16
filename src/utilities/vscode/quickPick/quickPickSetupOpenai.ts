
import {
  QuickPickItem,
  window,
  CancellationToken,
  ExtensionContext,
  Uri,
} from 'vscode'
import { MultiStepInput } from '../multiStepInput/multiStepInput'
import { apiListModelsOpenai } from '../../openai'

/**
 * This function sets up a quick pick menu for configuring the OpenAI service provider.
 * @param context - The extension context.
 * @returns void
 */
export async function quickPickSetupOpenai(context: ExtensionContext): Promise<void> {

  interface State {
    title: string
    step: number
    totalSteps: number
    openaiApiKey: string
    openaiModel: QuickPickItem
  }

  async function collectInputs() {
    const state = {} as Partial<State>
    await MultiStepInput.run((input) => inputOpenaiApiKey(input, state))
    return state as State
  }

  const title = 'Configure Service Provider (openai.com)'

  async function inputOpenaiApiKey(
    input: MultiStepInput,
    state: Partial<State>
  ) {
    state.openaiApiKey = await input.showInputBox({
      title,
      step: 1,
      totalSteps: 2,
      value: typeof state.openaiApiKey === 'string' ? state.openaiApiKey : '',
      prompt: 'Enter you openai.com Api-Key',
      placeholder: 'sk-8i6055nAY3eAwARfHFjiT5BlbkFJAEFUvG5GwtAV2RiwP87h',
      validate: validateOpenaiApiKey,
      shouldResume: shouldResume,
    })
    return (input: MultiStepInput) => pickRuntime(input, state)
  }

  async function pickRuntime(input: MultiStepInput, state: Partial<State>) {
    const models = await getAvailableModels(
      state.openaiApiKey!,
      undefined /* TODO: token */
    )
    // TODO: Remember currently active item when navigating back.
    state.openaiModel = await input.showQuickPick({
      title,
      step: 2,
      totalSteps: 2,
      placeholder: 'Selected OpenAI Model',
      items: models,
      activeItem: state.openaiModel,
      shouldResume: shouldResume,
    })
  }

  function shouldResume() {
    // Could show a notification with the option to resume.
    return new Promise<boolean>((resolve, reject) => {
      // noop
    })
  }

  async function validateOpenaiApiKey(name: string) {
    const OPENAI_APIKEY_LENGTH = 51
    const OPENAI_APIKEY_STARTSWITH = 'sk-'

    return name.length === OPENAI_APIKEY_LENGTH &&
      name.startsWith(OPENAI_APIKEY_STARTSWITH)
      ? undefined
      : 'Invalid Api Key'
  }

  async function getAvailableModels(
    openaiApiKey: string,
    token?: CancellationToken
  ): Promise<QuickPickItem[]> {
    const chatCompletionModels = await apiListModelsOpenai(openaiApiKey)
    return chatCompletionModels.map((label) => ({ label }))
  }

  const state = await collectInputs()
  window.showInformationMessage(
    `Creating Application Service ${state.openaiApiKey} - ${state.openaiModel.label}`
  )
}

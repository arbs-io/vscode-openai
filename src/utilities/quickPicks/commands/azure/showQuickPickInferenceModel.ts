import { MultiStepInput } from '@app/apis/vscode'
import { ModelCapability } from '@app/apis/openai'
import { getAvailableModelsAzure } from '../../getAvailableModels'
import { IQuickPickSetup } from '../../interface'
import { shouldResume } from '../shouldResume'

export async function showQuickPickInferenceModel(
  input: MultiStepInput,
  state: Partial<IQuickPickSetup>
): Promise<void> {
  state.step = (state.step ?? 0) + 1
  const models = await getAvailableModelsAzure(
    state.authApiKey!,
    state.baseUrl!,
    ModelCapability.ChatCompletion
  )
  state.modelInference = await input.showQuickPick({
    title: state.title!,
    step: state.step,
    totalSteps: state.totalSteps!,
    ignoreFocusOut: true,
    placeholder:
      'Selected chat completion deployment/model (if empty, no valid models found)',
    items: models,
    activeItem: state.modelInference,
    shouldResume: shouldResume,
  })
}

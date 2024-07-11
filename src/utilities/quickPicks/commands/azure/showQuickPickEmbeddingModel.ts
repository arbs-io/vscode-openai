import { ModelCapability } from '@app/apis/openai'
import { MultiStepInput } from '@app/apis/vscode'
import { getAvailableModelsAzure } from '../../getAvailableModels'
import { IQuickPickSetup } from '../../interface'
import { shouldResume } from '../shouldResume'

export async function showQuickPickEmbeddingModel(
  input: MultiStepInput,
  state: Partial<IQuickPickSetup>
): Promise<void> {
  const models = await getAvailableModelsAzure(
    state.authApiKey!,
    state.baseUrl!,
    ModelCapability.Embedding
  )

  if (models.length > 0) {
    state.modelEmbedding = await input.showQuickPick({
      title: state.title!,
      step: state.step! + 1,
      totalSteps: state.totalSteps!,
      ignoreFocusOut: true,
      placeholder: `Selected embedding deployment/model (if empty, no valid models found)`,
      items: models,
      activeItem: state.modelEmbedding,
      shouldResume: shouldResume,
    })
  } else {
    state.modelEmbedding = undefined
  }
}

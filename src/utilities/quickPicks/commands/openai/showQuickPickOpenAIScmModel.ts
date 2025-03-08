import { MultiStepInput } from '@app/apis/vscode';
import { ModelCapability } from '@app/apis/openai';
import { getAvailableModelsOpenai } from '../../getAvailableModels';
import { IQuickPickSetup } from '../../interface';
import { shouldResume } from '../shouldResume';

export async function showQuickPickOpenAIScmModel(
  input: MultiStepInput,
  state: Partial<IQuickPickSetup>
): Promise<void> {
  state.step = (state.step ?? 0) + 1;
  const models = await getAvailableModelsOpenai(
    state.authApiKey!,
    state.baseUrl!,
    ModelCapability.ChatCompletion
  );
  state.modelScm = await input.showQuickPick({
    title: state.title!,
    step: state.step,
    totalSteps: state.totalSteps!,
    ignoreFocusOut: true,
    placeholder: 'Selected SCM (git) model (if empty, no valid models found)',
    items: models,
    activeItem: state.modelScm,
    shouldResume: shouldResume,
  });
}

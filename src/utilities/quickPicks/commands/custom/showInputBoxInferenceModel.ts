import { MultiStepInput } from '@app/apis/vscode'
import { IQuickPickSetup } from '../../interface'
import { shouldResume } from '../shouldResume'
import { validateIgnored } from '..'

export async function showInputBoxInferenceModel(
  input: MultiStepInput,
  state: Partial<IQuickPickSetup>
) {
  state.modelInferenceCustom = await input.showInputBox({
    title: state.title!,
    step: state.step! + 1,
    totalSteps: state.totalSteps!,
    ignoreFocusOut: true,
    value:
      typeof state.modelInferenceCustom === 'string'
        ? state.modelInferenceCustom
        : '',
    prompt: `$(symbol-function)  Enter the model name`,
    placeholder: ' Llama-2-70B',
    validate: validateIgnored,
    shouldResume: shouldResume,
  })
}

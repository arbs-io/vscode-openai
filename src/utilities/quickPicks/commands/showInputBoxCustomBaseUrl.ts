import { MultiStepInput } from '@app/apis/vscode'
import { IQuickPickSetup } from '../interface'
import { shouldResume } from './shouldResume'
import { validateUrl } from './validateUrl'
export async function showInputBoxCustomBaseUrl(
  input: MultiStepInput,
  state: Partial<IQuickPickSetup>
): Promise<void> {
  state.baseUrl = await input.showInputBox({
    title: state.title!,
    step: state.step! + 1,
    totalSteps: state.totalSteps!,
    ignoreFocusOut: true,
    value: typeof state.baseUrl === 'string' ? state.baseUrl : '',
    prompt:
      '$(globe)  Enter the instance name. Provide the base url default https://localhost/v1"',
    placeholder: 'https://localhost/v1',
    validate: validateUrl,
    shouldResume: shouldResume,
  })
}

import { MultiStepInput } from '@app/apis/vscode'
import { IQuickPickSetup } from '../interface'
import { shouldResume } from './shouldResume'
import { validateUrl } from './validateUrl'
export async function showInputBoxAzureBaseUrl(
  input: MultiStepInput,
  state: Partial<IQuickPickSetup>
): Promise<void> {
  state.baseUrl = await input.showInputBox({
    title: state.title!,
    step: state.step! + 1,
    totalSteps: state.totalSteps!,
    ignoreFocusOut: true,
    value:
      typeof state.baseUrl === 'string'
        ? state.baseUrl
        : 'https://instance.openai.azure.com/openai',
    valueSelection: typeof state.baseUrl === 'string' ? undefined : [8, 16],
    prompt:
      '$(globe)  Enter the instance name. Provide the base url for example "https://instance.openai.azure.com/openai"',
    placeholder: 'https://instance.openai.azure.com/openai',
    validate: validateUrl,
    shouldResume: shouldResume,
  })
}

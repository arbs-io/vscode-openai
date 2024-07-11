import { MultiStepInput } from '@app/apis/vscode'
import { IQuickPickSetup } from '../interface'
import { shouldResume } from './shouldResume'
import { validateAzureApiKey } from './validateAzureApiKey'

export async function showInputBoxAzureApiKey(
  input: MultiStepInput,
  state: Partial<IQuickPickSetup>
): Promise<void> {
  state.authApiKey = await input.showInputBox({
    title: state.title!,
    step: state.step! + 1,
    totalSteps: state.totalSteps!,
    ignoreFocusOut: true,
    value: typeof state.authApiKey === 'string' ? state.authApiKey : '',
    prompt: '$(key)  Enter your Api-Key',
    placeholder: 'ed4af062d8567543ad104587ea4505ce',
    validate: validateAzureApiKey,
    shouldResume: shouldResume,
  })
}

import { getAzureOpenAIAccessToken, MultiStepInput } from '@app/apis/vscode'
import { IQuickPickSetup } from '../../interface'
import { shouldResume } from '../shouldResume'

export async function showInputBoxApiKey(
  input: MultiStepInput,
  state: Partial<IQuickPickSetup>
): Promise<void> {
  state.step = (state.step ?? 0) + 1
  if (state.authenticationType?.label === '$(azure)  Microsoft') {
    const accessToken = await getAzureOpenAIAccessToken()
    state.authApiKey = `Bearer ${accessToken}`
  } else {
    state.authApiKey = await input.showInputBox({
      title: state.title!,
      step: state.step!,
      totalSteps: state.totalSteps!,
      ignoreFocusOut: true,
      value: typeof state.authApiKey === 'string' ? state.authApiKey : '',
      prompt: '$(key)  Enter your Api-Key',
      placeholder: 'ed4af062d8567543ad104587ea4505ce',
      validate: validateApiKey,
      shouldResume: shouldResume,
    })
  }
}

async function validateApiKey(name: string): Promise<string | undefined> {
  const OPENAI_APIKEY_LENGTH = 32
  // Native azure service key or oauth2 token
  return name.length >= OPENAI_APIKEY_LENGTH
    ? undefined
    : 'Invalid Api-Key or Token'
}

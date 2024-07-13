import { MultiStepInput } from '@app/apis/vscode'
import { IQuickPickSetup } from '../../interface'
import { shouldResume } from '../shouldResume'

export async function showInputBoxOpenAIApiKey(
  input: MultiStepInput,
  state: Partial<IQuickPickSetup>
): Promise<void> {
  state.step = (state.step ?? 0) + 1
  state.authApiKey = await input.showInputBox({
    title: state.title!,
    step: state.step,
    totalSteps: state.totalSteps!,
    ignoreFocusOut: true,
    value: typeof state.authApiKey === 'string' ? state.authApiKey : '',
    prompt: `$(key)  Enter the openai.com Api-Key`,
    placeholder: 'sk-8i6055nAY3eAwARfHFjiT5BlbkFJAEFUvG5GwtAV2RiwP87h',
    validate: validateApiKey,
    shouldResume: shouldResume,
  })
}

async function validateApiKey(name: string): Promise<string | undefined> {
  const OPENAI_APIKEY_MIN_LENGTH = 1
  const OPENAI_APIKEY_STARTSWITH = 'sk-'
  const OPENAI_OAUTH2_BEARER_STARTSWITH = 'Bearer'
  const OPENAI_OAUTH2_TOKEN_STARTSWITH = 'ey'

  // Native openai service key or oauth2 token
  return name.length >= OPENAI_APIKEY_MIN_LENGTH &&
    (name.startsWith(OPENAI_APIKEY_STARTSWITH) ||
      name.startsWith(OPENAI_OAUTH2_BEARER_STARTSWITH) ||
      name.startsWith(OPENAI_OAUTH2_TOKEN_STARTSWITH))
    ? undefined
    : 'Invalid Api-Key or Token'
}

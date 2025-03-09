import { getAzureOpenAIAccessToken, getAzureOpenAIAccessTokenSovereignUs, MultiStepInput } from '@app/apis/vscode';
import { IQuickPickSetup } from '../../interface';
import { shouldResume } from '../shouldResume';

export async function showInputBoxAzureApiKey(
  input: MultiStepInput,
  state: Partial<IQuickPickSetup>
): Promise<void> {
  state.step = (state.step ?? 0) + 1;

  switch (state.authenticationMethod?.label) {
    case '$(azure)  Microsoft': {
      const accessToken = await getAzureOpenAIAccessToken();
      state.authApiKey = `Bearer ${accessToken}`;
      break;
    }
    case '$(azure)  Microsoft Sovereign (US)': {
      const accessToken = await getAzureOpenAIAccessTokenSovereignUs();
      state.authApiKey = `Bearer ${accessToken}`;
      break;
    }
    case '$(key)  Enter your Api-Key':
    default: {
      state.authApiKey = await input.showInputBox({
        title: state.title!,
        step: state.step,
        totalSteps: state.totalSteps!,
        ignoreFocusOut: true,
        value: typeof state.authApiKey === 'string' ? state.authApiKey : '',
        prompt: '$(key)  Enter your Api-Key',
        placeholder: 'ed4af062d8567543ad104587ea4505ce',
        validate: validateApiKey,
        shouldResume: shouldResume,
      });
      break;
    }
  }
}

async function validateApiKey(name: string): Promise<string | undefined> {
  const OPENAI_APIKEY_LENGTH = 32;
  // Native azure service key or oauth2 token
  return name.length >= OPENAI_APIKEY_LENGTH
    ? undefined
    : 'Invalid Api-Key or Token';
}

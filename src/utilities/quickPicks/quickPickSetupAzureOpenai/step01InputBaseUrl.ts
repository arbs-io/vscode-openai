import { MultiStepInput } from '@app/apis/vscode'
import { IQuickPickSetupAzureOpenAI } from './IQuickPickSetupAzureOpenAI'
export async function step01InputBaseUrl(
  input: MultiStepInput,
  state: Partial<IQuickPickSetupAzureOpenAI>
) {
  state.openaiBaseUrl = await input.showInputBox({
    title: state.title!,
    step: 1,
    totalSteps: 6,
    ignoreFocusOut: true,
    value:
      typeof state.openaiBaseUrl === 'string'
        ? state.openaiBaseUrl
        : 'https://instance.openai.azure.com/openai',
    valueSelection:
      typeof state.openaiBaseUrl === 'string' ? undefined : [8, 16],
    prompt:
      '$(globe)  Enter the instance name. Provide the base url for example "https://instance.openai.azure.com/openai"',
    placeholder: 'https://instance.openai.azure.com/openai',
    validate: validateOpenaiBaseUrl,
    shouldResume: shouldResume,
  })
  return (input: MultiStepInput) => selectAuthentication(input, state)
}

async function validateOpenaiBaseUrl(
  baseUrl: string
): Promise<string | undefined> {
  return Uri.parse(baseUrl) ? undefined : 'Invalid Uri'
}
function shouldResume() {
  // Could show a notification with the option to resume.
  return new Promise<boolean>((_resolve, _reject) => {
    /* noop */
  })
}

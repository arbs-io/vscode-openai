import { QuickPickItem } from 'vscode'
import { MultiStepInput } from '@app/apis/vscode'
import { IQuickPickSetupAzureOpenAI } from './IQuickPickSetupAzureOpenAI'
export async function selectAuthentication(
  input: MultiStepInput,
  state: Partial<IQuickPickSetupAzureOpenAI>
) {
  const getAvailableRuntimes: QuickPickItem[] = [
    {
      label: '$(github)  GitHub',
      description:
        'Use your github.com profile to sign into to vscode-openai service',
    },
    {
      label: '$(azure)  Microsoft',
      description: 'Use microsoft profile to sign into to azure openai service',
    },
  ]
  // Display quick pick menu for selecting an OpenAI model and update application's IQuickPickSetupAzureOpenAI accordingly.
  // Return void since this is not used elsewhere in the code.
  state.authType = await input.showQuickPick({
    title: state.title!,
    step: 2,
    totalSteps: 6,
    ignoreFocusOut: true,
    placeholder: 'Selected OpenAI Model',
    items: getAvailableRuntimes,
    activeItem: state.authType,
    shouldResume: shouldResume,
  })

  return (input: MultiStepInput) => inputOpenaiApiKey(input, state)
}
function shouldResume() {
  // Could show a notification with the option to resume.
  return new Promise<boolean>((_resolve, _reject) => {
    /* noop */
  })
}

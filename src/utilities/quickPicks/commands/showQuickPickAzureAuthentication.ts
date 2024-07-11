import { QuickPickItem } from 'vscode'
import { MultiStepInput } from '@app/apis/vscode'
import { IQuickPickSetup } from '../interface'
import { shouldResume } from './shouldResume'

export async function showQuickPickAzureAuthentication(
  input: MultiStepInput,
  state: Partial<IQuickPickSetup>
): Promise<void> {
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

  state.authenticationType = await input.showQuickPick({
    title: state.title!,
    step: state.step! + 1,
    totalSteps: state.totalSteps!,
    ignoreFocusOut: true,
    placeholder: 'Selected OpenAI Model',
    items: getAvailableRuntimes,
    activeItem: state.authenticationType,
    shouldResume: shouldResume,
  })
}

import { QuickPickItem } from 'vscode'
import { MultiStepInput } from '@app/apis/vscode'
import { IQuickPickSetup } from '../../interface'
import { shouldResume } from '../shouldResume'

export async function showQuickPickAuthentication(
  input: MultiStepInput,
  state: Partial<IQuickPickSetup>
): Promise<void> {
  state.step = (state.step ?? 0) + 1
  const getAvailableRuntimes: QuickPickItem[] = [
    {
      label: '$(key)  Enter your Api-Key',
      description: 'Use your openai.azure.com API key',
    },
    {
      label: '$(azure)  Microsoft',
      description: 'Use microsoft profile to sign into to azure openai service',
    },
  ]

  state.authenticationType = await input.showQuickPick({
    title: state.title!,
    step: state.step,
    totalSteps: state.totalSteps!,
    ignoreFocusOut: true,
    placeholder: 'Selected OpenAI Model',
    items: getAvailableRuntimes,
    activeItem: state.authenticationType,
    shouldResume: shouldResume,
  })
}

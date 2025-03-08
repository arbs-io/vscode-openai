import { QuickPickItem } from 'vscode';
import { MultiStepInput } from '@app/apis/vscode';
import { IQuickPickSetup } from '../../interface';
import { shouldResume } from '../shouldResume';

export async function showQuickPickVscodeAuthentication(
  input: MultiStepInput,
  state: Partial<IQuickPickSetup>
): Promise<void> {
  state.step = (state.step ?? 0) + 1;
  const getAvailableRuntimes: QuickPickItem[] = [
    {
      label: '$(github)  GitHub',
      description:
        'Use your github.com profile to sign into to vscode-openai service',
    },
  ];

  state.authenticationType = await input.showQuickPick({
    title: state.title!,
    step: state.step,
    totalSteps: state.totalSteps!,
    ignoreFocusOut: true,
    placeholder: 'Selected OpenAI Model',
    items: getAvailableRuntimes,
    activeItem: state.authenticationType,
    shouldResume: shouldResume,
  });
}

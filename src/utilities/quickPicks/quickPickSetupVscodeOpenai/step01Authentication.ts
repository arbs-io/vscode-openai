import { QuickPickItem, ExtensionContext } from 'vscode'
import {
  MultiStepInput,
  SecretStorageService,
  getGitAccessToken,
} from '@app/apis/vscode'
import { SettingConfig as settingCfg } from '@app/services'
import { IQuickPickSetupVscodeOpenai } from './IQuickPickSetupVscodeOpenai'
import { getApiKey } from './getApiKey'

export async function step01Authentication(
  input: MultiStepInput,
  state: Partial<IQuickPickSetupVscodeOpenai>
): Promise<void> {
  const getAvailableRuntimes: QuickPickItem[] = [
    {
      label: '$(github)  GitHub',
      description:
        'Use your github.com profile to sign into to vscode-openai service',
    },
  ]

  // Display quick pick menu for selecting an OpenAI model and update application's state accordingly.
  // Return void since this is not used elsewhere in the code.
  state.authType = await input.showQuickPick({
    title: state.title!,
    step: 1,
    totalSteps: 1,
    ignoreFocusOut: true,
    placeholder: 'Selected OpenAI Model',
    items: getAvailableRuntimes,
    activeItem: state.authType,
    shouldResume: shouldResume,
  })
}

function shouldResume() {
  // Could show a notification with the option to resume.
  return new Promise<boolean>((_resolve, _reject) => {
    // noop
  })
}

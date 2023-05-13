/**
 * This function runs a multistep configuration for vscode-openai
 * 	Steps:
 * 		1 - Select the authentication type
 * 		Store and activate configuration
 */

import { QuickPickItem, ExtensionContext } from 'vscode'
import { MultiStepInput, getGitAccessToken } from '@app/utilities/vscode'
import { ConfigurationService } from '@app/services'
import { createInfoNotification } from '@app/utilities/node'

/**
 * This function sets up a quick pick menu for configuring the OpenAI service provider.
 * @param context - The extension context.
 * @returns void
 */
export async function quickPickSetupVscodeOpenai(
  context: ExtensionContext
): Promise<void> {
  interface State {
    title: string
    step: number
    totalSteps: number
    authType: QuickPickItem
  }

  async function collectInputs() {
    const state = {} as Partial<State>
    await MultiStepInput.run((input) => selectAuthentication(input, state))
    return state as State
  }

  const title = 'Configure Service Provider (vscode-openai)'

  /**
   * This function displays a quick pick menu for selecting an OpenAI model and updates the application's state accordingly.
   * @param input - The multi-step input object.
   * @param state - The current state of the application.
   */
  async function selectAuthentication(
    input: MultiStepInput,
    state: Partial<State>
  ): Promise<void> {
    const models = await getAvailableRuntimes()
    // Display quick pick menu for selecting an OpenAI model and update application's state accordingly.
    // Return void since this is not used elsewhere in the code.
    state.authType = await input.showQuickPick({
      title,
      step: 1,
      totalSteps: 1,
      ignoreFocusOut: true,
      placeholder: 'Selected OpenAI Model',
      items: models,
      activeItem: state.authType,
      shouldResume: shouldResume,
    })
  }

  function getAvailableRuntimes(): QuickPickItem[] {
    const quickPickItemTypes: QuickPickItem[] = [
      {
        label: 'GitHub',
        description:
          'Use your github.com profile to sign into to vscode-openai service',
      },
      // {
      //   label: 'Microsoft',
      //   description:
      //     'Use microsoft profile to sign into to vscode-openai service',
      // },
    ]
    return quickPickItemTypes
  }

  function shouldResume() {
    // Could show a notification with the option to resume.
    return new Promise<boolean>((resolve, reject) => {
      // noop
    })
  }

  //Start openai.com configuration processes
  await collectInputs()
  const accessToken = await getGitAccessToken()
  if (accessToken) {
    ConfigurationService.instance.serviceProvider = 'VSCode-OpenAI'
    createInfoNotification(`ServiceProvider (VSCode-OpenAI)`)
  }
}

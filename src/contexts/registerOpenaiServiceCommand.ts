import { commands, ExtensionContext, QuickPickItem, window } from 'vscode'
import { VSCODE_OPENAI_REGISTER } from '@app/contexts'
import {
  quickPickSetupAzureOpenai,
  quickPickSetupOpenai,
  quickPickSetupVscodeOpenai,
} from '@app/utilities/vscode'

export function registerOpenaiServiceCommand(context: ExtensionContext) {
  _registerOpenaiServiceCommand(context)
}

function _registerOpenaiServiceCommand(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand(
      VSCODE_OPENAI_REGISTER.SERVICE_COMMAND_ID,
      async () => {
        const openAiServiceType = BuildOpenAiServiceTypes()

        const quickPick = window.createQuickPick()
        quickPick.items = openAiServiceType
        quickPick.onDidChangeSelection((selection) => {
          if (selection[0]) {
            switch (selection[0].label) {
              case 'vscode-openai':
                quickPickSetupVscodeOpenai(context)
                break

              case 'openai.com':
                quickPickSetupOpenai(context)
                break

              case 'openai.azure.com':
                quickPickSetupAzureOpenai(context)
                break

              default:
                break
            }
          }
        })
        quickPick.onDidHide(() => quickPick.dispose())
        quickPick.title = 'Register OpenAI Service Provider'
        quickPick.show()
      }
    )
  )
}

function BuildOpenAiServiceTypes(): QuickPickItem[] {
  const quickPickItemTypes: QuickPickItem[] = [
    {
      label: 'vscode-openai',
      description: '(Sponsored) Use vscode-openai service',
    },
    {
      label: 'openai.com',
      description:
        '(BYOK) Use your own Azure OpenAI instance (instance.openai.azure.com)',
    },
    {
      label: 'openai.azure.com',
      description: '(BYOK) Use your own OpenAI subscription (api.openai.com)',
    },
  ]
  return quickPickItemTypes
}

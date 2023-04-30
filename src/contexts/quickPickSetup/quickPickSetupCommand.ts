import { commands, ExtensionContext, QuickPickItem, window } from 'vscode'
import { VSCODE_OPENAI_REGISTER } from '@app/contexts'
import {
  quickPickSetupAzureOpenai,
  quickPickSetupOpenai,
  quickPickSetupVscodeOpenai,
} from '@app/utilities/vscode'

export class QuickPickSetupCommand {
  private static instance: QuickPickSetupCommand

  public static getInstance(): QuickPickSetupCommand {
    if (!QuickPickSetupCommand.instance) {
      QuickPickSetupCommand.instance = new QuickPickSetupCommand()
    }
    return QuickPickSetupCommand.instance
  }

  public async execute(context: ExtensionContext): Promise<void> {
    const openAiServiceType = BuildOpenAiServiceTypes()
    const selectedProvider = await this.showQuickPick(openAiServiceType)

    switch (selectedProvider.label) {
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

  // Concurrency pattern: Observer
  private async showQuickPick(items: QuickPickItem[]): Promise<QuickPickItem> {
    return new Promise((resolve) => {
      const quickPick = window.createQuickPick()
      quickPick.items = items
      quickPick.onDidChangeSelection((selection) => {
        if (selection[0]) {
          resolve(selection[0])
          quickPick.dispose()
        }
      })
      quickPick.onDidHide(() => quickPick.dispose())
      quickPick.title = 'Register OpenAI Service Provider'
      quickPick.show()
    })
  }
}

function BuildOpenAiServiceTypes(): QuickPickItem[] {
  const quickPickItemTypes: QuickPickItem[] = [
    {
      label: 'vscode-openai',
      description: '(Sponsored) Use vscode-openai service',
    },
    {
      label: 'openai.com',
      description: '(BYOK) Use your own OpenAI subscription (api.openai.com)',
    },
    {
      label: 'openai.azure.com',
      description:
        '(BYOK) Use your own Azure OpenAI instance (instance.openai.azure.com)',
    },
  ]

  return [...quickPickItemTypes]
}

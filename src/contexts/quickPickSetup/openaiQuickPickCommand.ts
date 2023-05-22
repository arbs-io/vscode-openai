import { ExtensionContext, QuickPickItem, window } from 'vscode'
import {
  quickPickSetupAzureOpenai,
  quickPickSetupOpenai,
  quickPickSetupVscodeOpenai,
} from '@app/quickPick'
import { ICommandOpenai } from '@app/interfaces'

export class OpenaiQuickPickCommand implements ICommandOpenai {
  private static instance: OpenaiQuickPickCommand
  private context: ExtensionContext

  constructor(context: ExtensionContext) {
    this.context = context
  }

  public static getInstance(context: ExtensionContext): OpenaiQuickPickCommand {
    if (!OpenaiQuickPickCommand.instance) {
      OpenaiQuickPickCommand.instance = new OpenaiQuickPickCommand(context)
    }
    return OpenaiQuickPickCommand.instance
  }

  public async execute(): Promise<void> {
    const openAiServiceType = BuildOpenAiServiceTypes()
    const selectedProvider = await this.showQuickPick(openAiServiceType)

    switch (selectedProvider.label) {
      case 'vscode-openai':
        quickPickSetupVscodeOpenai(this.context)
        break

      case 'openai.com':
        quickPickSetupOpenai(this.context)
        break

      case 'openai.azure.com':
        quickPickSetupAzureOpenai(this.context)
        break

      default:
        break
    }
  }

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

import { commands, ExtensionContext, QuickPickItem, window } from 'vscode'
import { VSCODE_OPENAI_REGISTER } from './constants'
import {
  quickPickOpenAI,
  quickPickAzure,
  quickPickSetupOpenai,
} from '../utilities/vscode'

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
                quickPickOpenAI()
                break

              case 'openai.com':
                quickPickSetupOpenai(context)
                break

              case 'openai.azure.com':
                quickPickAzure(context)
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

class OpenAiServiceType implements QuickPickItem {
  constructor(
    public label: string,
    public description: string,
    public detail: string | undefined
  ) {}
}

function BuildOpenAiServiceTypes(): OpenAiServiceType[] {
  const openAiServiceType: OpenAiServiceType[] = []
  openAiServiceType.push(
    new OpenAiServiceType(
      'vscode-openai',
      '(free) Use vscode-openai openai instance',
      undefined
    )
  )
  openAiServiceType.push(
    new OpenAiServiceType(
      'openai.com',
      '(BYOK) Use Azure OpenAI service (instance.openai.azure.com)',
      undefined
    )
  )
  openAiServiceType.push(
    new OpenAiServiceType(
      'openai.azure.com',
      '(BYOK) Use OpenAI native service (api.openai.com)',
      undefined
    )
  )
  return openAiServiceType
}

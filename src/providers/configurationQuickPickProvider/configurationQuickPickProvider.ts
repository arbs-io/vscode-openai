import {
  ExtensionContext,
  QuickPickItem,
  QuickPickItemKind,
  ThemeIcon,
  window,
} from 'vscode'
import {
  quickPickChangeModel,
  quickPickSetupAzureOpenai,
  quickPickSetupOpenai,
  quickPickSetupVscodeOpenai,
  quickPickSetupCustomOpenai,
} from '@app/utilities/quickPicks'
import { VSCODE_OPENAI_EXTENSION, VSCODE_OPENAI_QP_SETUP } from '@app/constants'
import { getFeatureFlag } from '@app/apis/vscode'
import { SettingConfig as settingCfg } from '@app/services'

export class ConfigurationQuickPickProvider {
  private static instance: ConfigurationQuickPickProvider
  private context: ExtensionContext

  constructor(context: ExtensionContext) {
    this.context = context
  }

  public static getInstance(
    context: ExtensionContext
  ): ConfigurationQuickPickProvider {
    if (!ConfigurationQuickPickProvider.instance) {
      ConfigurationQuickPickProvider.instance =
        new ConfigurationQuickPickProvider(context)
    }
    return ConfigurationQuickPickProvider.instance
  }

  public async execute(): Promise<void> {
    const quickPickItems = BuildQuickPickItems()
    const selectedProvider = await this.showQuickPick(quickPickItems)

    switch (selectedProvider.label) {
      case VSCODE_OPENAI_QP_SETUP.PROVIDER_VSCODE:
        quickPickSetupVscodeOpenai(this.context)
        break

      case VSCODE_OPENAI_QP_SETUP.PROVIDER_OPENAI:
        quickPickSetupOpenai(this.context)
        break

      case VSCODE_OPENAI_QP_SETUP.PROVIDER_AZURE:
        await quickPickSetupAzureOpenai(this.context)
        break

      case VSCODE_OPENAI_QP_SETUP.PROVIDER_CUSTOM:
        await quickPickSetupCustomOpenai(this.context)
        break

      case VSCODE_OPENAI_QP_SETUP.MODEL_CHANGE:
        await quickPickChangeModel(this.context)
        break

      case VSCODE_OPENAI_QP_SETUP.CONFIGURATION_RESET: {
        await window
          .showInformationMessage(
            'Are you sure you want to RESET configuration?',
            'Yes',
            'No'
          )
          .then((answer) => {
            if (answer === 'Yes') {
              settingCfg.ResetConfigValue()
            }
          })
        break
      }

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

function BuildQuickPickItems(): QuickPickItem[] {
  const quickPickServiceProviders = BuildQuickPickServiceProviders()
  const quickPickModelSelection = BuildQuickPickModelSelection()
  const quickPickConfiguration = BuildQuickPickConfiguration()

  return [
    ...quickPickServiceProviders,
    ...quickPickModelSelection,
    ...quickPickConfiguration,
  ]
}

function BuildQuickPickModelSelection(): QuickPickItem[] {
  const isValidKey = getFeatureFlag(VSCODE_OPENAI_EXTENSION.ENABLED_COMMAND_ID)
  const validSP: string[] = ['OpenAI', 'Azure-OpenAI']
  const allowed = validSP.includes(settingCfg.serviceProvider)
  let quickPickItemTypes: QuickPickItem[] = []
  if (isValidKey && allowed) {
    quickPickItemTypes = [
      {
        label: 'Models',
        kind: QuickPickItemKind.Separator,
      },
      {
        label: VSCODE_OPENAI_QP_SETUP.MODEL_CHANGE,
        iconPath: new ThemeIcon(VSCODE_OPENAI_QP_SETUP.MODEL_CHANGE_ICON),
        description: VSCODE_OPENAI_QP_SETUP.MODEL_CHANGE_DESC,
        alwaysShow: false,
      },
    ]
  }
  return quickPickItemTypes
}

function BuildQuickPickServiceProviders(): QuickPickItem[] {
  const quickPickItemTypes: QuickPickItem[] = [
    {
      label: 'Service Provider',
      kind: QuickPickItemKind.Separator,
    },
    {
      label: VSCODE_OPENAI_QP_SETUP.PROVIDER_VSCODE,
      iconPath: new ThemeIcon(VSCODE_OPENAI_QP_SETUP.PROVIDER_VSCODE_ICON),
      description: VSCODE_OPENAI_QP_SETUP.PROVIDER_VSCODE_DESC,
    },
    {
      label: VSCODE_OPENAI_QP_SETUP.PROVIDER_OPENAI,
      iconPath: new ThemeIcon(VSCODE_OPENAI_QP_SETUP.PROVIDER_OPENAI_ICON),
      description: VSCODE_OPENAI_QP_SETUP.PROVIDER_OPENAI_DESC,
    },
    {
      label: VSCODE_OPENAI_QP_SETUP.PROVIDER_AZURE,
      iconPath: new ThemeIcon(VSCODE_OPENAI_QP_SETUP.PROVIDER_AZURE_ICON),
      description: VSCODE_OPENAI_QP_SETUP.PROVIDER_AZURE_DESC,
    },
    {
      label: VSCODE_OPENAI_QP_SETUP.PROVIDER_CUSTOM,
      iconPath: new ThemeIcon(VSCODE_OPENAI_QP_SETUP.PROVIDER_CUSTOM_ICON),
      description: VSCODE_OPENAI_QP_SETUP.PROVIDER_CUSTOM_DESC,
    },
  ]
  return quickPickItemTypes
}

function BuildQuickPickConfiguration(): QuickPickItem[] {
  const quickPickItemTypes: QuickPickItem[] = [
    {
      label: 'Configuration',
      kind: QuickPickItemKind.Separator,
    },
    {
      label: VSCODE_OPENAI_QP_SETUP.CONFIGURATION_RESET,
      iconPath: new ThemeIcon(VSCODE_OPENAI_QP_SETUP.CONFIGURATION_RESET_ICON),
      description: VSCODE_OPENAI_QP_SETUP.CONFIGURATION_RESET_DESC,
    },
  ]
  return quickPickItemTypes
}

import { ExtensionContext } from 'vscode'
import { ICommand } from '@app/commands'
import { ConfigurationQuickPickProvider } from '@app/providers'

export default class SettingsCommand implements ICommand {
  public readonly id = 'vscode-openai.configuration.show.quickpick'
  private _configurationQuickPick: ConfigurationQuickPickProvider
  public constructor(context: ExtensionContext) {
    this._configurationQuickPick =
      ConfigurationQuickPickProvider.getInstance(context)
  }

  public async execute() {
    this._configurationQuickPick.execute()
  }
}

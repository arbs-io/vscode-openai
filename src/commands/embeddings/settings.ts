import { commands } from 'vscode'
import { ICommand } from '@app/commands'

export default class SettingsCommand implements ICommand {
  public readonly id = '_vscode-openai.embeddings.settings'

  public async execute() {
    commands.executeCommand(
      'workbench.action.openSettings',
      'vscode-openai.embedding-configuration'
    )
  }
}

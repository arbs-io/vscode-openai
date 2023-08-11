import { commands } from 'vscode'
import { Command } from '../commandManager'

export default class SettingsCommand implements Command {
  public readonly id = 'vscode-openai.embeddings.settings'

  public async execute() {
    commands.executeCommand(
      'workbench.action.openSettings',
      'vscode-openai.embedding-configuration'
    )
  }
}

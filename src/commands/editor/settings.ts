import { commands } from 'vscode'
import { Command } from '../commandManager'

export default class SettingsCommand implements Command {
  public readonly id = '_vscode-openai.editor.settings'

  public async execute() {
    commands.executeCommand(
      'workbench.action.openSettings',
      'vscode-openai.editor.code'
    )
  }
}

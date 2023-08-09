import { commands } from 'vscode'
import { Command } from '../commandManager'

export default class SettingsCommand implements Command {
  public readonly id = 'vscode-openai.conversations.settings'
  public constructor() {}

  public async execute() {
    commands.executeCommand(
      'workbench.action.openSettings',
      'vscode-openai.conversation-configuration'
    )
  }
}

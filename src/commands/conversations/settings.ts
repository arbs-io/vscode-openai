import { commands } from 'vscode'
import { Command } from '../commandManager'

export default class SettingsConversationsCommand implements Command {
  public readonly id = '_vscode-openai.conversations.settings'

  public async execute() {
    commands.executeCommand(
      'workbench.action.openSettings',
      'vscode-openai.conversation-configuration'
    )
  }
}

import { commands } from 'vscode';
import { ICommand } from '@app/commands';

export default class SettingsCommand implements ICommand {
  public readonly id = '_vscode-openai.editor.settings';

  public async execute() {
    commands.executeCommand(
      'workbench.action.openSettings',
      'vscode-openai.editor.code'
    );
  }
}

import { ExtensionContext, commands } from 'vscode'
import { VSCODE_OPENAI_PROMPT } from '@app/contexts'

export function registerOpenSettings(context: ExtensionContext): void {
  context.subscriptions.push(
    commands.registerCommand(
      VSCODE_OPENAI_PROMPT.PROMPT_SETTINGS_EDIT_COMMAND_ID,
      async () => {
        commands.executeCommand(
          'workbench.action.openSettings',
          'vscode-openai.editor-prompt'
        )
      }
    )
  )
}

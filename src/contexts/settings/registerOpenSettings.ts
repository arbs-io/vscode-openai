import { ExtensionContext, commands } from 'vscode'
import { VSCODE_OPENAI_EXTENSION } from '@app/constants'
import { createErrorNotification } from '@app/utilities/node'

export function registerOpenSettings(context: ExtensionContext): void {
  try {
    context.subscriptions.push(
      commands.registerCommand(
        VSCODE_OPENAI_EXTENSION.SETTINGS_PROMPT_EDIT_COMMAND_ID,
        async () => {
          commands.executeCommand(
            'workbench.action.openSettings',
            'vscode-openai.prompt-editor'
          )
        }
      )
    )
  } catch (error) {
    createErrorNotification(error)
  }
}

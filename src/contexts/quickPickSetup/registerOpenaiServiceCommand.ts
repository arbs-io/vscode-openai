import { commands, ExtensionContext } from 'vscode'
import { VSCODE_OPENAI_REGISTER } from '@app/contexts'
import { QuickPickSetupCommand } from './quickPickSetupCommand'

export function registerOpenaiServiceCommand(context: ExtensionContext) {
  const openAiCmd = QuickPickSetupCommand.getInstance()

  context.subscriptions.push(
    commands.registerCommand(VSCODE_OPENAI_REGISTER.SERVICE_COMMAND_ID, () =>
      openAiCmd.execute(context)
    )
  )
}

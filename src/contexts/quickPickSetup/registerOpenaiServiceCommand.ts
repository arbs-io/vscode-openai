import { commands, ExtensionContext } from 'vscode'
import { VSCODE_OPENAI_REGISTER } from '@app/contexts'
import { OpenaiQuickPickCommand } from './openaiQuickPickCommand'

export function registerOpenaiServiceCommand(context: ExtensionContext) {
  const openAiCmd = OpenaiQuickPickCommand.getInstance(context)

  context.subscriptions.push(
    commands.registerCommand(VSCODE_OPENAI_REGISTER.SERVICE_COMMAND_ID, () =>
      openAiCmd.execute()
    )
  )
}

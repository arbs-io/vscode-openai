import { commands, ExtensionContext, window } from 'vscode'
import { VSCODE_OPENAI_SCM } from '@app/contexts'
import { showMessageWithTimeout } from '@app/utilities/vscode'

export function registerOpenaiSCMCommand(context: ExtensionContext) {
  _registerOpenaiSCMCommand(context)
}

function _registerOpenaiSCMCommand(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand(VSCODE_OPENAI_SCM.COMMENT_COMMAND_ID, async () => {
      showMessageWithTimeout('working...', 1000)
    })
  )
}

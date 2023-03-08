import { commands, ExtensionContext, Uri } from 'vscode'
import { ChatThreadPanel } from '../panels/ChatThreadPanel'
import { PANEL_MESSAGE_COMMAND_ID } from './openaiCommands'

export function registerShowClaimsetPreviewCommand(context: ExtensionContext) {
  _registerCommand(context)
}

function _registerCommand(context: ExtensionContext) {
  const commandHandler = (uri: Uri) => {
    ChatThreadPanel.render(context.extensionUri)
  }
  context.subscriptions.push(
    commands.registerCommand(PANEL_MESSAGE_COMMAND_ID, commandHandler)
  )
}
